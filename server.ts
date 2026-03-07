import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import db from "./db.ts";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "workbridge_secret_key_123";
const PORT = 3000;

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  app.use(express.json());

  // --- Auth Middleware ---
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // --- Auth Routes ---
  app.post("/api/auth/register", async (req, res) => {
    const { name, email, phone, password, role, location } = req.body;
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      db.prepare(
        "INSERT INTO users (userId, name, email, phone, password, role, location) VALUES (?, ?, ?, ?, ?, ?, ?)"
      ).run(userId, name, email, phone, hashedPassword, role, location);

      if (role === "business") {
        const businessId = uuidv4();
        db.prepare(
          "INSERT INTO businesses (businessId, ownerId, location) VALUES (?, ?, ?)"
        ).run(businessId, userId, location);
      }

      const token = jwt.sign({ userId, role, email }, JWT_SECRET);
      res.status(201).json({ token, user: { userId, name, email, role, phone, location } });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user: any = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.userId, role: user.role, email: user.email }, JWT_SECRET);
    res.json({ token, user: { userId: user.userId, name: user.name, email: user.email, role: user.role, phone: user.phone, location: user.location } });
  });

  // --- Jobs Routes ---
  app.get("/api/jobs", (req, res) => {
    const jobs = db.prepare(`
      SELECT j.*, b.category, u.name as businessName, u.userId as ownerId 
      FROM jobs j 
      JOIN businesses b ON j.businessId = b.businessId 
      JOIN users u ON b.ownerId = u.userId
      WHERE j.status = 'open'
      ORDER BY j.createdAt DESC
    `).all();
    res.json(jobs);
  });

  app.post("/api/jobs", authenticateToken, (req: any, res) => {
    if (req.user.role !== "business") return res.sendStatus(403);
    const { title, salary, location, requiredSkills, description, experienceLevel } = req.body;
    const jobId = uuidv4();
    const business: any = db.prepare("SELECT businessId FROM businesses WHERE ownerId = ?").get(req.user.userId);

    if (!business) return res.status(404).json({ error: "Business profile not found" });

    db.prepare(
      "INSERT INTO jobs (jobId, businessId, title, salary, location, requiredSkills, description, experienceLevel) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    ).run(jobId, business.businessId, title, salary, location, requiredSkills, description, experienceLevel || 'Entry Level');

    res.status(201).json({ jobId });
  });

  app.put("/api/jobs/:id", authenticateToken, (req: any, res) => {
    if (req.user.role !== "admin") return res.sendStatus(403);
    const { title, salary, location, requiredSkills, description, status } = req.body;
    db.prepare(
      "UPDATE jobs SET title = ?, salary = ?, location = ?, requiredSkills = ?, description = ?, status = ? WHERE jobId = ?"
    ).run(title, salary, location, requiredSkills, description, status, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/jobs/:id", authenticateToken, (req: any, res) => {
    if (req.user.role !== "admin") return res.sendStatus(403);
    db.prepare("DELETE FROM jobs WHERE jobId = ?").run(req.params.id);
    res.json({ success: true });
  });

  // --- Applications Routes ---
  app.post("/api/jobs/apply", authenticateToken, (req: any, res) => {
    if (req.user.role !== "helper") return res.sendStatus(403);
    const { jobId, profileSnapshot } = req.body;
    const applicationId = uuidv4();

    try {
      db.prepare(
        "INSERT INTO applications (applicationId, jobId, helperId, profileSnapshot) VALUES (?, ?, ?, ?)"
      ).run(applicationId, jobId, req.user.userId, profileSnapshot ? JSON.stringify(profileSnapshot) : null);
      res.status(201).json({ applicationId });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/applications", authenticateToken, (req: any, res) => {
    let applications;
    if (req.user.role === "helper") {
      applications = db.prepare(`
        SELECT a.*, j.title, u.name as businessName 
        FROM applications a 
        JOIN jobs j ON a.jobId = j.jobId 
        JOIN businesses b ON j.businessId = b.businessId
        JOIN users u ON b.ownerId = u.userId
        WHERE a.helperId = ?
      `).all(req.user.userId);
    } else if (req.user.role === "business") {
      const business: any = db.prepare("SELECT businessId FROM businesses WHERE ownerId = ?").get(req.user.userId);
      applications = db.prepare(`
        SELECT a.*, j.title, u.name as applicantName, u.phone as applicantPhone
        FROM applications a 
        JOIN jobs j ON a.jobId = j.jobId 
        JOIN users u ON a.helperId = u.userId
        WHERE j.businessId = ?
      `).all(business.businessId);
    }
    res.json(applications);
  });

  app.put("/api/applications/:id/status", authenticateToken, (req: any, res) => {
    if (req.user.role !== "business") return res.sendStatus(403);
    const { status } = req.body;
    db.prepare("UPDATE applications SET status = ? WHERE applicationId = ?").run(status, req.params.id);
    res.json({ success: true });
  });

  // --- Offers Routes ---
  app.get("/api/offers", (req, res) => {
    const offers = db.prepare(`
      SELECT o.*, u.name as businessName, u.userId as ownerId 
      FROM offers o 
      JOIN businesses b ON o.businessId = b.businessId 
      JOIN users u ON b.ownerId = u.userId
      ORDER BY o.createdAt DESC
    `).all();
    res.json(offers);
  });

  app.post("/api/offers", authenticateToken, (req: any, res) => {
    if (req.user.role !== "business") return res.sendStatus(403);
    const { title, description, expiryDate } = req.body;
    const offerId = uuidv4();
    const business: any = db.prepare("SELECT businessId FROM businesses WHERE ownerId = ?").get(req.user.userId);

    db.prepare(
      "INSERT INTO offers (offerId, businessId, title, description, expiryDate) VALUES (?, ?, ?, ?, ?)"
    ).run(offerId, business.businessId, title, description, expiryDate);

    res.status(201).json({ offerId });
  });

  app.put("/api/offers/:id", authenticateToken, (req: any, res) => {
    if (req.user.role !== "admin") return res.sendStatus(403);
    const { title, description, expiryDate } = req.body;
    db.prepare(
      "UPDATE offers SET title = ?, description = ?, expiryDate = ? WHERE offerId = ?"
    ).run(title, description, expiryDate, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/offers/:id", authenticateToken, (req: any, res) => {
    if (req.user.role !== "admin") return res.sendStatus(403);
    db.prepare("DELETE FROM offers WHERE offerId = ?").run(req.params.id);
    res.json({ success: true });
  });

  // --- Comments Routes ---
  app.get("/api/comments/:postId", (req, res) => {
    const comments = db.prepare(`
      SELECT c.*, u.name as userName 
      FROM comments c 
      JOIN users u ON c.userId = u.userId 
      WHERE c.postId = ? 
      ORDER BY c.createdAt DESC
    `).all(req.params.postId);
    res.json(comments);
  });

  app.post("/api/comments", authenticateToken, (req: any, res) => {
    const { postId, postType, content } = req.body;
    const commentId = uuidv4();
    db.prepare(
      "INSERT INTO comments (commentId, postId, postType, userId, content) VALUES (?, ?, ?, ?, ?)"
    ).run(commentId, postId, postType, req.user.userId, content);
    res.status(201).json({ commentId });
  });

  // --- Admin Routes ---
  app.get("/api/admin/stats", authenticateToken, (req: any, res) => {
    if (req.user.role !== "admin") return res.sendStatus(403);
    const users = db.prepare("SELECT COUNT(*) as count FROM users").get() as any;
    const jobs = db.prepare("SELECT COUNT(*) as count FROM jobs").get() as any;
    const offers = db.prepare("SELECT COUNT(*) as count FROM offers").get() as any;
    const posters = db.prepare("SELECT COUNT(*) as count FROM posters").get() as any;
    const reports = db.prepare("SELECT COUNT(*) as count FROM reports WHERE status = 'pending'").get() as any;
    
    res.json({
      users: users.count,
      jobs: jobs.count,
      offers: offers.count,
      posters: posters.count,
      reports: reports.count
    });
  });

  app.get("/api/admin/all-jobs", authenticateToken, (req: any, res) => {
    if (req.user.role !== "admin") return res.sendStatus(403);
    const jobs = db.prepare(`
      SELECT j.*, u.name as businessName 
      FROM jobs j 
      JOIN businesses b ON j.businessId = b.businessId 
      JOIN users u ON b.ownerId = u.userId
      ORDER BY j.createdAt DESC
    `).all();
    res.json(jobs);
  });

  app.get("/api/admin/all-offers", authenticateToken, (req: any, res) => {
    if (req.user.role !== "admin") return res.sendStatus(403);
    const offers = db.prepare(`
      SELECT o.*, u.name as businessName 
      FROM offers o 
      JOIN businesses b ON o.businessId = b.businessId 
      JOIN users u ON b.ownerId = u.userId
      ORDER BY o.createdAt DESC
    `).all();
    res.json(offers);
  });

  app.get("/api/admin/all-posters", authenticateToken, (req: any, res) => {
    if (req.user.role !== "admin") return res.sendStatus(403);
    const posters = db.prepare(`
      SELECT p.*, u.name as businessName 
      FROM posters p 
      JOIN businesses b ON p.businessId = b.businessId 
      JOIN users u ON b.ownerId = u.userId
      ORDER BY p.createdAt DESC
    `).all();
    res.json(posters);
  });

  // --- Posters Routes ---
  app.get("/api/posters", (req, res) => {
    const posters = db.prepare(`
      SELECT p.*, u.name as businessName, u.userId as ownerId 
      FROM posters p 
      JOIN businesses b ON p.businessId = b.businessId 
      JOIN users u ON b.ownerId = u.userId
      ORDER BY p.createdAt DESC
    `).all();
    res.json(posters);
  });

  app.post("/api/posters", authenticateToken, (req: any, res) => {
    if (req.user.role !== "business") return res.sendStatus(403);
    const { title, description, imageUrl, price } = req.body;
    const posterId = uuidv4();
    const business: any = db.prepare("SELECT businessId FROM businesses WHERE ownerId = ?").get(req.user.userId);

    if (!business) return res.status(404).json({ error: "Business profile not found" });

    db.prepare(
      "INSERT INTO posters (posterId, businessId, title, description, imageUrl, price) VALUES (?, ?, ?, ?, ?, ?)"
    ).run(posterId, business.businessId, title, description, imageUrl, price);

    res.status(201).json({ posterId });
  });

  app.put("/api/posters/:id", authenticateToken, (req: any, res) => {
    if (req.user.role !== "admin") return res.sendStatus(403);
    const { title, description, imageUrl, price } = req.body;
    db.prepare(
      "UPDATE posters SET title = ?, description = ?, imageUrl = ?, price = ? WHERE posterId = ?"
    ).run(title, description, imageUrl, price, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/posters/:id", authenticateToken, (req: any, res) => {
    if (req.user.role !== "admin") return res.sendStatus(403);
    db.prepare("DELETE FROM posters WHERE posterId = ?").run(req.params.id);
    res.json({ success: true });
  });

  // --- Socket.io Real-time Chat ---
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    socket.on("sendMessage", async (data) => {
      const { senderId, receiverId, content } = data;
      const messageId = uuidv4();
      
      db.prepare(
        "INSERT INTO messages (messageId, senderId, receiverId, content) VALUES (?, ?, ?, ?)"
      ).run(messageId, senderId, receiverId, content);

      io.to(receiverId).emit("message", { messageId, senderId, receiverId, content, createdAt: new Date() });
      io.to(senderId).emit("message", { messageId, senderId, receiverId, content, createdAt: new Date() });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

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
      res.status(201).json({ token, user: { userId, name, email, role } });
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
    res.json({ token, user: { userId: user.userId, name: user.name, email: user.email, role: user.role } });
  });

  // --- Jobs Routes ---
  app.get("/api/jobs", (req, res) => {
    const jobs = db.prepare(`
      SELECT j.*, b.category, u.name as businessName 
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
    const { title, salary, location, requiredSkills, description } = req.body;
    const jobId = uuidv4();
    const business: any = db.prepare("SELECT businessId FROM businesses WHERE ownerId = ?").get(req.user.userId);

    if (!business) return res.status(404).json({ error: "Business profile not found" });

    db.prepare(
      "INSERT INTO jobs (jobId, businessId, title, salary, location, requiredSkills, description) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).run(jobId, business.businessId, title, salary, location, requiredSkills, description);

    res.status(201).json({ jobId });
  });

  // --- Applications Routes ---
  app.post("/api/jobs/apply", authenticateToken, (req: any, res) => {
    if (req.user.role !== "helper") return res.sendStatus(403);
    const { jobId } = req.body;
    const applicationId = uuidv4();

    try {
      db.prepare(
        "INSERT INTO applications (applicationId, jobId, helperId) VALUES (?, ?, ?)"
      ).run(applicationId, jobId, req.user.userId);
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
      SELECT o.*, u.name as businessName 
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

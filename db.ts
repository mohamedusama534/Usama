import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const db = new Database('workbridge.db');

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    userId TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('business', 'helper', 'normal', 'admin')) NOT NULL,
    location TEXT,
    profileImage TEXT,
    rating REAL DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS businesses (
    businessId TEXT PRIMARY KEY,
    ownerId TEXT NOT NULL,
    category TEXT,
    description TEXT,
    location TEXT,
    verifiedStatus BOOLEAN DEFAULT 0,
    FOREIGN KEY (ownerId) REFERENCES users(userId)
  );

  CREATE TABLE IF NOT EXISTS jobs (
    jobId TEXT PRIMARY KEY,
    businessId TEXT NOT NULL,
    title TEXT NOT NULL,
    salary TEXT,
    location TEXT,
    requiredSkills TEXT,
    description TEXT,
    status TEXT CHECK(status IN ('open', 'closed', 'completed')) DEFAULT 'open',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (businessId) REFERENCES businesses(businessId)
  );

  CREATE TABLE IF NOT EXISTS applications (
    applicationId TEXT PRIMARY KEY,
    jobId TEXT NOT NULL,
    helperId TEXT NOT NULL,
    status TEXT CHECK(status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
    appliedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (jobId) REFERENCES jobs(jobId),
    FOREIGN KEY (helperId) REFERENCES users(userId)
  );

  CREATE TABLE IF NOT EXISTS offers (
    offerId TEXT PRIMARY KEY,
    businessId TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    expiryDate DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (businessId) REFERENCES businesses(businessId)
  );

  CREATE TABLE IF NOT EXISTS reviews (
    reviewId TEXT PRIMARY KEY,
    fromUserId TEXT NOT NULL,
    toUserId TEXT NOT NULL,
    rating INTEGER CHECK(rating >= 1 AND rating <= 5),
    comment TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fromUserId) REFERENCES users(userId),
    FOREIGN KEY (toUserId) REFERENCES users(userId)
  );

  CREATE TABLE IF NOT EXISTS reports (
    reportId TEXT PRIMARY KEY,
    reportedUserId TEXT NOT NULL,
    reason TEXT,
    status TEXT DEFAULT 'pending',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reportedUserId) REFERENCES users(userId)
  );

  CREATE TABLE IF NOT EXISTS messages (
    messageId TEXT PRIMARY KEY,
    senderId TEXT NOT NULL,
    receiverId TEXT NOT NULL,
    content TEXT NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (senderId) REFERENCES users(userId),
    FOREIGN KEY (receiverId) REFERENCES users(userId)
  );
`);

// --- Seed Data ---
const seed = async () => {
  const userCount = (db.prepare("SELECT COUNT(*) as count FROM users").get() as any).count;
  
  if (userCount === 0) {
    console.log("Seeding initial data...");
    
    const users = [
      { id: uuidv4(), name: 'Admin User', email: 'admin@workbridge.com', password: 'admin123', role: 'admin' },
      { id: uuidv4(), name: 'Business Owner', email: 'business@workbridge.com', password: 'business123', role: 'business' },
      { id: uuidv4(), name: 'Helper User', email: 'helper@workbridge.com', password: 'helper123', role: 'helper' },
      { id: uuidv4(), name: 'Normal User', email: 'user@workbridge.com', password: 'user123', role: 'normal' },
    ];

    for (const u of users) {
      const hashedPassword = await bcrypt.hash(u.password, 10);
      db.prepare(
        "INSERT INTO users (userId, name, email, password, role, location) VALUES (?, ?, ?, ?, ?, ?)"
      ).run(u.id, u.name, u.email, hashedPassword, u.role, 'Chennai, Tamil Nadu');

      if (u.role === 'business') {
        const businessId = uuidv4();
        db.prepare(
          "INSERT INTO businesses (businessId, ownerId, location, category) VALUES (?, ?, ?, ?)"
        ).run(businessId, u.id, 'Chennai, Tamil Nadu', 'General Services');
        
        // Add a sample job
        db.prepare(
          "INSERT INTO jobs (jobId, businessId, title, salary, location, requiredSkills, description) VALUES (?, ?, ?, ?, ?, ?, ?)"
        ).run(
          uuidv4(), 
          businessId, 
          'Delivery Helper', 
          '₹15,000', 
          'Chennai', 
          'Driving, Basic Tamil', 
          'Looking for a helper to assist with local deliveries in the city.'
        );

        // Add a sample offer
        db.prepare(
          "INSERT INTO offers (offerId, businessId, title, description, expiryDate) VALUES (?, ?, ?, ?, ?)"
        ).run(
          uuidv4(),
          businessId,
          '10% Off Services',
          'Get 10% off all our services for first-time users.',
          '2026-12-31'
        );
      }
    }
    console.log("Seeding complete.");
  }
};

seed();

export default db;

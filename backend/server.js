const express = require("express");
const cors    = require("cors");
const helmet  = require("helmet");
require("dotenv").config();

const { apiLimiter, sanitizeBody, securityHeaders } = require("./middleware/security");

const app = express();

// ── Security headers (helmet) ──
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// ── Custom security headers ──
app.use(securityHeaders);

// ── CORS — only allow your Netlify domain ──
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.FRONTEND_URL || "https://kiddo-kg.netlify.app",
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// ── Body parser ──
app.use(express.json({ limit: "10kb" })); // limit request size

// ── Input sanitization ──
app.use(sanitizeBody);

// ── Rate limiting ──
app.use("/api/", apiLimiter);

// ── Routes ──
const { loginLimiter } = require("./middleware/security");
app.use("/api/auth",          loginLimiter, require("./routes/auth"));
app.use("/api/student",       require("./routes/student"));
app.use("/api/teacher",       require("./routes/teacher"));
app.use("/api/admin",         require("./routes/admin"));
app.use("/api/announcements", require("./routes/announcements"));
app.use("/api/schedule",      require("./routes/schedule"));
app.use("/api/courses",       require("./routes/courses"));
app.use("/api/assignments",   require("./routes/assignments"));
app.use("/api/grades",        require("./routes/grades"));
app.use("/api/attendance",    require("./routes/attendance"));
app.use("/api/messages",      require("./routes/messages"));
app.use("/api/groupchat",     require("./routes/groupchat"));
app.use("/api/teacherchat",    require("./routes/teacherchat"));

// ── Health check ──
app.get("/", (req, res) => res.json({ message: "🎒 Kiddo API is running!" }));

// ── Global error handler ──
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong. Please try again." });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Kiddo server running on http://localhost:${PORT}`));

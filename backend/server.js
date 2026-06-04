const express  = require("express");
const cors     = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();

// ── CORS ──
app.use(cors({ origin: "*" }));

// ── Body parser ──
app.use(express.json({ limit: "10kb" }));

// ── Rate limiting: login — max 10 attempts per 15 min ──
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many login attempts. Please wait 15 minutes and try again." },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Rate limiting: general API — max 100 per minute ──
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { error: "Too many requests. Please slow down." },
});

// ── Security headers ──
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

// ── Input sanitization — strip HTML/script tags ──
function sanitize(val) {
  if (typeof val !== "string") return val;
  return val.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "").replace(/<[^>]+>/g, "").trim();
}
app.use((req, res, next) => {
  if (req.body && typeof req.body === "object") {
    for (const key of Object.keys(req.body)) {
      if (typeof req.body[key] === "string") req.body[key] = sanitize(req.body[key]);
    }
  }
  next();
});

// ── Routes ──
app.use("/api/auth",          loginLimiter, require("./routes/auth"));
app.use("/api/student",       apiLimiter, require("./routes/student"));
app.use("/api/teacher",       apiLimiter, require("./routes/teacher"));
app.use("/api/admin",         apiLimiter, require("./routes/admin"));
app.use("/api/announcements", apiLimiter, require("./routes/announcements"));
app.use("/api/schedule",      apiLimiter, require("./routes/schedule"));
app.use("/api/courses",       apiLimiter, require("./routes/courses"));
app.use("/api/assignments",   apiLimiter, require("./routes/assignments"));
app.use("/api/grades",        apiLimiter, require("./routes/grades"));
app.use("/api/attendance",    apiLimiter, require("./routes/attendance"));
app.use("/api/messages",      apiLimiter, require("./routes/messages"));
app.use("/api/groupchat",     apiLimiter, require("./routes/groupchat"));
app.use("/api/teacherchat",   apiLimiter, require("./routes/teacherchat"));

app.get("/", (req, res) => res.json({ message: "🎒 Kiddo API is running!" }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong." });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Kiddo server running on http://localhost:${PORT}`));
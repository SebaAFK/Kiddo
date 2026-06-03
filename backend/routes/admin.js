const router = require("express").Router();
const auth   = require("../middleware/auth");
const db     = require("../db");
const bcrypt = require("bcryptjs");

// Middleware to ensure only admins can access
function adminOnly(req, res, next) {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Admin access required." });
  next();
}

// ── GET /api/admin/stats — dashboard overview stats ──
router.get("/stats", auth, adminOnly, async (req, res) => {
  try {
    const [[students]]   = await db.query("SELECT COUNT(*) as count FROM student");
    const [[teachers]]   = await db.query("SELECT COUNT(*) as count FROM teacher");
    const [[anns]]       = await db.query("SELECT COUNT(*) as count FROM announcement");
    const [[msgs]]       = await db.query("SELECT COUNT(*) as count FROM group_message");
    const today          = new Date().toISOString().split("T")[0];
    const [[present]]    = await db.query("SELECT COUNT(*) as count FROM teacher_attendance WHERE date=? AND status='present'", [today]);
    const [[absent]]     = await db.query("SELECT COUNT(*) as count FROM teacher_attendance WHERE date=? AND status='absent'", [today]);
    res.json({ students: students.count, teachers: teachers.count, announcements: anns.count, messages: msgs.count, present_today: present.count, absent_today: absent.count });
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error." }); }
});

// ── GET /api/admin/teachers — list all teachers ──
router.get("/teachers", auth, adminOnly, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT teacher_id, teacher_name, class FROM teacher ORDER BY teacher_id");
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error." }); }
});

// ── GET /api/admin/students — list all students ──
router.get("/students", auth, adminOnly, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT username, first_name, last_name, grade, medical_condition FROM student ORDER BY grade, first_name");
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error." }); }
});

// ── POST /api/admin/register/teacher ──
router.post("/register/teacher", auth, adminOnly, async (req, res) => {
  const { teacher_id, teacher_name, class: cls, password } = req.body;
  if (!teacher_id || !teacher_name || !password) return res.status(400).json({ error: "All fields required." });
  try {
    const hashed = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO teacher (teacher_id, teacher_name, class, password) VALUES (?,?,?,?)", [teacher_id, teacher_name, cls || "Unassigned", hashed]);
    res.json({ success: true, message: `Teacher ${teacher_name} created!` });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") return res.status(400).json({ error: "Teacher ID already exists." });
    res.status(500).json({ error: "Server error." });
  }
});

// ── POST /api/admin/register/student ──
router.post("/register/student", auth, adminOnly, async (req, res) => {
  const { username, first_name, last_name, phone_number, date_of_birth, address, grade, medical_condition, password } = req.body;
  if (!username || !first_name || !last_name || !password) return res.status(400).json({ error: "Required fields missing." });
  try {
    const hashed = await bcrypt.hash(password, 10);
    await db.query(
      "INSERT INTO student (username, first_name, last_name, phone_number, date_of_birth, address, grade, medical_condition, password) VALUES (?,?,?,?,?,?,?,?,?)",
      [username, first_name, last_name, phone_number||"", date_of_birth||null, address||"", grade||1, medical_condition||"None", hashed]
    );
    res.json({ success: true, message: `Student ${first_name} ${last_name} created!` });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") return res.status(400).json({ error: "Username already exists." });
    res.status(500).json({ error: "Server error." });
  }
});

// ── DELETE /api/admin/teacher/:id ──
router.delete("/teacher/:id", auth, adminOnly, async (req, res) => {
  try {
    await db.query("DELETE FROM teacher WHERE teacher_id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: "Server error." }); }
});

// ── DELETE /api/admin/student/:username ──
router.delete("/student/:username", auth, adminOnly, async (req, res) => {
  try {
    await db.query("DELETE FROM student WHERE username = ?", [req.params.username]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: "Server error." }); }
});

// ── CHAT: GET /api/admin/chat/:teacher_id ──
router.get("/chat/:teacher_id", auth, adminOnly, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM admin_chat WHERE teacher_id=? ORDER BY sent_at ASC",
      [req.params.teacher_id]
    );
    // Mark as read
    await db.query("UPDATE admin_chat SET is_read=TRUE WHERE teacher_id=? AND sender_type='teacher'", [req.params.teacher_id]);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: "Server error." }); }
});

// ── CHAT: POST /api/admin/chat ──
router.post("/chat", auth, adminOnly, async (req, res) => {
  const { teacher_id, content } = req.body;
  if (!content?.trim()) return res.status(400).json({ error: "Message is empty." });
  try {
    const [admin] = await db.query("SELECT admin_name FROM admin WHERE admin_id=?", [req.user.admin_id]);
    const name = admin[0]?.admin_name || "Admin";
    await db.query("INSERT INTO admin_chat (teacher_id, sender_type, sender_name, content) VALUES (?,?,?,?)", [teacher_id, "admin", name, content.trim()]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: "Server error." }); }
});

// ── ATTENDANCE: GET /api/admin/attendance?date=YYYY-MM-DD ──
router.get("/attendance", auth, adminOnly, async (req, res) => {
  const date = req.query.date || new Date().toISOString().split("T")[0];
  try {
    const [teachers] = await db.query("SELECT teacher_id, teacher_name FROM teacher");
    const [records]  = await db.query("SELECT * FROM teacher_attendance WHERE date=?", [date]);
    const map = {};
    records.forEach(r => { map[r.teacher_id] = r; });
    const result = teachers.map(t => ({ ...t, status: map[t.teacher_id]?.status || null, note: map[t.teacher_id]?.note || "" }));
    res.json(result);
  } catch (err) { res.status(500).json({ error: "Server error." }); }
});

// ── ATTENDANCE: POST /api/admin/attendance ──
router.post("/attendance", auth, adminOnly, async (req, res) => {
  const { teacher_id, status, date, note } = req.body;
  const d = date || new Date().toISOString().split("T")[0];
  try {
    await db.query(
      "INSERT INTO teacher_attendance (teacher_id, date, status, note) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE status=?, note=?",
      [teacher_id, d, status, note||"", status, note||""]
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: "Server error." }); }
});

// ── KPI: GET /api/admin/kpi/:teacher_id ──
router.get("/kpi/:teacher_id", auth, adminOnly, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM teacher_kpi WHERE teacher_id=? ORDER BY created_at DESC", [req.params.teacher_id]);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: "Server error." }); }
});

// ── KPI: GET /api/admin/kpi — all KPIs ──
router.get("/kpi", auth, adminOnly, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT k.*, t.teacher_name FROM teacher_kpi k 
       JOIN teacher t ON k.teacher_id = t.teacher_id 
       ORDER BY k.created_at DESC`
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ error: "Server error." }); }
});

// ── KPI: POST /api/admin/kpi ──
router.post("/kpi", auth, adminOnly, async (req, res) => {
  const { teacher_id, title, description, status, is_top_performer } = req.body;
  if (!teacher_id || !title) return res.status(400).json({ error: "Teacher and title required." });
  try {
    await db.query(
      "INSERT INTO teacher_kpi (teacher_id, title, description, status, is_top_performer) VALUES (?,?,?,?,?)",
      [teacher_id, title, description||"", status||"pending", is_top_performer||false]
    );
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: "Server error." }); }
});

// ── KPI: PUT /api/admin/kpi/:id ──
router.put("/kpi/:id", auth, adminOnly, async (req, res) => {
  const { status, is_top_performer } = req.body;
  try {
    await db.query("UPDATE teacher_kpi SET status=?, is_top_performer=? WHERE kpi_id=?", [status, is_top_performer, req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: "Server error." }); }
});

// ── KPI: DELETE /api/admin/kpi/:id ──
router.delete("/kpi/:id", auth, adminOnly, async (req, res) => {
  try {
    await db.query("DELETE FROM teacher_kpi WHERE kpi_id=?", [req.params.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: "Server error." }); }
});

module.exports = router;

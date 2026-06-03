const router = require("express").Router();
const auth   = require("../middleware/auth");
const db     = require("../db");

// GET /api/teacherchat — get admin messages for this teacher
router.get("/", auth, async (req, res) => {
  const teacher_id = req.user.teacher_id;
  if (!teacher_id) return res.status(403).json({ error: "Teacher access required." });
  try {
    const [rows] = await db.query(
      "SELECT * FROM admin_chat WHERE teacher_id=? ORDER BY sent_at ASC",
      [teacher_id]
    );
    await db.query("UPDATE admin_chat SET is_read=TRUE WHERE teacher_id=? AND sender_type='admin'", [teacher_id]);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: "Server error." }); }
});

// POST /api/teacherchat — teacher replies to admin
router.post("/", auth, async (req, res) => {
  const teacher_id = req.user.teacher_id;
  const { content } = req.body;
  if (!content?.trim()) return res.status(400).json({ error: "Message empty." });
  try {
    const [teacher] = await db.query("SELECT teacher_name FROM teacher WHERE teacher_id=?", [teacher_id]);
    const name = teacher[0]?.teacher_name || teacher_id;
    await db.query("INSERT INTO admin_chat (teacher_id, sender_type, sender_name, content) VALUES (?,?,?,?)", [teacher_id, "teacher", name, content.trim()]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: "Server error." }); }
});

module.exports = router;

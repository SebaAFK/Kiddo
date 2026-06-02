const router = require("express").Router();
const auth   = require("../middleware/auth");
const db     = require("../db");

router.get("/", auth, async (req, res) => {
  const { username } = req.user;
  try {
    const [students] = await db.query("SELECT phone_number FROM student WHERE username=?", [username]);
    if (!students.length) return res.status(404).json({ error: "Student not found." });
    const phone = students[0].phone_number;
    const [rows] = await db.query(
      `SELECT m.*,t.teacher_name,t.teacher_id FROM message m
       JOIN teacher t ON m.receiver_id=t.teacher_id
       WHERE m.sender_phone=? ORDER BY m.sent_at DESC`, [phone]);
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error." }); }
});

router.post("/", auth, async (req, res) => {
  const { username } = req.user;
  const { receiver_id, content } = req.body;
  try {
    const [students] = await db.query("SELECT phone_number FROM student WHERE username=?", [username]);
    const phone = students[0].phone_number;
    await db.query("INSERT INTO message (sender_phone,receiver_id,content) VALUES (?,?,?)", [phone, receiver_id, content]);
    res.json({ success: true });
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error." }); }
});

module.exports = router;

const router = require("express").Router();
const auth   = require("../middleware/auth");
const db     = require("../db");

// GET /api/groupchat?grade=1
// Everyone (teacher or student) gets messages for a grade
router.get("/", auth, async (req, res) => {
  let grade = req.query.grade;

  // If student, use their grade automatically
  if (req.user.role === "student") {
    grade = req.user.grade;
  }

  if (!grade) return res.status(400).json({ error: "Grade required." });

  try {
    const [rows] = await db.query(
      "SELECT * FROM group_message WHERE grade = ? ORDER BY sent_at ASC",
      [grade]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
});

// POST /api/groupchat
// Send a message to a grade group
router.post("/", auth, async (req, res) => {
  const { grade, content } = req.body;
  if (!content?.trim()) return res.status(400).json({ error: "Message is empty." });

  let sender_name = "Unknown";
  let sender_type = req.user.role;
  let target_grade = grade;

  try {
    if (req.user.role === "teacher") {
      const [teacher] = await db.query(
        "SELECT teacher_name FROM teacher WHERE teacher_id = ?", [req.user.teacher_id]
      );
      sender_name = teacher[0]?.teacher_name || req.user.teacher_id;
    } else if (req.user.role === "student") {
      const [student] = await db.query(
        "SELECT first_name, last_name, grade FROM student WHERE username = ?", [req.user.username]
      );
      sender_name = `${student[0]?.first_name || ""} ${student[0]?.last_name || ""}`.trim() + " (Parent)";
      target_grade = student[0]?.grade;
    } else if (req.user.role === "admin") {
      const [admin] = await db.query(
        "SELECT admin_name FROM admin WHERE admin_id = ?", [req.user.admin_id]
      );
      sender_name = admin[0]?.admin_name || "Admin";
    }

    await db.query(
      "INSERT INTO group_message (grade, sender_name, sender_type, content) VALUES (?,?,?,?)",
      [target_grade, sender_name, sender_type, content.trim()]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;

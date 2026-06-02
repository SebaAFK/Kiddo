const router = require("express").Router();
const auth   = require("../middleware/auth");
const db     = require("../db");

router.get("/", auth, async (req, res) => {
  const { username } = req.user;
  try {
    const [rows] = await db.query(
      `SELECT g.*,a.title,a.max_score,a.due_date,c.class_name,c.teacher_name
       FROM grade g JOIN assignment a ON g.assignment_id=a.assignment_id
       JOIN class c ON a.class_number=c.class_number
       WHERE g.student_username=? ORDER BY g.submitted_at DESC`, [username]);
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error." }); }
});

module.exports = router;

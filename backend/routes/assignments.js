const router = require("express").Router();
const auth   = require("../middleware/auth");
const db     = require("../db");

router.get("/", auth, async (req, res) => {
  const grade = req.user.grade;
  try {
    const [rows] = await db.query(
      `SELECT a.*,c.class_name,c.teacher_name FROM assignment a
       JOIN class c ON a.class_number=c.class_number
       WHERE c.grade=? ORDER BY a.due_date ASC`, [grade]);
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error." }); }
});

module.exports = router;

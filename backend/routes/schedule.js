const router = require("express").Router();
const auth   = require("../middleware/auth");
const db     = require("../db");

router.get("/", auth, async (req, res) => {
  const grade = req.user.grade;
  const day   = req.query.day || "Sunday";
  try {
    const [rows] = await db.query(
      `SELECT s.*,c.class_name,c.teacher_name FROM schedule s
       JOIN class c ON s.class_number=c.class_number
       WHERE c.grade=? AND s.day_of_week=? ORDER BY s.start_time`, [grade, day]);
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error." }); }
});

module.exports = router;

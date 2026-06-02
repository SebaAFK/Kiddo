const router = require("express").Router();
const auth   = require("../middleware/auth");
const db     = require("../db");

// GET /api/student/me
router.get("/me", auth, async (req, res) => {
  const { username } = req.user;
  try {
    const [students] = await db.query(
      "SELECT username,first_name,last_name,phone_number,date_of_birth,address,grade,medical_condition FROM student WHERE username=?", [username]);
    if (!students.length) return res.status(404).json({ error: "Student not found." });
    const s = students[0];
    const [parents] = await db.query("SELECT * FROM parent WHERE phone_number=?", [s.phone_number]);
    const [classes] = await db.query("SELECT * FROM class WHERE grade=?", [s.grade]);
    res.json({ student: s, parent: parents[0]||null, classes });
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error." }); }
});

module.exports = router;

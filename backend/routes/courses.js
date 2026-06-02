const router = require("express").Router();
const auth   = require("../middleware/auth");
const db     = require("../db");

router.get("/", auth, async (req, res) => {
  const grade = req.user.grade;
  try {
    const [rows] = await db.query("SELECT * FROM class WHERE grade=? ORDER BY class_number", [grade]);
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error." }); }
});

module.exports = router;

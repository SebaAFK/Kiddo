const router = require("express").Router();
const auth   = require("../middleware/auth");
const db     = require("../db");

router.get("/", auth, async (req, res) => {
  const { username } = req.user;
  try {
    const [rows] = await db.query(
      "SELECT * FROM attendance WHERE student_username=? ORDER BY date DESC", [username]);
    const present = rows.filter(r=>r.status==="present").length;
    const absent  = rows.filter(r=>r.status==="absent").length;
    const late    = rows.filter(r=>r.status==="late").length;
    const total   = rows.length;
    res.json({ records: rows, summary: { present, absent, late, total, percentage: total>0?Math.round((present/total)*100):0 } });
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error." }); }
});

module.exports = router;

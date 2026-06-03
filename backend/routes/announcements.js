const router = require("express").Router();
const auth   = require("../middleware/auth");
const db     = require("../db");

// GET /api/announcements
router.get("/", auth, async (req, res) => {
  try {
    let rows;
    if (req.user.role === "student") {
      const grade = req.user.grade;
      // Cast target_grade to INT so "1" == 1 comparison works
      [rows] = await db.query(
        `SELECT * FROM announcement 
         WHERE CAST(target_grade AS UNSIGNED) = ? 
            OR target_grade IS NULL 
            OR target_grade = ''
         ORDER BY date_posted DESC`,
        [grade]
      );
    } else {
      [rows] = await db.query(
        "SELECT * FROM announcement ORDER BY date_posted DESC"
      );
    }
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
});

// POST /api/announcements — teacher or admin posts
router.post("/", auth, async (req, res) => {
  const { title, description, badge_type, target_grade } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required." });

  try {
    let author = "Admin";

    if (req.user.role === "teacher") {
      const [teacher] = await db.query(
        "SELECT teacher_name FROM teacher WHERE teacher_id = ?",
        [req.user.teacher_id]
      );
      author = teacher[0]?.teacher_name || req.user.teacher_id;
    } else if (req.user.role === "admin") {
      const [admin] = await db.query(
        "SELECT admin_name FROM admin WHERE admin_id = ?",
        [req.user.admin_id]
      );
      author = admin[0]?.admin_name || "Admin";
    }

    // Store target_grade as NULL if empty/null, otherwise as integer
    const gradeVal = (target_grade && target_grade !== "") ? parseInt(target_grade) : null;

    await db.query(
      "INSERT INTO announcement (title, description, date_posted, author, badge_type, target_grade) VALUES (?,?,CURDATE(),?,?,?)",
      [title, description || "", author, badge_type || "Info", gradeVal]
    );

    res.json({ success: true, message: "Announcement posted!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
});

// DELETE /api/announcements/:id
router.delete("/:id", auth, async (req, res) => {
  try {
    await db.query("DELETE FROM announcement WHERE announcement_id = ?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;

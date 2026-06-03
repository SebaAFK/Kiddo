const router = require("express").Router();
const auth   = require("../middleware/auth");
const db     = require("../db");

// GET /api/teacher/classes — get teacher's classes from DB
router.get("/classes", auth, async (req, res) => {
  const teacher_id = req.user.teacher_id;
  try {
    const [rows] = await db.query(
      "SELECT * FROM class WHERE teacher_name = (SELECT teacher_name FROM teacher WHERE teacher_id = ?)",
      [teacher_id]
    );
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error." }); }
});

// GET /api/teacher/students/:classNumber — get students in a class
router.get("/students/:classNumber", auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT s.username, s.first_name, s.last_name, s.medical_condition FROM student s WHERE s.grade = (SELECT grade FROM class WHERE class_number = ?)",
      [req.params.classNumber]
    );
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error." }); }
});

// GET /api/teacher/students/:classNumber/grades — get grades for class
router.get("/students/:classNumber/grades", auth, async (req, res) => {
  try {
    const [students] = await db.query(
      "SELECT s.username, s.first_name, s.last_name FROM student s JOIN class c ON s.grade = c.grade WHERE c.class_number = ?",
      [req.params.classNumber]
    );
    const results = [];
    for (const s of students) {
      const [grades] = await db.query(
        "SELECT g.score, a.max_score, a.title FROM grade g JOIN assignment a ON g.assignment_id = a.assignment_id WHERE g.student_username = ? AND a.class_number = ?",
        [s.username, req.params.classNumber]
      );
      const avg = grades.length ? Math.round(grades.reduce((sum, g) => sum + (g.score / g.max_score) * 100, 0) / grades.length) : null;
      results.push({ ...s, avg, grades });
    }
    res.json(results);
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error." }); }
});

// GET /api/teacher/students/:classNumber/attendance — get attendance for class
router.get("/students/:classNumber/attendance", auth, async (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  try {
    const [students] = await db.query(
      "SELECT s.username, s.first_name, s.last_name FROM student s JOIN class c ON s.grade = c.grade WHERE c.class_number = ?",
      [req.params.classNumber]
    );
    const results = [];
    for (const s of students) {
      const [att] = await db.query(
        "SELECT status FROM attendance WHERE student_username = ? AND date = ?",
        [s.username, today]
      );
      results.push({ ...s, today_status: att[0]?.status || null });
    }
    res.json(results);
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error." }); }
});

// POST /api/teacher/attendance — mark attendance for a student
router.post("/attendance", auth, async (req, res) => {
  const { student_username, status, date } = req.body;
  const attendDate = date || new Date().toISOString().split("T")[0];
  try {
    await db.query(
      "INSERT INTO attendance (student_username, date, status) VALUES (?,?,?) ON DUPLICATE KEY UPDATE status=?",
      [student_username, attendDate, status, status]
    );
    res.json({ success: true });
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error." }); }
});

// POST /api/teacher/grade — post a grade for a student
router.post("/grade", auth, async (req, res) => {
  const { student_username, assignment_id, score } = req.body;
  try {
    await db.query(
      "INSERT INTO grade (assignment_id, student_username, score, submitted_at) VALUES (?,?,?,NOW()) ON DUPLICATE KEY UPDATE score=?, submitted_at=NOW()",
      [assignment_id, student_username, score, score]
    );
    res.json({ success: true });
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error." }); }
});

// POST /api/teacher/announcement — post an announcement
router.post("/announcement", auth, async (req, res) => {
  const { title, description, badge_type, target_grade } = req.body;
  const teacher_id = req.user.teacher_id;
  try {
    const [teacher] = await db.query("SELECT teacher_name FROM teacher WHERE teacher_id = ?", [teacher_id]);
    const author = teacher[0]?.teacher_name || teacher_id;
    await db.query(
      "INSERT INTO announcement (title, description, date_posted, author, badge_type, target_grade) VALUES (?,?,CURDATE(),?,?,?)",
      [title, description, author, badge_type || "Info", target_grade || null]
    );
    res.json({ success: true });
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error." }); }
});

// GET /api/teacher/announcements — get teacher's own announcements
router.get("/announcements", auth, async (req, res) => {
  const teacher_id = req.user.teacher_id;
  try {
    const [teacher] = await db.query("SELECT teacher_name FROM teacher WHERE teacher_id = ?", [teacher_id]);
    const author = teacher[0]?.teacher_name || teacher_id;
    const [rows] = await db.query(
      "SELECT * FROM announcement WHERE author = ? ORDER BY date_posted DESC",
      [author]
    );
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error." }); }
});

module.exports = router;

// GET /api/teacher/kpi — teacher sees their own KPI items
router.get("/kpi", auth, async (req, res) => {
  const teacher_id = req.user.teacher_id;
  try {
    const [rows] = await db.query(
      "SELECT * FROM teacher_kpi WHERE teacher_id = ? ORDER BY created_at DESC",
      [teacher_id]
    );
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error." }); }
});
const router  = require("express").Router();
const jwt     = require("jsonwebtoken");
const bcrypt  = require("bcryptjs");
const db      = require("../db");

async function checkPassword(plain, stored) {
  // Try bcrypt first, fallback to plain text for legacy passwords
  try {
    if (stored.startsWith("$2")) return await bcrypt.compare(plain, stored);
    return plain === stored;
  } catch { return plain === stored; }
}

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Username and password required." });
  // Prevent NoSQL injection — ensure string type
  if (typeof username !== "string" || typeof password !== "string") return res.status(400).json({ error: "Invalid input." });

  try {
    // Try student
    const [students] = await db.query("SELECT * FROM student WHERE username = ?", [username]);
    if (students.length > 0) {
      const s = students[0];
      if (!await checkPassword(password, s.password)) return res.status(401).json({ error: "Invalid username or password." });
      const token = jwt.sign({ username: s.username, grade: s.grade, role: "student" }, process.env.JWT_SECRET, { expiresIn: "8h" });
      return res.json({ token, role: "student", user: { username: s.username, firstName: s.first_name, lastName: s.last_name, grade: s.grade } });
    }

    // Try teacher
    const [teachers] = await db.query("SELECT * FROM teacher WHERE teacher_id = ?", [username]);
    if (teachers.length > 0) {
      const t = teachers[0];
      const tPass = t.password || "password";
      if (!await checkPassword(password, tPass)) return res.status(401).json({ error: "Invalid username or password." });
      const token = jwt.sign({ teacher_id: t.teacher_id, role: "teacher" }, process.env.JWT_SECRET, { expiresIn: "8h" });
      const parts = t.teacher_name.replace(/Ms\.?\s|Mr\.?\s/, "").split(" ");
      return res.json({ token, role: "teacher", user: { teacher_id: t.teacher_id, firstName: parts[0]||"", lastName: parts.slice(1).join(" "), class: t.class, teacher_name: t.teacher_name, initials: (parts[0]?.[0]||"")+(parts[1]?.[0]||"") } });
    }

    // Try admin
    const [admins] = await db.query("SELECT * FROM admin WHERE admin_id = ?", [username]);
    if (admins.length > 0) {
      const a = admins[0];
      if (!await checkPassword(password, a.password)) return res.status(401).json({ error: "Invalid username or password." });
      const token = jwt.sign({ admin_id: a.admin_id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "8h" });
      const nameParts = a.admin_name.split(" ");
      return res.json({ token, role: "admin", user: { admin_id: a.admin_id, firstName: nameParts[0]||"Admin", lastName: nameParts.slice(1).join(" "), initials: (nameParts[0]?.[0]||"A")+(nameParts[1]?.[0]||"D"), admin_name: a.admin_name } });
    }

    return res.status(401).json({ error: "Invalid username or password." });
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error." }); }
});

module.exports = router;

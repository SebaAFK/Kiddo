const express = require("express");
const cors    = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api/auth",          require("./routes/auth"));
app.use("/api/student",       require("./routes/student"));
app.use("/api/teacher",       require("./routes/teacher"));
app.use("/api/announcements", require("./routes/announcements"));
app.use("/api/schedule",      require("./routes/schedule"));
app.use("/api/courses",       require("./routes/courses"));
app.use("/api/assignments",   require("./routes/assignments"));
app.use("/api/grades",        require("./routes/grades"));
app.use("/api/attendance",    require("./routes/attendance"));
app.use("/api/messages",      require("./routes/messages"));
app.use("/api/groupchat",     require("./routes/groupchat"));

app.get("/", (req, res) => res.json({ message: "🎒 Kiddo API is running!" }));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Kiddo server running on http://localhost:${PORT}`));

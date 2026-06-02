// Mock data kept for schedule/parent groups UI
// Classes and students are now loaded from the real database via API

export const SCHEDULE = {
  Sun: [
    { time: "08:00", dur: "45min", subject: "🧮 Arabic & Language",   className: "KG1 · Room 1", room: "KG Room 1", type: "class" },
    { time: "09:30", dur: "45min", subject: "🔢 Math & Numbers",      className: "KG1 · Room 2", room: "KG Room 2", type: "class" },
    { time: "11:00", dur: "45min", subject: "🔬 Science & Discovery", className: "KG1 · Room 3", room: "KG Room 3", type: "class" },
  ],
  Mon: [
    { time: "08:00", dur: "45min", subject: "🧮 Arabic & Language",   className: "KG2 · Room 4", room: "KG Room 4", type: "class" },
    { time: "09:30", dur: "45min", subject: "🔢 Math & Numbers",      className: "KG2 · Room 5", room: "KG Room 5", type: "class" },
  ],
  Tue: [
    { time: "08:00", dur: "45min", subject: "🔬 Science & Discovery", className: "KG2 · Room 6", room: "KG Room 6", type: "class" },
    { time: "09:30", dur: "45min", subject: "🧮 Arabic & Language",   className: "KG3 · Room 7", room: "KG Room 7", type: "class" },
  ],
  Wed: [
    { time: "08:00", dur: "45min", subject: "🔢 Math & Numbers",      className: "KG3 · Room 8", room: "KG Room 8", type: "class" },
    { time: "09:30", dur: "45min", subject: "🔬 Science & Discovery", className: "KG3 · Room 9", room: "KG Room 9", type: "class" },
  ],
  Thu: [
    { time: "08:00", dur: "45min", subject: "🎨 Art & Creativity",    className: "All · Art Room", room: "Art Room", type: "class" },
  ],
};

export const ANNOUNCEMENTS = [];
export const CLASSES = [];
export const STUDENTS = {};

export const PARENT_GROUPS = [
  { id: 1, name: "KG1 Parents",  cls: "Grade 1", members: 10, color: "#FA9058", bg: "#FFF0E8" },
  { id: 2, name: "KG2 Parents",  cls: "Grade 2", members: 10, color: "#5BCC8A", bg: "#E8FBF0" },
  { id: 3, name: "KG3 Parents",  cls: "Grade 3", members: 10, color: "#4285F4", bg: "#E8F4FF" },
];

export const INITIAL_MESSAGES = {
  1: [{ id: 1, sender: "Teacher", text: "Welcome KG1 parents group!", time: "09:00", isTeacher: true }],
  2: [{ id: 1, sender: "Teacher", text: "Welcome KG2 parents group!", time: "09:00", isTeacher: true }],
  3: [{ id: 1, sender: "Teacher", text: "Welcome KG3 parents group!", time: "09:00", isTeacher: true }],
};

export const TEACHER = {
  id: "", firstName: "", lastName: "", initials: "",
  email: "", phone: "", dob: "—", joinDate: "—",
  subjects: ["—"], classes: ["—"], totalStudents: 0,
  department: "Teaching", school: "Kiddo Kindergarten", rooms: "—",
};

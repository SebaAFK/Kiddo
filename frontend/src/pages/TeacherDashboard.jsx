import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import TeacherSidebar from "../components/TeacherSidebar";
import { BgIcons } from "../components/shared.jsx";
import TeacherDashboardPage from "./TeacherDashboardPage";
import { AnnouncementsPage, ClassesPage, SchedulePage, ParentsPage, ProfilePage } from "./TeacherPages";

export default function TeacherDashboard() {
  const { user, logout } = useAuth();
  const [page, setPage] = useState("dashboard");

  // Build teacher object from real DB login data
  const teacher = {
    firstName:     user?.firstName || "Teacher",
    lastName:      user?.lastName  || "",
    initials:      ((user?.firstName?.[0]||"") + (user?.lastName?.[0]||"")),
    id:            user?.teacher_id || "KG001",
    subjects:      [user?.class || "Class", ""],
    classes:       ["KG1", "KG2"],
    totalStudents: 30,
    dob:           "—",
    phone:         "—",
    joinDate:      "—",
    email:         "—",
    school:        "Kiddo Kindergarten",
    department:    "Teaching",
    rooms:         "—",
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", position:"relative" }}>
      <BgIcons />
      <TeacherSidebar
        activePage={page}
        onNavigate={setPage}
        teacher={teacher}
        onLogout={logout}
      />
      <main style={{ marginLeft:"var(--sidebar-w)", flex:1, minHeight:"100vh", overflowY:"auto", padding:"28px 30px", position:"relative", zIndex:1 }}>
        {page === "dashboard"     && <TeacherDashboardPage onNavigate={setPage} />}
        {page === "announcements" && <AnnouncementsPage />}
        {page === "classes"       && <ClassesPage />}
        {page === "schedule"      && <SchedulePage />}
        {page === "parents"       && <ParentsPage />}
        {page === "profile"       && <ProfilePage teacher={teacher} />}
      </main>
    </div>
  );
}

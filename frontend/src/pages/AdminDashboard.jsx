import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AdminSidebar from "../components/AdminSidebar";
import AdminDashboardPage from "./AdminDashboardPage";
import { AdminAnnouncementsPage, AdminChatPage, AdminAttendancePage, AdminKPIPage } from "./AdminPages";

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [page, setPage] = useState("dashboard");

  return (
    <div style={{ display:"flex", minHeight:"100vh" }}>
      <AdminSidebar activePage={page} onNavigate={setPage} onLogout={logout} />
      <main style={{ marginLeft:"var(--sidebar-w)", flex:1, minHeight:"100vh", overflowY:"auto", padding:"28px 30px" }}>
        {page === "dashboard"     && <AdminDashboardPage onNavigate={setPage} />}
        {page === "announcements" && <AdminAnnouncementsPage />}
        {page === "chat"          && <AdminChatPage />}
        {page === "attendance"    && <AdminAttendancePage />}
        {page === "kpi"           && <AdminKPIPage />}
      </main>
    </div>
  );
}

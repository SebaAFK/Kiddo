import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AdminSidebar from "../components/AdminSidebar";
import AdminDashboardPage from "./AdminDashboardPage";
import { AdminAnnouncementsPage, AdminChatPage, AdminAttendancePage, AdminKPIPage, AdminRegisterPage } from "./AdminPages";

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [page, setPage] = useState("dashboard");

  const pages = {
    dashboard:     <AdminDashboardPage onNavigate={setPage} />,
    announcements: <AdminAnnouncementsPage />,
    chat:          <AdminChatPage />,
    attendance:    <AdminAttendancePage />,
    kpi:           <AdminKPIPage />,
    register:      <AdminRegisterPage />,
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh" }}>
      <AdminSidebar activePage={page} onNavigate={setPage} onLogout={logout} />
      <main style={{ marginLeft:"var(--sidebar-w)", flex:1, minHeight:"100vh", overflowY:"auto", padding:"28px 32px" }}>
        {pages[page] || pages.dashboard}
      </main>
    </div>
  );
}

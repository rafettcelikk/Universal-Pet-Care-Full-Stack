import React, { useEffect, useState } from "react";
import AdminOverview from "./AdminOverview";
import AdminDashboardSidebar from "./AdminDashboardSidebar";
import VeterinarianComponent from "./VeterinarianComponent";
import PatientComponent from "./PatientComponent";

const AdminDashboard = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [activeContent, setActiveContent] = useState("overview");

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const handleNavigate = (content) => {
    setActiveContent(content);
    localStorage.setItem("activeContent", content);
  };

  useEffect(() => {
    const storedActiveKey = localStorage.getItem("activeContent") || "overview";
    setActiveContent(storedActiveKey);
  }, []);

  return (
    <main className="admin-body">
      <div className="grid-container">
        <AdminDashboardSidebar
          openSidebarToggle={openSidebarToggle}
          OpenSidebar={OpenSidebar}
          onNavigate={handleNavigate}
          activeTab={activeContent}
        />
        <div className="main-container">
          {activeContent === "overview" && <AdminOverview />}
          {activeContent === "veterinarians" && <VeterinarianComponent />}
          {activeContent === "patients" && <PatientComponent />}
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;

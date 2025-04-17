import React from "react";
import Sidebar from "../components/Sidebar";
import { FaBars } from "react-icons/fa";

const DashboardLayout = ({ children, activeTab, setActiveTab }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-800 via-purple-800 to-indigo-900 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="md:hidden fixed top-4 left-4 z-30">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-3 bg-indigo-600/70 backdrop-blur-md rounded-lg shadow-lg"
        >
          <FaBars className="text-white" />
        </button>
      </div>
      
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute left-0 top-0 h-full w-64" onClick={e => e.stopPropagation()}>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>
      )}
      
      <main className="flex-1 overflow-y-auto p-6 text-white">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
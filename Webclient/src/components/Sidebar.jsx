// Sidebar.jsx
import React, { useState } from "react";
import { FaQrcode, FaPalette, FaUpload, FaCog } from "react-icons/fa";

const navItems = [
  { id: "create-qr", label: "Create QR", icon: <FaQrcode /> },
  { id: "customize-style", label: "Customize Style", icon: <FaPalette /> },
  { id: "upload-mask", label: "Upload Mask", icon: <FaUpload /> },
  { id: "settings", label: "Settings", icon: <FaCog /> }
];

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-64 min-h-screen bg-white/10 backdrop-blur-md text-white shadow-2xl p-6 hidden md:flex flex-col">
      <div className="flex items-center gap-3 mb-10">
        <div className="p-2 bg-indigo-500 rounded-lg">
          <FaQrcode className="text-2xl" />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-wide">QR Studio</h1>
      </div>
      
      <nav className="flex flex-col gap-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === item.id
                ? "bg-indigo-500 text-white shadow-md"
                : "hover:bg-indigo-300/30 text-white"
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="mt-auto bg-indigo-600/30 p-4 rounded-lg">
        <p className="text-sm text-white/70">Need help?</p>
        <a href="#" className="text-indigo-300 text-sm hover:underline">View tutorials</a>
      </div>
    </aside>
  );
};

export default Sidebar;
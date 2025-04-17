import React, { useState } from "react";
import DashboardLayout from "./layout/DashboardLayout";
import { CreateQR, CustomizeStyle, UploadMask } from "./components/index";

const App = () => {
  const [activeTab, setActiveTab] = useState("create-qr");

  const renderTabContent = () => {
    switch (activeTab) {
      case "create-qr":
        return <CreateQR />;
      case "customize-style":
        return <CustomizeStyle />;
      case "upload-mask":
        return <UploadMask />;
      case "settings":
        return (
          <div className="bg-white/10 p-6 rounded-xl border border-white/20">
            <h3 className="text-xl font-bold mb-4">Settings</h3>
            <p className="text-white/70">Settings panel will be available soon.</p>
          </div>
        );
      default:
        return <CreateQR />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <div className="max-w-4xl mx-auto mt-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-4xl font-extrabold mb-2">QR Style Studio</h2>
            <p className="text-lg text-white/80">
              Design beautiful QR codes with AI-powered customization
            </p>
          </div>
          
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <div className="px-3 py-1 bg-indigo-500/30 rounded-full text-sm">Beta</div>
            <a href="#" className="text-indigo-300 hover:underline text-sm">What's new?</a>
          </div>
        </div>
        
        <div className="mt-6">
          {renderTabContent()}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default App;
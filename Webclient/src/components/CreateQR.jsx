import React, { useState } from "react";
import { FaLink, FaQrcode, FaDownload } from "react-icons/fa";

const CreateQR = () => {
  const [qrText, setQrText] = useState("");
  const [qrSize, setQrSize] = useState(300);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!qrText) return;
    
    setIsGenerating(true);
    // Simulate generation
    setTimeout(() => {
      setIsGenerating(false);
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white/10 p-6 rounded-xl border border-white/20">
        <h3 className="text-xl font-bold mb-4">QR Code Content</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Enter text or URL</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/50">
                <FaLink />
              </span>
              <input
                type="text"
                value={qrText}
                onChange={(e) => setQrText(e.target.value)}
                className="w-full py-3 pl-10 pr-4 bg-white/10 border border-white/30 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="https://example.com or any text"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">QR Code Size</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="200"
                max="800"
                value={qrSize}
                onChange={(e) => setQrSize(e.target.value)}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-white/70">{qrSize}px</span>
            </div>
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={!qrText || isGenerating}
            className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 font-medium ${
              !qrText || isGenerating
                ? "bg-indigo-500/50 cursor-not-allowed"
                : "bg-indigo-500 hover:bg-indigo-600 transition-colors"
            }`}
          >
            {isGenerating ? (
              <>
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                Generating...
              </>
            ) : (
              <>
                <FaQrcode />
                Generate QR Code
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="bg-white/10 p-6 rounded-xl border border-white/20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">QR Preview</h3>
          <button className="flex items-center gap-2 text-sm py-2 px-4 bg-indigo-500/30 hover:bg-indigo-500/50 rounded-lg transition-colors">
            <FaDownload />
            Download
          </button>
        </div>
        
        {qrText ? (
          <div className="flex items-center justify-center p-8 bg-white rounded-xl">
            <div className="w-64 h-64 bg-black/10 rounded-lg flex items-center justify-center">
              <FaQrcode className="text-6xl text-black/60" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/20 rounded-xl bg-white/5">
            <FaQrcode className="text-4xl text-white/30 mb-4" />
            <p className="text-white/50 text-center">Enter some text above to generate your QR code</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateQR;
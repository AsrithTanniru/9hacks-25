import React, { useState } from "react";
import { FaPalette, FaEyeDropper, FaImage } from "react-icons/fa";

const CustomizeStyle = () => {
  const [foregroundColor, setForegroundColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [stylePrompt, setStylePrompt] = useState("");
  
  const stylePresets = [
    "Cyberpunk",
    "Watercolor",
    "Minimalist",
    "Neon",
    "Vintage",
    "Abstract"
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white/10 p-6 rounded-xl border border-white/20">
        <h3 className="text-xl font-bold mb-4">Style Settings</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Style Prompt</label>
            <input
              type="text"
              value={stylePrompt}
              onChange={(e) => setStylePrompt(e.target.value)}
              className="w-full py-3 px-4 bg-white/10 border border-white/30 rounded-lg"
              placeholder="Describe the style (e.g. neon cyberpunk with glowing edges)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-3">Style Presets</label>
            <div className="flex flex-wrap gap-2">
              {stylePresets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setStylePrompt(preset)}
                  className="px-3 py-1 rounded-full bg-indigo-500/30 hover:bg-indigo-500/50 text-sm transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Foreground Color</label>
              <div className="flex items-center">
                <input
                  type="color"
                  value={foregroundColor}
                  onChange={(e) => setForegroundColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={foregroundColor}
                  onChange={(e) => setForegroundColor(e.target.value)}
                  className="ml-2 py-2 px-3 bg-white/10 border border-white/30 rounded-lg flex-1"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Background Color</label>
              <div className="flex items-center">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="ml-2 py-2 px-3 bg-white/10 border border-white/30 rounded-lg flex-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeStyle;

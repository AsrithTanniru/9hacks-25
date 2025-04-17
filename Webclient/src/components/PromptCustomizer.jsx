import React, { useState } from "react";

const PromptCustomizer = ({ setConfig }) => {
  const [prompt, setPrompt] = useState("");

  const handleGenerate = () => {
    // Simple prompt parsing (you can replace this with AI later)
    const lowerPrompt = prompt.toLowerCase();
    const newConfig = {};

    if (lowerPrompt.includes("red")) newConfig.color = "#e11d48";
    if (lowerPrompt.includes("blue")) newConfig.color = "#3b82f6";
    if (lowerPrompt.includes("green")) newConfig.color = "#10b981";

    if (lowerPrompt.includes("rounded")) newConfig.style = "dots";
    if (lowerPrompt.includes("square")) newConfig.style = "squares";

    // Update config
    setConfig((prev) => ({
      ...prev,
      ...newConfig,
    }));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Describe your QR design
      </label>
      <textarea
        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g., A red rounded QR code with a tech feel"
      ></textarea>
      <button
        onClick={handleGenerate}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Generate QR Style
      </button>
    </div>
  );
};

export default PromptCustomizer;

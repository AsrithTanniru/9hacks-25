import React, { useState } from "react";
import { FaQrcode, FaDownload, FaTag } from "react-icons/fa";
import axios from "axios";

const CreateQR = () => {
  // Using a fixed brand ID since there's only one brand per dashboard
  const brandId = 1; // Assuming the logged-in brand has ID 1

  const [pointsValue, setPointsValue] = useState(10);
  const [description, setDescription] = useState("");
  const [qrSize, setQrSize] = useState(300);
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const [uniqueCode, setUniqueCode] = useState("");
  const [error, setError] = useState("");

  const generateQRImage = async (code) => {
    try {
      // If the first call didn't include an image, make a separate call to generate one
      const imageResponse = await axios.post(`http://localhost:8000/qrcodes/generate-image?unique_code=${code}&size=${qrSize}`);

      // The response will be a binary blob of the image
      return URL.createObjectURL(new Blob([imageResponse.data], { type: 'image/png' }));
    } catch (err) {
      console.error("Error generating QR image:", err);
      throw err;
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError("");

    try {
      // First, create the QR code
      const response = await axios.post(`http://localhost:8000/qrcodes/create-with-image?size=${qrSize}`, {
        brand_id: brandId,
        points_value: pointsValue,
        description: description || undefined,
        is_active: true
      });

      console.log("Response data:", response.data);
      const code = response.data.unique_code;
      setUniqueCode(code);

      // Check if image is included in the response
      if (response.data.qr_image_base64) {
        setQrImage(response.data.qr_image_base64);
      } else {
        // If the image isn't in the response, make a second request to get it
        try {
          // Alternative approach: Use the generate-image endpoint
          const imageUrl = await generateQRImage(code);
          setQrImage(imageUrl);
        } catch (imgErr) {
          // Fall back to using a QR code generation service
          // This is a backup plan if your API endpoint doesn't work
          setQrImage(`https://api.qrserver.com/v1/create-qr-code/?data=https://yourapp.com/scan/${code}&size=${qrSize}x${qrSize}`);
        }
      }
    } catch (err) {
      console.error("Error generating QR code:", err);
      setError("Failed to generate QR code. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!qrImage) return;

    // Handle both blob URLs and data URLs
    if (qrImage.startsWith('blob:')) {
      // For blob URLs, we need to fetch the image first
      fetch(qrImage)
        .then(response => response.blob())
        .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `qrcode-${uniqueCode}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        });
    } else {
      // For data URLs, we can download directly
      const link = document.createElement("a");
      link.href = qrImage;
      link.download = `qrcode-${uniqueCode}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="bg-white/10 p-6 rounded-xl border border-white/20">
        <h3 className="text-xl font-bold mb-4">Create QR Code</h3>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-white p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Points Value</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white/50">
                <FaTag />
              </span>
              <input
                type="number"
                value={pointsValue}
                onChange={(e) => setPointsValue(parseInt(e.target.value) || 0)}
                min="1"
                className="w-full py-3 pl-10 pr-4 bg-white/10 border border-white/30 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full py-3 px-4 bg-white/10 border border-white/30 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-24"
              placeholder="Enter a description for this QR code"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">QR Code Size</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="200"
                max="800"
                value={qrSize}
                onChange={(e) => setQrSize(parseInt(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-white/70">{qrSize}px</span>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 font-medium ${isGenerating
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
          {qrImage && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 text-sm py-2 px-4 bg-indigo-500 hover:bg-indigo-600 rounded-lg transition-colors"
            >
              <FaDownload />
              Download
            </button>
          )}
        </div>

        {qrImage ? (
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl">
            <img
              src={qrImage}
              alt="Generated QR Code"
              className="mb-4"
              style={{ width: `${qrSize}px`, height: `${qrSize}px` }}
              onError={(e) => {
                e.target.onerror = null;
                // Fall back to using a public QR code generator as a last resort
                e.target.src = `https://api.qrserver.com/v1/create-qr-code/?data=https://yourapp.com/scan/${uniqueCode}&size=${qrSize}x${qrSize}`;
              }}
            />
            <div className="text-black mt-2 text-center">
              <div className="font-medium">Unique Code: {uniqueCode}</div>
              <div className="text-sm text-gray-500">Points: {pointsValue}</div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/20 rounded-xl bg-white/5">
            <FaQrcode className="text-4xl text-white/30 mb-4" />
            <p className="text-white/50 text-center">Fill in the details above to generate your QR code</p>
          </div>
        )}
      </div>

      {uniqueCode && (
        <div className="bg-white/10 p-6 rounded-xl border border-white/20">
          <h3 className="text-xl font-bold mb-4">QR Code Details</h3>
          <div className="space-y-2">
            <div>
              <span className="font-medium">Unique Code:</span> {uniqueCode}
            </div>
            <div>
              <span className="font-medium">Points Value:</span> {pointsValue}
            </div>
            {description && (
              <div>
                <span className="font-medium">Description:</span> {description}
              </div>
            )}
            <div className="text-sm text-white/70 mt-4">
              <p>Use this QR code in your marketing materials. When customers scan it with your app, they'll be able to play games and earn rewards.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateQR;

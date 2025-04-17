import React, { useState } from "react";
import { FaUpload, FaImage, FaTrash } from "react-icons/fa";

const UploadMask = () => {
  const [previewImage, setPreviewImage] = useState(null);
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  return (
    <div className="space-y-8">
      <div className="bg-white/10 p-6 rounded-xl border border-white/20">
        <h3 className="text-xl font-bold mb-4">Upload Custom Mask</h3>
        
        <div className="space-y-4">
          <p className="text-white/70 text-sm">
            Upload a black and white image to use as a custom mask for your QR code.
            The black areas will be used as QR code modules.
          </p>
          
          <label className="block w-full">
            <div className={`border-2 border-dashed border-white/30 rounded-xl p-8 text-center cursor-pointer hover:border-indigo-400 transition-colors ${previewImage ? 'bg-white/5' : ''}`}>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
              
              {previewImage ? (
                <div className="space-y-4">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="max-h-64 mx-auto rounded-lg"
                  />
                  <button
                    onClick={() => setPreviewImage(null)}
                    className="flex items-center gap-2 mx-auto px-4 py-2 bg-red-500/30 hover:bg-red-500/50 rounded-lg transition-colors"
                  >
                    <FaTrash />
                    Remove Image
                  </button>
                </div>
              ) : (
                <>
                  <FaUpload className="text-4xl text-white/40 mx-auto mb-3" />
                  <p className="text-white/60">
                    Click to select or drag and drop your image here
                  </p>
                  <p className="text-white/40 text-sm mt-2">
                    Supports PNG, JPG, SVG (max 5MB)
                  </p>
                </>
              )}
            </div>
          </label>
        </div>
      </div>
      
      {previewImage && (
        <div className="bg-white/10 p-6 rounded-xl border border-white/20">
          <h3 className="text-xl font-bold mb-4">Mask Preview</h3>
          <div className="p-4 bg-gray-100 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-black text-sm font-medium mb-2">Original Image</h4>
                <img
                  src={previewImage}
                  alt="Original mask"
                  className="w-full rounded border border-gray-300"
                />
              </div>
              <div>
                <h4 className="text-black text-sm font-medium mb-2">Processed Mask</h4>
                <div className="bg-gray-200 rounded border border-gray-300 w-full aspect-square flex items-center justify-center">
                  <p className="text-gray-500 text-sm">Mask processing preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadMask;
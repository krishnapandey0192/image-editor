import React, { useState } from "react";
import { Camera } from "lucide-react";
import ImageSearchComponent from "./components/ImageSearch";
import ImageEditor from "./components/ImageEditor";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            <Camera className="text-blue-500" size={32} />
            <h1 className="text-2xl font-bold text-gray-900">
              Image Editor Pro
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedImage ? (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Find the Perfect Image
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Search through millions of high-quality images, add your personal
              touch with custom captions and shapes, and download your
              masterpiece.
            </p>
          </div>
        ) : null}

        <ImageSearchComponent onImageSelect={setSelectedImage} />

        {selectedImage && (
          <ImageEditor
            image={selectedImage}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </main>
    </div>
  );
}

export default App;

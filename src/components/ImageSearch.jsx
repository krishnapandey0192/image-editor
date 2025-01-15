import React, { useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY; // Replace with your key

export default function ImageSearch({ onImageSelect }) {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchImages = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `https://api.unsplash.com/search/photos?query=${query}&per_page=20`,
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        }
      );
      setImages(response.data.results);
    } catch (err) {
      setError("Failed to fetch images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <form onSubmit={searchImages} className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for images..."
            className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="absolute right-0 top-0 bottom-0 px-6 py-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
          >
            <Search size={20} />
          </button>
        </div>
      </form>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <img
                src={image.urls.small}
                alt={image.alt_description || "Unsplash image"}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <button
                  onClick={() => onImageSelect(image)}
                  className="bg-white text-gray-900 px-6 py-2 rounded-lg font-medium hover:bg-blue-500 hover:text-white transition-colors duration-300"
                >
                  Add Captions
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                <p className="text-white text-sm">Photo by {image.user.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

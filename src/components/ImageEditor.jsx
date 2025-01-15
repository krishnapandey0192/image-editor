import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { Square, Circle, Triangle, Hexagon, Type, Download, X } from 'lucide-react';

export default function ImageEditor({ image, onClose }) {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);
  const [activeColor, setActiveColor] = useState('#000000');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    fabricCanvasRef.current = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
    });

    const canvas = fabricCanvasRef.current;

    // Create a new image element
    const img = new Image();
    img.crossOrigin = "anonymous"; // Enable CORS
    img.src = `${image.urls.regular}?raw`; // Add raw parameter to get the image directly

    // Once the image is loaded, add it to the canvas
    img.onload = () => {
      const fabricImage = new fabric.Image(img);
      fabricImage.scaleToWidth(800);
      canvas.setBackgroundImage(fabricImage, canvas.renderAll.bind(canvas));
    };

    return () => {
      canvas.dispose();
    };
  }, [image]);

  const addShape = (type) => {
    if (!fabricCanvasRef.current) return;

    let shape;

    switch (type) {
      case 'rect':
        shape = new fabric.Rect({
          width: 100,
          height: 100,
          fill: activeColor,
          left: 100,
          top: 100,
        });
        break;
      case 'circle':
        shape = new fabric.Circle({
          radius: 50,
          fill: activeColor,
          left: 100,
          top: 100,
        });
        break;
      case 'triangle':
        shape = new fabric.Triangle({
          width: 100,
          height: 100,
          fill: activeColor,
          left: 100,
          top: 100,
        });
        break;
      case 'polygon':
        shape = new fabric.Polygon(
          [
            { x: 50, y: 0 },
            { x: 100, y: 25 },
            { x: 100, y: 75 },
            { x: 50, y: 100 },
            { x: 0, y: 75 },
            { x: 0, y: 25 },
          ],
          {
            fill: activeColor,
            left: 100,
            top: 100,
          }
        );
        break;
      default:
        return;
    }

    fabricCanvasRef.current.add(shape);
  };

  const addText = () => {
    if (!fabricCanvasRef.current) return;

    const text = new fabric.IText('Double click to edit', {
      left: 100,
      top: 100,
      fill: activeColor,
      fontSize: 20,
    });

    fabricCanvasRef.current.add(text);
  };

  const downloadImage = () => {
    if (!fabricCanvasRef.current) return;
    setLoading(true);

    try {
      // Get the canvas data URL
      const dataURL = fabricCanvasRef.current.toDataURL({
        format: 'png',
        quality: 1,
      });

      // Create a temporary link element
      const link = document.createElement('a');
      link.download = 'edited-image.png';
      link.href = dataURL;
      
      // Trigger the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Image Editor</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex gap-6">
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <p className="font-medium">Shapes</p>
              <div className="flex gap-2">
                <button
                  onClick={() => addShape('rect')}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <Square size={24} />
                </button>
                <button
                  onClick={() => addShape('circle')}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <Circle size={24} />
                </button>
                <button
                  onClick={() => addShape('triangle')}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <Triangle size={24} />
                </button>
                <button
                  onClick={() => addShape('polygon')}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <Hexagon size={24} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-medium">Text</p>
              <button
                onClick={addText}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <Type size={24} />
              </button>
            </div>

            <div className="space-y-2">
              <p className="font-medium">Color</p>
              <input
                type="color"
                value={activeColor}
                onChange={(e) => setActiveColor(e.target.value)}
                className="w-full h-10 cursor-pointer"
              />
            </div>

            <button
              onClick={downloadImage}
              disabled={loading}
              className={`mt-auto flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              <Download size={20} />
              {loading ? 'Processing...' : 'Download'}
            </button>
          </div>

          <div className="flex-1 bg-gray-100 rounded-lg p-4">
            <canvas ref={canvasRef} className="border border-gray-300 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
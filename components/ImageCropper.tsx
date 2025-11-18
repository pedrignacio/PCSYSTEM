"use client";

import { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { FiX, FiCheck, FiRotateCw, FiZoomIn, FiZoomOut } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface ImageCropperProps {
  imageSrc: string;
  onSave: (croppedImageUrl: string, cropData: any) => void;
  onCancel: () => void;
  aspectRatio?: number;
  initialCrop?: any;
}

export default function ImageCropper({ 
  imageSrc, 
  onSave, 
  onCancel,
  aspectRatio,
  initialCrop
}: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>(initialCrop || {
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleResetZoom = () => {
    setScale(1);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.001;
    setScale((prev) => Math.min(Math.max(prev + delta, 0.5), 3));
  };

  const getCroppedImg = useCallback(() => {
    if (!completedCrop || !imgRef.current || !canvasRef.current) {
      return null;
    }

    const image = imgRef.current;
    const canvas = canvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    const pixelRatio = window.devicePixelRatio || 1;

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    // Apply rotation
    const centerX = crop.width * scaleX / 2;
    const centerY = crop.height * scaleY / 2;
    
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);

    try {
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
      );

      ctx.restore();

      return new Promise<string>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas is empty'));
              return;
            }
            const croppedImageUrl = URL.createObjectURL(blob);
            resolve(croppedImageUrl);
          },
          'image/jpeg',
          1
        );
      });
    } catch (error) {
      console.error('Error drawing image:', error);
      ctx.restore();
      return null;
    }
  }, [completedCrop, rotation]);

  const handleSave = async () => {
    try {
      const croppedImageUrl = await getCroppedImg();
      if (croppedImageUrl) {
        onSave(croppedImageUrl, {
          crop: completedCrop,
          rotation
        });
      }
    } catch (error) {
      console.error('Error al procesar la imagen:', error);
      alert('Error al procesar la imagen. Por favor, intenta de nuevo.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-dark-800 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-dark-700"
      >
        {/* Header */}
        <div className="sticky top-0 bg-dark-800 border-b border-dark-700 p-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-white">Ajustar Imagen</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              className="p-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
              title="Alejar"
            >
              <FiZoomOut className="text-xl text-white" />
            </button>
            <button
              onClick={handleResetZoom}
              className="px-3 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors text-white text-sm font-semibold"
              title="Restablecer zoom"
            >
              {Math.round(scale * 100)}%
            </button>
            <button
              onClick={handleZoomIn}
              className="p-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
              title="Acercar"
            >
              <FiZoomIn className="text-xl text-white" />
            </button>
            <div className="w-px h-6 bg-dark-600 mx-1"></div>
            <button
              onClick={handleRotate}
              className="p-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
              title="Rotar 90°"
            >
              <FiRotateCw className="text-xl text-white" />
            </button>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
            >
              <FiX className="text-2xl text-gray-400" />
            </button>
          </div>
        </div>

        {/* Crop Area */}
        <div className="p-6">
          <div className="mb-4 text-center">
            <p className="text-gray-400 text-sm mb-2">
              <strong>Arrastra y redimensiona el recuadro</strong> para ajustar qué parte de la imagen se mostrará en la card.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              💡 Usa la rueda del mouse sobre la imagen para hacer zoom
            </p>
          </div>
          
          <div 
            className="flex justify-center items-center bg-dark-900 rounded-lg p-4 min-h-[400px]"
            onWheel={handleWheel}
          >
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspectRatio}
              className="max-w-full"
              style={{
                border: '2px solid #6366f1',
                boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)'
              }}
            >
              <img
                ref={imgRef}
                src={imageSrc}
                alt="Crop preview"
                crossOrigin="anonymous"
                style={{
                  transform: `rotate(${rotation}deg) scale(${scale})`,
                  maxHeight: '70vh',
                  maxWidth: '100%',
                  transition: 'transform 0.2s ease-out'
                }}
                className="object-contain"
              />
            </ReactCrop>
          </div>

          {/* Hidden canvas for crop generation */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-dark-800 border-t border-dark-700 p-4 flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white rounded-lg transition-all duration-300 font-semibold"
          >
            <FiCheck />
            Aplicar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

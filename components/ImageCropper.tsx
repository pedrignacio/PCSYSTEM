"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { FiX, FiCheck, FiRotateCw, FiZoomIn, FiZoomOut, FiShoppingCart, FiChevronLeft, FiChevronRight, FiLoader } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [currentPreviewSize, setCurrentPreviewSize] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const previewSizes = [
    { name: 'Móvil', width: 180, height: 144 },
    { name: 'Tablet', width: 240, height: 192 },
    { name: 'Desktop', width: 280, height: 192 }
  ];

  const generatePreview = () => {
    if (!completedCrop || !imgRef.current || !previewCanvasRef.current) return;

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    ctx.imageSmoothingQuality = 'high';

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
      
      const url = canvas.toDataURL('image/jpeg', 0.95);
      setPreviewUrl(url);
    } catch (error) {
      console.error('Error generating preview:', error);
      ctx.restore();
    }
  };

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

  // Generate preview whenever crop changes
  useEffect(() => {
    if (completedCrop && imgRef.current) {
      generatePreview();
    }
  }, [completedCrop, rotation, scale]);

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
      setIsSaving(true);
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
    } finally {
      setIsSaving(false);
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
        className="bg-dark-800 rounded-2xl w-full max-h-[90vh] border border-dark-700 flex flex-col lg:flex-row max-w-7xl"
      >
        {/* Left side - Cropper */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-dark-800 border-b border-dark-700 p-4 flex items-center justify-between">
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
          <div className="p-6 overflow-y-auto flex-1">
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

            {/* Hidden canvases */}
            <canvas ref={canvasRef} className="hidden" />
            <canvas ref={previewCanvasRef} className="hidden" />
          </div>

          {/* Footer */}
          <div className="bg-dark-800 border-t border-dark-700 p-4 flex justify-end gap-4">
            <button
              onClick={onCancel}
              disabled={isSaving}
              className="px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white rounded-lg transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <FiLoader className="animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <FiCheck />
                  Aplicar
                </>
              )}
            </button>
          </div>
        </div>

      {/* Right side - Preview */}
      <div className="lg:w-[400px] bg-dark-900 border-l border-dark-700 flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-dark-700">
          <h3 className="text-lg font-bold text-white mb-2">Vista Previa</h3>
          <p className="text-xs text-gray-400">Así se verá en diferentes dispositivos</p>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {/* Preview size selector */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentPreviewSize((prev) => (prev - 1 + previewSizes.length) % previewSizes.length)}
              disabled={isSaving}
              className="p-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft className="text-white" />
            </button>
            
            <div className="text-center">
              <p className="text-white font-semibold">{previewSizes[currentPreviewSize].name}</p>
              <p className="text-xs text-gray-400">
                {previewSizes[currentPreviewSize].width}×{previewSizes[currentPreviewSize].height}px
              </p>
            </div>

            <button
              onClick={() => setCurrentPreviewSize((prev) => (prev + 1) % previewSizes.length)}
              disabled={isSaving}
              className="p-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronRight className="text-white" />
            </button>
          </div>

          {/* Preview Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPreviewSize}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="mx-auto"
              style={{ 
                width: `${previewSizes[currentPreviewSize].width}px`,
                maxWidth: '100%'
              }}
            >
              <div className="bg-gradient-to-br from-dark-800 via-dark-800 to-primary-900/20 backdrop-blur-sm border-2 border-primary-500/30 rounded-2xl overflow-hidden shadow-2xl">
                {/* Product Image Preview */}
                <div 
                  className="relative overflow-hidden"
                  style={{ height: `${previewSizes[currentPreviewSize].height}px` }}
                >
                  {previewUrl ? (
                    <>
                      {/* Blurred background */}
                      <div 
                        className="absolute inset-0 bg-cover bg-center blur-3xl scale-110 opacity-60"
                        style={{ backgroundImage: `url(${previewUrl})` }}
                      />
                      {/* Actual image */}
                      <div className="relative z-10 w-full h-full flex items-center justify-center">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-dark-700">
                      <p className="text-gray-500 text-sm">Ajusta el recorte para ver preview</p>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 to-transparent"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-primary-500 to-blue-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold shadow-lg shadow-primary-500/50 z-20">
                    Preview
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-3 bg-gradient-to-b from-transparent to-dark-900/30">
                  <h3 className="text-sm font-bold mb-1 text-white line-clamp-2 leading-tight h-10">
                    Nombre del Producto
                  </h3>
                  
                  <div className="mb-3 flex items-end">
                    <span className="text-xl font-extrabold text-primary-400">
                      $16.990
                    </span>
                  </div>

                  <button className="w-full flex items-center justify-center gap-1 px-2 py-2 rounded-lg transition-all duration-300 text-xs font-semibold shadow-lg bg-gradient-to-r from-primary-600 to-purple-600 text-white">
                    <FiShoppingCart className="text-sm" />
                    <span>Agregar</span>
                  </button>
                </div>
              </div>

              {/* Size indicator dots */}
              <div className="flex justify-center gap-2 mt-4">
                {previewSizes.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPreviewSize(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentPreviewSize 
                        ? 'bg-primary-500 w-6' 
                        : 'bg-dark-600 hover:bg-dark-500'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      </motion.div>
    </motion.div>
  );
}

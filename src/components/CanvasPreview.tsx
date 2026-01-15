import React, { useRef, useEffect } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { useWatermarkStore } from '../hooks/useWatermarkStore';
import { drawWatermarkedImage } from '../utils/canvasUtils';

export const CanvasPreview: React.FC = () => {
  const { imageSrc, data, style } = useWatermarkStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (imageSrc && canvasRef.current) {
      drawWatermarkedImage(canvasRef.current, imageSrc, data, style);
    }
  }, [imageSrc, data, style]);

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `watermark_${Date.now()}.jpg`;
      link.href = canvasRef.current.toDataURL('image/jpeg', 0.9);
      link.click();
    }
  };

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-gray-200/50 p-4 md:p-8">
      {!imageSrc ? (
        <div className="flex flex-col items-center text-center text-gray-400">
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
            <ImageIcon className="h-10 w-10 text-gray-300" />
          </div>
          <p className="text-lg font-medium">暂无图片</p>
          <p className="text-sm">请上传照片开始制作水印</p>
        </div>
      ) : (
        <div className="relative flex max-h-full max-w-full overflow-hidden rounded-sm shadow-2xl">
          <canvas
            ref={canvasRef}
            className="max-h-[85vh] max-w-full object-contain"
            onClick={handleDownload}
          />
        </div>
      )}
    </div>
  );
};

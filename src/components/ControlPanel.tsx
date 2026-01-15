import React, { useRef } from 'react';
import { Upload, Download } from 'lucide-react';
import { useWatermarkStore } from '../hooks/useWatermarkStore';

export const ControlPanel: React.FC = () => {
  const { imageSrc, setImageSrc } = useWatermarkStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        setImageSrc(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `watermark_${Date.now()}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.9);
      link.click();
    }
  };

  return (
    <>
      <div className="p-5">
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer overflow-hidden rounded-xl border-2 border-dashed transition-all ${imageSrc ? 'border-blue-300 bg-blue-50/30 hover:border-blue-400' : 'border-gray-300 p-4 hover:border-blue-400 hover:bg-gray-50'}`}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
          {imageSrc ? (
            <div className="group relative">
              <img src={imageSrc} alt="预览" className="h-32 w-full object-cover" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <Upload className="h-5 w-5" />
                <span className="text-xs font-medium">点击更换照片</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-center">
              <Upload className="h-6 w-6 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">点击上传照片</span>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-100 bg-gray-50 px-5 pt-5 pb-5 md:sticky md:bottom-0">
        <button
          onClick={handleDownload}
          disabled={!imageSrc}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-medium text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          <Download className="h-5 w-5" />
          保存图片
        </button>
      </div>
    </>
  );
};

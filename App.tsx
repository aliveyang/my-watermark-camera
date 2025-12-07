import React, { useState, useEffect, useRef } from "react";
import { Upload, Download, Image as ImageIcon, Type as TypeIcon, Palette, Sliders, Maximize2, Plus, Trash2, GripVertical, RotateCcw, Bold as BoldIcon } from "lucide-react";
import { WatermarkData, WatermarkStyle } from "./types";
import { drawWatermarkedImage } from "./utils/canvasUtils";

const generateId = () => Math.random().toString(36).substr(2, 9);

const DEFAULT_DATA: WatermarkData = {
  title: "工程记录",
  items: [
    { id: '1', label: "拍摄时间:", value: "" },
    { id: '2', label: "天       气:", value: "晴 25°C" },
    { id: '3', label: "地       点:", value: "项目现场" }
  ]
};

const DEFAULT_STYLE: WatermarkStyle = {
  boxWidthScale: 1.0,
  headerFontSizeScale: 1.0,
  bodyFontSizeScale: 1.0,
  headerColor: "#4a8fe7",
  headerOpacity: 1.0,
  headerTextColor: "#ffffff",
  headerFontFamily: '"Inter", "Microsoft YaHei", sans-serif',
  headerFontWeight: "600",
  bodyColor: "#ffffff",
  bodyOpacity: 0.85,
  bodyTextColor: "#000000",
  bodyFontFamily: '"Inter", "Microsoft YaHei", sans-serif',
  bodyFontWeight: "500",
};

const FONT_OPTIONS = [
  { label: "默认 (Inter)", value: '"Inter", "Microsoft YaHei", sans-serif' },
  { label: "微软雅黑", value: '"Microsoft YaHei", sans-serif' },
  { label: "黑体", value: '"SimHei", sans-serif' },
  { label: "楷体", value: '"KaiTi", serif' },
  { label: "宋体", value: '"SimSun", serif' },
  { label: "Arial", value: 'Arial, sans-serif' }
];

const App: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  
  // Initialize state from localStorage or defaults
  const [data, setData] = useState<WatermarkData>(() => {
    try {
      const savedData = localStorage.getItem('promark_data');
      return savedData ? JSON.parse(savedData) : DEFAULT_DATA;
    } catch (e) {
      return DEFAULT_DATA;
    }
  });

  const [style, setStyle] = useState<WatermarkStyle>(() => {
    try {
      const savedStyle = localStorage.getItem('promark_style');
      // Merge saved style with default style to ensure new fields are present
      return savedStyle ? { ...DEFAULT_STYLE, ...JSON.parse(savedStyle) } : DEFAULT_STYLE;
    } catch (e) {
      return DEFAULT_STYLE;
    }
  });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Save to localStorage whenever data or style changes
  useEffect(() => {
    localStorage.setItem('promark_data', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem('promark_style', JSON.stringify(style));
  }, [style]);

  // Update time on mount (auto-refresh time when opening app)
  useEffect(() => {
    const now = new Date();
    const formatted = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    setData(prev => ({
      ...prev,
      items: prev.items.map(item => 
        // Heuristic: if label contains "Time" or "时间", update the value
        item.label.includes("时间") || item.label.toLowerCase().includes("time")
          ? { ...item, value: formatted } 
          : item
      )
    }));
  }, []);

  // Redraw canvas whenever image, data, or style changes
  useEffect(() => {
    if (imageSrc && canvasRef.current) {
      drawWatermarkedImage(canvasRef.current, imageSrc, data, style);
    }
  }, [imageSrc, data, style]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      link.download = `watermark_${Date.now()}.jpg`;
      link.href = canvasRef.current.toDataURL("image/jpeg", 0.9);
      link.click();
    }
  };

  const handleItemChange = (id: string, field: 'label' | 'value', text: string) => {
    setData(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: text } : item)
    }));
  };

  const addItem = () => {
    setData(prev => ({
      ...prev,
      items: [...prev.items, { id: generateId(), label: "新 项 目:", value: "内容" }]
    }));
  };

  const removeItem = (id: string) => {
    setData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const resetStyle = () => {
    if (window.confirm("确定要重置所有样式设置吗？")) {
      setStyle(DEFAULT_STYLE);
    }
  };

  const handleStyleChange = (field: keyof WatermarkStyle, value: string | number) => {
    setStyle(prev => ({ ...prev, [field]: value }));
  };

  // Helper to toggle bold weight
  const toggleBold = (field: 'headerFontWeight' | 'bodyFontWeight', currentValue: string) => {
    // If current is bold/700/600, switch to normal/400. Otherwise bold/700.
    const isBold = currentValue === 'bold' || currentValue === '700' || currentValue === '600';
    handleStyleChange(field, isBold ? '400' : '700');
  };

  const isFontBold = (weight: string) => weight === 'bold' || weight === '700' || weight === '600';

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row text-slate-800 font-sans">
      {/* Sidebar / Controls */}
      <div className="w-full md:w-[28rem] bg-white shadow-xl z-10 flex flex-col h-auto md:h-screen overflow-y-auto">
        {/* Header - always on top */}
        <div className="p-5 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-20 order-1">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent flex items-center gap-2">
             水印相机 <span className="text-xs font-medium text-gray-500 border border-gray-200 px-2 py-0.5 rounded-full">Pro</span>
          </h1>
        </div>

        {/* Upload Section - order-2 on mobile, stays in position on desktop */}
        <div className="p-5 order-2">
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl overflow-hidden cursor-pointer transition-all ${imageSrc ? 'border-blue-300 bg-blue-50/30 hover:border-blue-400' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50 p-4'}`}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {imageSrc ? (
              <div className="relative group">
                <img
                  src={imageSrc}
                  alt="预览"
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-1">
                  <Upload className="w-5 h-5" />
                  <span className="text-xs font-medium">点击更换照片</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-center">
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="text-sm font-medium text-gray-600">
                  点击上传照片
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Button (Save) - order-3 on mobile, order-5 on desktop */}
        <div className="px-5 pb-5 order-3 md:order-5 border-t md:border-t border-gray-100 bg-gray-50 md:sticky md:bottom-0 pt-5 md:pt-5">
          <button
            onClick={handleDownload}
            disabled={!imageSrc}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-600/30 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            保存图片
          </button>
        </div>

        {/* Configuration Sections - order-5 on mobile, order-3 on desktop */}
        <div className="p-5 space-y-8 flex-1 order-5 md:order-3">
          {/* Style Configuration */}
          <div className="space-y-6">
             <div className="flex items-center justify-between pb-2 border-b border-gray-100">
               <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 uppercase tracking-wider">
                  <Palette className="w-4 h-4" /> 样式设置
               </div>
               <button onClick={resetStyle} className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1 transition-colors" title="重置样式">
                 <RotateCcw className="w-3 h-3" /> 重置
               </button>
             </div>

             {/* Header Settings */}
             <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">顶部标题栏</span>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">背景颜色 / 透明度</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={style.headerColor} onChange={(e) => handleStyleChange('headerColor', e.target.value)} className="w-6 h-6 rounded cursor-pointer border-none p-0" />
                      <input 
                        type="range" min="0" max="1" step="0.05" value={style.headerOpacity} 
                        onChange={(e) => handleStyleChange('headerOpacity', parseFloat(e.target.value))}
                        className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        title={`透明度: ${Math.round(style.headerOpacity * 100)}%`}
                      />
                    </div>
                  </div>
                  <div>
                     <label className="text-xs text-gray-500 mb-1 block">文字颜色</label>
                     <input type="color" value={style.headerTextColor} onChange={(e) => handleStyleChange('headerTextColor', e.target.value)} className="w-6 h-6 rounded cursor-pointer border-none p-0" />
                  </div>
                </div>
                
                {/* Header Font Settings */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">字体样式</label>
                  <div className="flex gap-2">
                    <select 
                      value={style.headerFontFamily}
                      onChange={(e) => handleStyleChange('headerFontFamily', e.target.value)}
                      className="flex-1 text-xs bg-white border border-gray-200 rounded px-2 h-8 focus:outline-none focus:border-blue-400"
                    >
                      {FONT_OPTIONS.map((font) => (
                        <option key={font.value} value={font.value}>{font.label}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => toggleBold('headerFontWeight', style.headerFontWeight)}
                      className={`w-8 h-8 flex items-center justify-center rounded border transition-colors ${isFontBold(style.headerFontWeight) ? 'bg-blue-100 border-blue-200 text-blue-600' : 'bg-white border-gray-200 text-gray-400 hover:text-gray-600'}`}
                      title="加粗"
                    >
                      <BoldIcon size={14} strokeWidth={3} />
                    </button>
                  </div>
                </div>

                <div>
                   <label className="text-xs text-gray-500 flex justify-between mb-1">
                      <span>字体大小</span>
                      <span>{style.headerFontSizeScale.toFixed(1)}x</span>
                   </label>
                   <input type="range" min="0.5" max="2.0" step="0.1" value={style.headerFontSizeScale} onChange={(e) => handleStyleChange('headerFontSizeScale', parseFloat(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                </div>
             </div>

             {/* Body Settings */}
             <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">底部内容栏</span>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">背景颜色 / 透明度</label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={style.bodyColor} onChange={(e) => handleStyleChange('bodyColor', e.target.value)} className="w-6 h-6 rounded cursor-pointer border-none p-0" />
                      <input 
                        type="range" min="0" max="1" step="0.05" value={style.bodyOpacity} 
                        onChange={(e) => handleStyleChange('bodyOpacity', parseFloat(e.target.value))}
                        className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        title={`透明度: ${Math.round(style.bodyOpacity * 100)}%`}
                      />
                    </div>
                  </div>
                   <div>
                     <label className="text-xs text-gray-500 mb-1 block">文字颜色</label>
                     <input type="color" value={style.bodyTextColor} onChange={(e) => handleStyleChange('bodyTextColor', e.target.value)} className="w-6 h-6 rounded cursor-pointer border-none p-0" />
                  </div>
                </div>

                {/* Body Font Settings */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">字体样式</label>
                  <div className="flex gap-2">
                    <select 
                      value={style.bodyFontFamily}
                      onChange={(e) => handleStyleChange('bodyFontFamily', e.target.value)}
                      className="flex-1 text-xs bg-white border border-gray-200 rounded px-2 h-8 focus:outline-none focus:border-blue-400"
                    >
                      {FONT_OPTIONS.map((font) => (
                        <option key={font.value} value={font.value}>{font.label}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => toggleBold('bodyFontWeight', style.bodyFontWeight)}
                      className={`w-8 h-8 flex items-center justify-center rounded border transition-colors ${isFontBold(style.bodyFontWeight) ? 'bg-blue-100 border-blue-200 text-blue-600' : 'bg-white border-gray-200 text-gray-400 hover:text-gray-600'}`}
                      title="加粗"
                    >
                      <BoldIcon size={14} strokeWidth={3} />
                    </button>
                  </div>
                </div>

                <div>
                   <label className="text-xs text-gray-500 flex justify-between mb-1">
                      <span>字体大小</span>
                      <span>{style.bodyFontSizeScale.toFixed(1)}x</span>
                   </label>
                   <input type="range" min="0.5" max="2.0" step="0.1" value={style.bodyFontSizeScale} onChange={(e) => handleStyleChange('bodyFontSizeScale', parseFloat(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                </div>
             </div>
             
             {/* Layout Settings */}
             <div className="px-1">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    <Maximize2 className="w-3 h-3" /> 水印整体宽度
                  </label>
                  <span className="text-xs text-gray-400">{style.boxWidthScale.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={style.boxWidthScale}
                  onChange={(e) => handleStyleChange('boxWidthScale', parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
             </div>
          </div>

          {/* Content Configuration */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 uppercase tracking-wider pb-2 border-b border-gray-100">
              <Sliders className="w-4 h-4" /> 水印内容编辑
            </div>

            <div className="space-y-3">
              <div className="group">
                <label className="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
                  <TypeIcon className="w-3 h-3" /> 主标题
                </label>
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) => setData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                  placeholder="例如：工作记录"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 block">详细信息行</label>
                {data.items.map((item) => (
                  <div key={item.id} className="flex gap-2 items-start bg-gray-50 p-2 rounded-lg group border border-transparent hover:border-gray-200 transition-colors">
                     <div className="pt-2 text-gray-300 cursor-move" title="拖动排序（暂未实装）">
                       <GripVertical className="w-4 h-4" />
                     </div>
                     <div className="flex-1 space-y-2">
                       <input 
                         type="text" 
                         value={item.label}
                         placeholder="标签名"
                         onChange={(e) => handleItemChange(item.id, 'label', e.target.value)}
                         className="w-full bg-transparent text-xs font-semibold text-gray-600 placeholder-gray-300 focus:outline-none focus:text-blue-600"
                       />
                       <textarea
                         value={item.value}
                         placeholder="内容"
                         rows={1}
                         onChange={(e) => handleItemChange(item.id, 'value', e.target.value)}
                         className="w-full bg-white px-2 py-1 rounded border border-gray-200 text-sm focus:outline-none focus:border-blue-400 resize-none"
                       />
                     </div>
                     <button 
                       onClick={() => removeItem(item.id)}
                       className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                       title="删除此行"
                     >
                       <Trash2 className="w-4 h-4" />
                     </button>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={addItem}
                className="w-full py-2 flex items-center justify-center gap-1 text-sm text-blue-600 font-medium bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors border border-blue-100"
              >
                <Plus className="w-4 h-4" /> 添加新行
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Preview Area - order-4 on mobile, stays in normal flow on desktop */}
      <div className="flex-1 bg-gray-200/50 p-4 md:p-8 flex items-center justify-center overflow-hidden relative order-4 md:order-none">
        {!imageSrc ? (
          <div className="text-center text-gray-400 flex flex-col items-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <ImageIcon className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-lg font-medium">暂无图片</p>
            <p className="text-sm">请上传照片开始制作水印</p>
          </div>
        ) : (
          <div className="relative shadow-2xl rounded-sm overflow-hidden max-w-full max-h-full flex">
             <canvas 
               ref={canvasRef} 
               className="max-w-full max-h-[85vh] object-contain"
             />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
import React from 'react';
import { Palette, Maximize2, Bold as BoldIcon, RotateCcw } from 'lucide-react';
import { useWatermarkStore } from '../hooks/useWatermarkStore';
import { FONT_OPTIONS } from '../constants/defaultConfig';

export const StyleEditor: React.FC = () => {
  const { style, updateStyle, toggleBold, resetStyle } = useWatermarkStore();

  const isFontBold = (weight: string) => weight === 'bold' || weight === '700' || weight === '600';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2">
        <div className="flex items-center gap-2 text-sm font-semibold tracking-wider text-gray-900 uppercase">
          <Palette className="h-4 w-4" /> 样式设置
        </div>
        <button
          onClick={resetStyle}
          className="flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-red-500"
          title="重置样式"
        >
          <RotateCcw className="h-3 w-3" /> 重置
        </button>
      </div>

      <div className="space-y-3 rounded-lg bg-gray-50 p-4">
        <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">顶部标题栏</span>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="mb-1 block text-xs text-gray-500">背景颜色 / 透明度</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={style.headerColor}
                onChange={e => updateStyle('headerColor', e.target.value)}
                className="h-6 w-6 cursor-pointer rounded border-none p-0"
              />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={style.headerOpacity}
                onChange={e => updateStyle('headerOpacity', parseFloat(e.target.value))}
                className="h-1.5 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600"
                title={`透明度: ${Math.round(style.headerOpacity * 100)}%`}
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">文字颜色</label>
            <input
              type="color"
              value={style.headerTextColor}
              onChange={e => updateStyle('headerTextColor', e.target.value)}
              className="h-6 w-6 cursor-pointer rounded border-none p-0"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs text-gray-500">字体样式</label>
          <div className="flex gap-2">
            <select
              value={style.headerFontFamily}
              onChange={e => updateStyle('headerFontFamily', e.target.value)}
              className="h-8 flex-1 rounded border border-gray-200 bg-white px-2 text-xs focus:border-blue-400 focus:outline-none"
            >
              {FONT_OPTIONS.map(font => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => toggleBold('headerFontWeight', style.headerFontWeight)}
              className={`flex h-8 w-8 items-center justify-center rounded border transition-colors ${isFontBold(style.headerFontWeight) ? 'border-blue-200 bg-blue-100 text-blue-600' : 'border-gray-200 bg-white text-gray-400 hover:text-gray-600'}`}
              title="加粗"
            >
              <BoldIcon size={14} strokeWidth={3} />
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1 flex justify-between text-xs text-gray-500">
            <span>字体大小</span>
            <span>{style.headerFontSizeScale.toFixed(1)}x</span>
          </label>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={style.headerFontSizeScale}
            onChange={e => updateStyle('headerFontSizeScale', parseFloat(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600"
          />
        </div>
      </div>

      <div className="space-y-3 rounded-lg bg-gray-50 p-4">
        <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">底部内容栏</span>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="mb-1 block text-xs text-gray-500">背景颜色 / 透明度</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={style.bodyColor}
                onChange={e => updateStyle('bodyColor', e.target.value)}
                className="h-6 w-6 cursor-pointer rounded border-none p-0"
              />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={style.bodyOpacity}
                onChange={e => updateStyle('bodyOpacity', parseFloat(e.target.value))}
                className="h-1.5 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600"
                title={`透明度: ${Math.round(style.bodyOpacity * 100)}%`}
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-gray-500">文字颜色</label>
            <input
              type="color"
              value={style.bodyTextColor}
              onChange={e => updateStyle('bodyTextColor', e.target.value)}
              className="h-6 w-6 cursor-pointer rounded border-none p-0"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs text-gray-500">字体样式</label>
          <div className="flex gap-2">
            <select
              value={style.bodyFontFamily}
              onChange={e => updateStyle('bodyFontFamily', e.target.value)}
              className="h-8 flex-1 rounded border border-gray-200 bg-white px-2 text-xs focus:border-blue-400 focus:outline-none"
            >
              {FONT_OPTIONS.map(font => (
                <option key={font.value} value={font.value}>
                  {font.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => toggleBold('bodyFontWeight', style.bodyFontWeight)}
              className={`flex h-8 w-8 items-center justify-center rounded border transition-colors ${isFontBold(style.bodyFontWeight) ? 'border-blue-200 bg-blue-100 text-blue-600' : 'border-gray-200 bg-white text-gray-400 hover:text-gray-600'}`}
              title="加粗"
            >
              <BoldIcon size={14} strokeWidth={3} />
            </button>
          </div>
        </div>

        <div>
          <label className="mb-1 flex justify-between text-xs text-gray-500">
            <span>字体大小</span>
            <span>{style.bodyFontSizeScale.toFixed(1)}x</span>
          </label>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={style.bodyFontSizeScale}
            onChange={e => updateStyle('bodyFontSizeScale', parseFloat(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600"
          />
        </div>
      </div>

      <div className="px-1">
        <div className="mb-1.5 flex items-center justify-between">
          <label className="flex items-center gap-1 text-xs font-medium text-gray-500">
            <Maximize2 className="h-3 w-3" /> 水印整体宽度
          </label>
          <span className="text-xs text-gray-400">{style.boxWidthScale.toFixed(1)}x</span>
        </div>
        <input
          type="range"
          min="0.5"
          max="1.5"
          step="0.05"
          value={style.boxWidthScale}
          onChange={e => updateStyle('boxWidthScale', parseFloat(e.target.value))}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-600"
        />
      </div>
    </div>
  );
};

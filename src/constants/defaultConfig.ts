import { WatermarkData, WatermarkStyle, FontOption } from '../types';

export const DEFAULT_DATA: WatermarkData = {
  title: '工程记录',
  items: [
    { id: '1', label: '拍摄时间:', value: '' },
    { id: '2', label: '天       气:', value: '晴 25°C' },
    { id: '3', label: '地       点:', value: '项目现场' },
  ],
};

export const DEFAULT_STYLE: WatermarkStyle = {
  boxWidthScale: 1.0,
  headerFontSizeScale: 1.0,
  bodyFontSizeScale: 1.0,
  headerColor: '#4a8fe7',
  headerOpacity: 1.0,
  headerTextColor: '#ffffff',
  headerFontFamily: '"Inter", "Microsoft YaHei", sans-serif',
  headerFontWeight: '600',
  bodyColor: '#ffffff',
  bodyOpacity: 0.85,
  bodyTextColor: '#000000',
  bodyFontFamily: '"Inter", "Microsoft YaHei", sans-serif',
  bodyFontWeight: '500',
};

export const FONT_OPTIONS: FontOption[] = [
  { label: '默认 (Inter)', value: '"Inter", "Microsoft YaHei", sans-serif' },
  { label: '微软雅黑', value: '"Microsoft YaHei", sans-serif' },
  { label: '黑体', value: '"SimHei", sans-serif' },
  { label: '楷体', value: '"KaiTi", serif' },
  { label: '宋体', value: '"SimSun", serif' },
  { label: 'Arial', value: 'Arial, sans-serif' },
];

export const STORAGE_KEYS = {
  DATA: 'promark_data',
  STYLE: 'promark_style',
} as const;

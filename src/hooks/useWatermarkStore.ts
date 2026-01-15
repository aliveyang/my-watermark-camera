import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WatermarkData, WatermarkStyle } from '../types';
import { DEFAULT_DATA, DEFAULT_STYLE, STORAGE_KEYS } from '../constants/defaultConfig';

interface WatermarkState {
  imageSrc: string | null;
  data: WatermarkData;
  style: WatermarkStyle;

  setImageSrc: (src: string | null) => void;
  setData: (data: WatermarkData) => void;
  updateDataTitle: (title: string) => void;
  updateItem: (id: string, field: 'label' | 'value', text: string) => void;
  addItem: () => void;
  removeItem: (id: string) => void;
  setStyle: (style: WatermarkStyle) => void;
  updateStyle: <K extends keyof WatermarkStyle>(field: K, value: WatermarkStyle[K]) => void;
  resetStyle: () => void;
  toggleBold: (field: 'headerFontWeight' | 'bodyFontWeight', currentValue: string) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const loadPersistedData = () => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEYS.DATA);
    return savedData ? JSON.parse(savedData) : DEFAULT_DATA;
  } catch {
    return DEFAULT_DATA;
  }
};

const loadPersistedStyle = () => {
  try {
    const savedStyle = localStorage.getItem(STORAGE_KEYS.STYLE);
    return savedStyle ? { ...DEFAULT_STYLE, ...JSON.parse(savedStyle) } : DEFAULT_STYLE;
  } catch {
    return DEFAULT_STYLE;
  }
};

const initTimeData = (data: WatermarkData): WatermarkData => {
  const now = new Date();
  const formatted = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  return {
    ...data,
    items: data.items.map(item =>
      item.label.includes('时间') || item.label.toLowerCase().includes('time')
        ? { ...item, value: formatted }
        : item,
    ),
  };
};

export const useWatermarkStore = create<WatermarkState>()(
  persist(
    (set, get) => ({
      imageSrc: null,
      data: initTimeData(loadPersistedData()),
      style: loadPersistedStyle(),

      setImageSrc: src => set({ imageSrc: src }),

      setData: data => set({ data }),

      updateDataTitle: title =>
        set(state => ({
          data: { ...state.data, title },
        })),

      updateItem: (id, field, text) =>
        set(state => ({
          data: {
            ...state.data,
            items: state.data.items.map(item =>
              item.id === id ? { ...item, [field]: text } : item,
            ),
          },
        })),

      addItem: () =>
        set(state => ({
          data: {
            ...state.data,
            items: [...state.data.items, { id: generateId(), label: '新 项 目:', value: '内容' }],
          },
        })),

      removeItem: id =>
        set(state => ({
          data: {
            ...state.data,
            items: state.data.items.filter(item => item.id !== id),
          },
        })),

      setStyle: style => set({ style }),

      updateStyle: (field, value) =>
        set(state => ({
          style: { ...state.style, [field]: value },
        })),

      resetStyle: () => set({ style: DEFAULT_STYLE }),

      toggleBold: (field, currentValue) => {
        const isBold = currentValue === 'bold' || currentValue === '700' || currentValue === '600';
        get().updateStyle(field, isBold ? '400' : '700');
      },
    }),
    {
      name: 'watermark-storage',
      partialize: state => ({ data: state.data, style: state.style }),
    },
  ),
);

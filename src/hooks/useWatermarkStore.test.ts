import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useWatermarkStore } from './useWatermarkStore';
import { DEFAULT_DATA, DEFAULT_STYLE } from '../constants/defaultConfig';

describe('useWatermarkStore', () => {
  it('has correct initial state', () => {
    const { result } = renderHook(() => useWatermarkStore());
    expect(result.current.imageSrc).toBeNull();
    expect(result.current.data.title).toBe(DEFAULT_DATA.title);
    expect(result.current.data.items.length).toBe(DEFAULT_DATA.items.length);
    expect(result.current.style.boxWidthScale).toBe(DEFAULT_STYLE.boxWidthScale);
  });

  it('updates imageSrc', () => {
    const { result } = renderHook(() => useWatermarkStore());
    act(() => {
      result.current.setImageSrc('data:image/png;base64,test');
    });
    expect(result.current.imageSrc).toBe('data:image/png;base64,test');
  });

  it('updates data title', () => {
    const { result } = renderHook(() => useWatermarkStore());
    act(() => {
      result.current.updateDataTitle('测试标题');
    });
    expect(result.current.data.title).toBe('测试标题');
  });

  it('updates item', () => {
    const { result } = renderHook(() => useWatermarkStore());
    const itemId = result.current.data.items[0].id;
    act(() => {
      result.current.updateItem(itemId, 'value', '新值');
    });
    expect(result.current.data.items.find(i => i.id === itemId)?.value).toBe('新值');
  });

  it('adds item', () => {
    const { result } = renderHook(() => useWatermarkStore());
    const initialCount = result.current.data.items.length;
    act(() => {
      result.current.addItem();
    });
    expect(result.current.data.items.length).toBe(initialCount + 1);
  });

  it('removes item', () => {
    const { result } = renderHook(() => useWatermarkStore());
    const itemId = result.current.data.items[0].id;
    const initialCount = result.current.data.items.length;
    act(() => {
      result.current.removeItem(itemId);
    });
    expect(result.current.data.items.length).toBe(initialCount - 1);
    expect(result.current.data.items.find(i => i.id === itemId)).toBeUndefined();
  });

  it('updates style', () => {
    const { result } = renderHook(() => useWatermarkStore());
    act(() => {
      result.current.updateStyle('boxWidthScale', 1.5);
    });
    expect(result.current.style.boxWidthScale).toBe(1.5);
  });

  it('resets style', () => {
    const { result } = renderHook(() => useWatermarkStore());
    act(() => {
      result.current.updateStyle('boxWidthScale', 2.0);
      result.current.resetStyle();
    });
    expect(result.current.style.boxWidthScale).toBe(DEFAULT_STYLE.boxWidthScale);
  });

  it('toggles bold', () => {
    const { result } = renderHook(() => useWatermarkStore());
    act(() => {
      result.current.toggleBold('headerFontWeight', '400');
    });
    expect(result.current.style.headerFontWeight).toBe('700');
  });
});

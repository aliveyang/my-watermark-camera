import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import '@testing-library/jest-dom';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

const mockCanvasContext = {
  fillText: vi.fn(),
  fillRect: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  quadraticCurveTo: vi.fn(),
  closePath: vi.fn(),
  clip: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  measureText: vi.fn(() => ({ width: 10 })),
  drawImage: vi.fn(),
  font: '',
  textBaseline: '',
  globalAlpha: 1,
  shadowColor: '',
  shadowBlur: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  canvas: {},
  globalCompositeOperation: 'source-over',
  isPointInPath: vi.fn(),
  isPointInStroke: vi.fn(),
  getLineDash: vi.fn(),
  setLineDash: vi.fn(),
  lineDashOffset: 0,
  miterLimit: 10,
  lineWidth: 1,
  strokeStyle: '',
  lineCap: 'butt',
  lineJoin: 'miter',
  shadowOffsetY: 0,
};

HTMLCanvasElement.prototype.getContext = vi.fn(() => mockCanvasContext);
HTMLCanvasElement.prototype.toDataURL = vi.fn(() => 'data:image/png;base64,mock');

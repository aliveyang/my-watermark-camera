import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DataEditor } from './DataEditor';
import { StyleEditor } from './StyleEditor';
import { ControlPanel } from './ControlPanel';
import App from '../../App';

describe('Components', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('App', () => {
    it('renders without crashing', () => {
      render(<App />);
      expect(screen.getByText('水印相机')).toBeInTheDocument();
    });

    it('shows upload area when no image', () => {
      render(<App />);
      expect(screen.getByText('点击上传照片')).toBeInTheDocument();
    });
  });

  describe('DataEditor', () => {
    it('renders title input', () => {
      render(<DataEditor />);
      expect(screen.getByPlaceholderText('例如：工作记录')).toBeInTheDocument();
    });

    it('renders default items', () => {
      render(<DataEditor />);
      expect(screen.getByText('详细信息行')).toBeInTheDocument();
    });

    it('renders add button', () => {
      render(<DataEditor />);
      expect(screen.getByText('添加新行')).toBeInTheDocument();
    });
  });

  describe('StyleEditor', () => {
    it('renders style sections', () => {
      render(<StyleEditor />);
      expect(screen.getByText('样式设置')).toBeInTheDocument();
      expect(screen.getByText('顶部标题栏')).toBeInTheDocument();
      expect(screen.getByText('底部内容栏')).toBeInTheDocument();
    });

    it('renders reset button', () => {
      render(<StyleEditor />);
      expect(screen.getByText('重置')).toBeInTheDocument();
    });
  });

  describe('ControlPanel', () => {
    it('renders upload area', () => {
      render(<ControlPanel />);
      expect(screen.getByText('点击上传照片')).toBeInTheDocument();
    });

    it('renders save button', () => {
      render(<ControlPanel />);
      expect(screen.getByText('保存图片')).toBeInTheDocument();
    });
  });
});

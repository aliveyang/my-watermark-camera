import React from 'react';
import { CanvasPreview, StyleEditor, DataEditor, ControlPanel } from './src/components';

const App: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100 font-sans text-slate-800 md:flex-row">
      <div className="z-10 flex h-auto w-full flex-col overflow-y-auto bg-white shadow-xl md:h-screen md:w-[28rem]">
        <div className="sticky top-0 z-20 order-1 border-b border-gray-100 bg-white/95 p-5 backdrop-blur">
          <h1 className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-xl font-bold text-transparent">
            水印相机{' '}
            <span className="rounded-full border border-gray-200 px-2 py-0.5 text-xs font-medium text-gray-500">
              Pro
            </span>
          </h1>
        </div>

        <ControlPanel />

        <div className="order-5 flex-1 space-y-8 p-5 md:order-3">
          <StyleEditor />
          <DataEditor />
        </div>
      </div>

      <CanvasPreview />
    </div>
  );
};

export default App;

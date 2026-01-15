import React from 'react';
import { Sliders, Type as TypeIcon, Plus, Trash2, GripVertical } from 'lucide-react';
import { useWatermarkStore } from '../hooks/useWatermarkStore';

export const DataEditor: React.FC = () => {
  const { data, updateDataTitle, updateItem, addItem, removeItem } = useWatermarkStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-2 text-sm font-semibold tracking-wider text-gray-900 uppercase">
        <Sliders className="h-4 w-4" /> 水印内容编辑
      </div>

      <div className="space-y-3">
        <div className="group">
          <label className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-500">
            <TypeIcon className="h-3 w-3" /> 主标题
          </label>
          <input
            type="text"
            value={data.title}
            onChange={e => updateDataTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            placeholder="例如：工作记录"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-500">详细信息行</label>
          {data.items.map(item => (
            <div
              key={item.id}
              className="group flex items-start gap-2 rounded-lg border border-transparent bg-gray-50 p-2 transition-colors hover:border-gray-200"
            >
              <div className="cursor-move pt-2 text-gray-300" title="拖动排序（暂未实装）">
                <GripVertical className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={item.label}
                  placeholder="标签名"
                  onChange={e => updateItem(item.id, 'label', e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-gray-600 placeholder-gray-300 focus:text-blue-600 focus:outline-none"
                />
                <textarea
                  value={item.value}
                  placeholder="内容"
                  rows={1}
                  onChange={e => updateItem(item.id, 'value', e.target.value)}
                  className="w-full resize-none rounded border border-gray-200 bg-white px-2 py-1 text-sm focus:border-blue-400 focus:outline-none"
                />
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="rounded p-1.5 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500"
                title="删除此行"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addItem}
          className="flex w-full items-center justify-center gap-1 rounded-lg border border-blue-100 bg-blue-50 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
        >
          <Plus className="h-4 w-4" /> 添加新行
        </button>
      </div>
    </div>
  );
};

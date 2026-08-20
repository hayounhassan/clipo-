import React from 'react';
import { 
  FolderPlus, 
  Type, 
  Sparkles, 
  Music, 
  Scissors, 
  Trash2, 
  Copy, 
  Gauge, 
  Volume2, 
  Crop,
  Layers,
  LayoutTemplate
} from 'lucide-react';

interface InShotToolbarProps {
  activeTab: 'media' | 'text' | 'effects' | 'templates' | 'music' | null;
  onSelectTab: (tab: 'media' | 'text' | 'effects' | 'templates' | 'music') => void;
  selectedClipId: string | null;
  onSplit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onQuickSpeed: () => void;
}

export const InShotToolbar: React.FC<InShotToolbarProps> = ({
  activeTab,
  onSelectTab,
  selectedClipId,
  onSplit,
  onDelete,
  onDuplicate,
}) => {
  const tools = [
    {
      id: 'media',
      label: 'الوسائط',
      icon: FolderPlus,
      onClick: () => onSelectTab('media'),
      active: activeTab === 'media',
    },
    {
      id: 'text',
      label: 'النص والملصقات',
      icon: Type,
      onClick: () => onSelectTab('text'),
      active: activeTab === 'text',
    },
    {
      id: 'effects',
      label: 'الفلاتر والضبط',
      icon: Sparkles,
      onClick: () => onSelectTab('effects'),
      active: activeTab === 'effects',
    },
    {
      id: 'templates',
      label: 'قوالب جاهزة',
      icon: LayoutTemplate,
      onClick: () => onSelectTab('templates'),
      active: activeTab === 'templates',
    },
  ];

  return (
    <div className="bg-white border-b border-slate-200/80 px-4 py-2 flex items-center justify-between gap-3 select-none">
      {/* Left side InShot-style tool tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar py-0.5">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = tool.active;
          return (
            <button
              key={tool.id}
              onClick={tool.onClick}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/25'
                  : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* Quick Action Buttons (Split, Duplicate, Delete) */}
      <div className="flex items-center gap-1.5 border-r border-slate-200 pr-3 mr-1">
        <button
          onClick={onSplit}
          className="flex items-center gap-1.5 bg-slate-100 hover:bg-sky-50 hover:text-sky-600 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 transition active:scale-95"
          title="تقسيم المقطع عند موضع المؤشر (Split)"
        >
          <Scissors className="w-3.5 h-3.5 text-sky-500" />
          <span>تقسيم (Split)</span>
        </button>

        {selectedClipId && (
          <>
            <button
              onClick={onDuplicate}
              className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 transition active:scale-95"
              title="تكرار المقطع"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">تكرار</span>
            </button>

            <button
              onClick={onDelete}
              className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-rose-200 transition active:scale-95"
              title="حذف المقطع المحدد"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>حذف</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

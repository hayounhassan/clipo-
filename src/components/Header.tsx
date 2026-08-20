import React, { useState } from 'react';
import { 
  Film, 
  Smartphone, 
  Tv, 
  Square, 
  Save, 
  FolderOpen, 
  Download, 
  PlusCircle, 
  Check, 
  Cloud,
  Edit2
} from 'lucide-react';
import { AspectRatio, ProjectState } from '../types';

interface HeaderProps {
  project: ProjectState;
  onUpdateProjectName: (name: string) => void;
  onUpdateAspectRatio: (ratio: AspectRatio) => void;
  onSaveProject: () => void;
  onNewProject: () => void;
  onOpenProjectsList: () => void;
  onOpenExportModal: () => void;
  isSaving: boolean;
  saveNotice: string | null;
  supabaseConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  project,
  onUpdateProjectName,
  onUpdateAspectRatio,
  onSaveProject,
  onNewProject,
  onOpenProjectsList,
  onOpenExportModal,
  isSaving,
  saveNotice,
  supabaseConnected,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(project.name);

  const handleTitleSubmit = () => {
    if (tempTitle.trim()) {
      onUpdateProjectName(tempTitle.trim());
    } else {
      setTempTitle(project.name);
    }
    setIsEditingTitle(false);
  };

  return (
    <header className="bg-white border-b border-slate-200 text-slate-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 select-none">
      {/* Brand & Project Title */}
      <div className="flex items-center gap-3">
        {/* InShot styled Calm Sky Badge */}
        <div className="flex items-center gap-2 bg-sky-500 text-white px-2.5 py-1.5 rounded-xl font-bold text-xs shadow-sm shadow-sky-500/20">
          <Film className="w-4 h-4 stroke-[2.2]" />
          <span>InShot Web</span>
        </div>

        {/* Project Name Editor */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 hover:border-slate-300 px-3 py-1 rounded-lg transition-colors">
          {isEditingTitle ? (
            <input
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
              autoFocus
              className="bg-white text-slate-900 text-xs font-semibold px-2 py-0.5 rounded outline-none border border-sky-500 w-44"
            />
          ) : (
            <button
              onClick={() => {
                setTempTitle(project.name);
                setIsEditingTitle(true);
              }}
              title="انقر لتعديل اسم المشروع"
              className="text-xs font-semibold text-slate-700 hover:text-sky-600 flex items-center gap-1.5"
            >
              <span>{project.name}</span>
              <Edit2 className="w-3 h-3 text-slate-400" />
            </button>
          )}
        </div>

        {/* Supabase Status indicator */}
        <div 
          className="hidden sm:flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 font-medium"
          title="متصل بخدمة Supabase السحابية لتخزين ومزامنة المشاريع"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>سحابي Supabase</span>
        </div>
      </div>

      {/* Aspect Ratio Switcher (Canvas Dimension Controls) */}
      <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/80 gap-0.5">
        <button
          onClick={() => onUpdateAspectRatio('9:16')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
            project.aspectRatio === '9:16'
              ? 'bg-white text-sky-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
          title="نسبة 9:16 - مثالية لـ Reels و TikTok و Shorts"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>9:16 عمودي</span>
        </button>

        <button
          onClick={() => onUpdateAspectRatio('16:9')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
            project.aspectRatio === '16:9'
              ? 'bg-white text-sky-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
          title="نسبة 16:9 - لليوتيوب وشاشات العرض العريضة"
        >
          <Tv className="w-3.5 h-3.5" />
          <span>16:9 عريض</span>
        </button>

        <button
          onClick={() => onUpdateAspectRatio('1:1')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
            project.aspectRatio === '1:1'
              ? 'bg-white text-sky-600 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
          title="نسبة 1:1 - مربعة لمنشورات إنستغرام وفيسبوك"
        >
          <Square className="w-3.5 h-3.5" />
          <span>1:1 مربع</span>
        </button>
      </div>

      {/* Action Buttons: Save, Projects, Export */}
      <div className="flex items-center gap-2">
        {saveNotice && (
          <span className="text-[11px] text-sky-700 hidden lg:inline font-medium bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-md">
            {saveNotice}
          </span>
        )}

        <button
          onClick={onSaveProject}
          disabled={isSaving}
          className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 transition active:scale-95 disabled:opacity-50"
          title="حفظ المشروع في Supabase"
        >
          <Save className={`w-3.5 h-3.5 ${isSaving ? 'animate-spin text-sky-500' : 'text-slate-500'}`} />
          <span>{isSaving ? 'جاري الحفظ...' : 'حفظ'}</span>
        </button>

        <button
          onClick={onOpenProjectsList}
          className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 transition active:scale-95"
          title="فتح قائمة المشاريع"
        >
          <FolderOpen className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">المشاريع</span>
        </button>

        <button
          onClick={onNewProject}
          className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 transition active:scale-95"
          title="إنشاء مشروع جديد"
        >
          <PlusCircle className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">جديد</span>
        </button>

        <button
          onClick={onOpenExportModal}
          className="flex items-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm shadow-sky-500/25 transition active:scale-95"
          title="تصدير وتحميل الفيديو النهائي"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>تصدير الفيديو</span>
        </button>
      </div>
    </header>
  );
};

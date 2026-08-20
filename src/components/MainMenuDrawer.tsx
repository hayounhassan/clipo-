import React, { useState } from 'react';
import { 
  X, 
  Save, 
  Download, 
  FolderOpen, 
  PlusCircle, 
  Database, 
  Globe, 
  Film, 
  Tv, 
  Smartphone, 
  Square, 
  Layers, 
  Edit3, 
  Check 
} from 'lucide-react';
import { ProjectState, AspectRatio } from '../types';

interface MainMenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectState;
  onUpdateProjectName: (name: string) => void;
  onUpdateAspectRatio?: (ratio: AspectRatio) => void;
  onSaveProject: () => void;
  onNewProject: () => void;
  onOpenProjectsList: () => void;
  onOpenExportModal: () => void;
  isSaving: boolean;
  saveNotice: string | null;
  supabaseConnected: boolean;
  currentLanguage: 'ar' | 'en';
  onToggleLanguage: () => void;
}

export const MainMenuDrawer: React.FC<MainMenuDrawerProps> = ({
  isOpen,
  onClose,
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
  currentLanguage,
  onToggleLanguage,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(project.name);

  if (!isOpen) return null;

  const handleTitleSubmit = () => {
    if (tempTitle.trim()) {
      onUpdateProjectName(tempTitle.trim());
    } else {
      setTempTitle(project.name);
    }
    setIsEditingTitle(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex" dir="rtl">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200 border-l border-slate-200 text-slate-800 select-none">
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-[#0B1E3B] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center font-black text-sm shadow-xs shadow-sky-500/20">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-base tracking-tight">Clipo</span>
                <span className="text-[10px] font-bold bg-sky-500/30 text-sky-200 px-1.5 py-0.2 rounded border border-sky-400/40">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-300">محرر فيديو UGC والعقارات الذكي</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="إغلاق القائمة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-5">
          {/* Active Project Info Card with Edit capability */}
          <div className="bg-sky-50/70 border border-sky-100 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-sky-900">
              <span className="font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-600" />
                <span>المشروع الحالي</span>
              </span>
              <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-sky-200 font-bold text-sky-700">
                {project.aspectRatio}
              </span>
            </div>

            {/* Editable Project Name */}
            {isEditingTitle ? (
              <div className="flex items-center gap-1 bg-white border border-sky-400 rounded-lg p-1 shadow-2xs">
                <input
                  type="text"
                  value={tempTitle}
                  onChange={(e) => setTempTitle(e.target.value)}
                  onBlur={handleTitleSubmit}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleTitleSubmit();
                    if (e.key === 'Escape') {
                      setTempTitle(project.name);
                      setIsEditingTitle(false);
                    }
                  }}
                  autoFocus
                  className="w-full text-xs font-bold text-slate-900 outline-none px-1"
                />
                <button
                  onClick={handleTitleSubmit}
                  className="p-1 bg-sky-500 text-white rounded hover:bg-sky-600 cursor-pointer"
                >
                  <Check className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => {
                  setTempTitle(project.name);
                  setIsEditingTitle(true);
                }}
                className="group flex items-center justify-between cursor-pointer hover:bg-white p-1.5 rounded-lg transition border border-transparent hover:border-sky-200"
                title="انقر لتعديل اسم المشروع"
              >
                <div className="font-bold text-slate-800 text-sm truncate">
                  {project.name}
                </div>
                <Edit3 className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 flex-shrink-0" />
              </div>
            )}

            {/* Aspect Ratio Selector Inside Drawer if user wishes to change canvas */}
            {onUpdateAspectRatio && (
              <div className="pt-2 border-t border-sky-200/50">
                <div className="text-[11px] font-bold text-slate-500 mb-1.5">أبعاد الفيديو (Canvas Ratio):</div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => onUpdateAspectRatio('9:16')}
                    className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-bold transition ${
                      project.aspectRatio === '9:16'
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-sky-100/60 border border-slate-200'
                    }`}
                  >
                    <Smartphone className="w-3 h-3" />
                    <span>9:16 عمودي</span>
                  </button>
                  <button
                    onClick={() => onUpdateAspectRatio('16:9')}
                    className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-bold transition ${
                      project.aspectRatio === '16:9'
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-sky-100/60 border border-slate-200'
                    }`}
                  >
                    <Tv className="w-3 h-3" />
                    <span>16:9 عريض</span>
                  </button>
                  <button
                    onClick={() => onUpdateAspectRatio('1:1')}
                    className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-bold transition ${
                      project.aspectRatio === '1:1'
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-sky-100/60 border border-slate-200'
                    }`}
                  >
                    <Square className="w-3 h-3" />
                    <span>1:1 مربع</span>
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-sky-200/50">
              <span>{project.clips.length} مقاطع فيديو</span>
              <span>{project.textOverlays.length} شارات ونصوص</span>
            </div>
          </div>

          {/* Core Actions: Save, Export, Projects */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              العمليات الرئيسية
            </span>

            {/* Save Project Button */}
            <button
              onClick={() => {
                onSaveProject();
              }}
              disabled={isSaving}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 transition text-slate-800 active:scale-98 shadow-2xs cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Save className={`w-4 h-4 ${isSaving ? 'animate-spin' : ''}`} />
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800">
                    {isSaving ? 'جاري الحفظ والمزامنة...' : 'حفظ المشروع'}
                  </div>
                  <div className="text-[11px] text-slate-500">حفظ التعديلات في Supabase والمساحة المحلية</div>
                </div>
              </div>
              {saveNotice ? (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  تم
                </span>
              ) : null}
            </button>

            {/* Export Video Button */}
            <button
              onClick={() => {
                onClose();
                onOpenExportModal();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white transition active:scale-98 shadow-sm shadow-sky-500/20 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Download className="w-4 h-4 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold">تصدير وتحميل الفيديو</div>
                  <div className="text-[11px] text-sky-100">تنزيل بدقة 1080p جاهز للنشر على تيك توك وريلز</div>
                </div>
              </div>
            </button>

            {/* Open Projects Manager */}
            <button
              onClick={() => {
                onClose();
                onOpenProjectsList();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 transition text-slate-800 active:scale-98 shadow-2xs cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <FolderOpen className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800">إدارة المشاريع السابقة</div>
                  <div className="text-[11px] text-slate-500">عرض وتبديل واسترجاع المشاريع المحفوظة</div>
                </div>
              </div>
            </button>

            {/* New Project */}
            <button
              onClick={() => {
                onClose();
                onNewProject();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 transition text-slate-800 active:scale-98 shadow-2xs cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800">إنشاء مشروع جديد فارغ</div>
                  <div className="text-[11px] text-slate-500">بدء مونتاج فيديو جديد من الصفر</div>
                </div>
              </div>
            </button>
          </div>

          {/* Database & Cloud Persistence Status */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              حالة التخزين السحابي
            </span>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-800">Supabase Cloud Database</span>
                </div>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>متصل</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                يتم حفظ المشاريع، المقاطع، النصوص، والوسائط تلقائياً ومزامنتها سحابياً لضمان عدم فقدان أي عمل.
              </p>
            </div>
          </div>

          {/* Language Toggle */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              اللغة (Language)
            </span>

            <button
              onClick={onToggleLanguage}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 transition text-slate-800 cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-sky-600" />
                <span className="text-xs font-bold">لغة الواجهة</span>
              </div>
              <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-200">
                {currentLanguage === 'ar' ? 'العربية (Arabic)' : 'English'}
              </span>
            </button>
          </div>

          {/* Shortcuts Quick Reference */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              اختصارات لوحة المفاتيح
            </span>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2 text-xs text-slate-700">
              <div className="flex items-center justify-between">
                <span>تشغيل / إيقاف مؤقت</span>
                <kbd className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-mono shadow-2xs">Space</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>حذف المقطع أو النص</span>
                <kbd className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-mono shadow-2xs">Delete / Backspace</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>تقديم / ترجيع ثانية</span>
                <kbd className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-mono shadow-2xs">Arrow Left / Right</kbd>
              </div>
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center text-[11px] text-slate-400">
          Clipo Video Editor • نسخة الويب السريعة
        </div>
      </div>
    </div>
  );
};

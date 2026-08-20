import React from 'react';
import { 
  Scissors, 
  Gauge, 
  Sparkles, 
  Music, 
  Type, 
  Trash2, 
  Copy, 
  FolderPlus, 
  LayoutTemplate, 
  Volume2, 
  ChevronsRight, 
  ChevronsLeft,
  X,
  Play,
  Pause,
  Save,
  Download,
  Check
} from 'lucide-react';
import { VideoClip } from '../types';

interface BottomEditingToolbarProps {
  activeTab: 'media' | 'text' | 'effects' | 'templates' | 'audio' | null;
  onSelectTab: (tab: 'media' | 'text' | 'effects' | 'templates' | 'audio') => void;
  selectedClip: VideoClip | null;
  selectedClipId: string | null;
  selectedOverlayId: string | null;
  currentTime: number;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onSplit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onTrimIn?: () => void;
  onTrimOut?: () => void;
  onUpdateClipSpeed?: (speed: number) => void;
  onDeselectClip?: () => void;
  canSplit: boolean;
  onSaveProject: () => void;
  onOpenExportModal: () => void;
  isSaving: boolean;
  saveNotice: string | null;
}

export const BottomEditingToolbar: React.FC<BottomEditingToolbarProps> = ({
  activeTab,
  onSelectTab,
  selectedClip,
  selectedClipId,
  selectedOverlayId,
  currentTime,
  isPlaying,
  onTogglePlay,
  onSplit,
  onDelete,
  onDuplicate,
  onTrimIn,
  onTrimOut,
  onUpdateClipSpeed,
  onDeselectClip,
  canSplit,
  onSaveProject,
  onOpenExportModal,
  isSaving,
  saveNotice,
}) => {
  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <div className="bg-white border-b border-slate-200 shadow-xs flex flex-col select-none transition-all duration-200">
      {/* Contextual Status Bar when a clip is selected */}
      {selectedClip && (
        <div className="bg-sky-50/90 border-b border-sky-100 px-4 py-1.5 flex items-center justify-between text-xs text-sky-900 animate-in fade-in duration-150">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="flex h-2 w-2 rounded-full bg-sky-500 animate-pulse"></span>
            <span className="font-bold text-sky-950">مقطع محدد:</span>
            <span className="font-medium text-sky-800 truncate max-w-[180px]">
              {selectedClip.name}
            </span>
            <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-sky-200 text-sky-700">
              {((selectedClip.clipEnd - selectedClip.clipStart) / (selectedClip.speed || 1)).toFixed(1)} ثانية
            </span>
            {selectedClip.speed && selectedClip.speed !== 1 && (
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200">
                {selectedClip.speed}x
              </span>
            )}
            {selectedClip.filter && selectedClip.filter !== 'none' && (
              <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded border border-purple-200">
                فلتر مخصص ✨
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Speed Quick Selector for Selected Clip */}
            <div className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded-lg border border-sky-200 text-[11px]">
              <span className="text-slate-500 text-[10px]">السرعة:</span>
              {speedOptions.map((sp) => (
                <button
                  key={sp}
                  onClick={() => onUpdateClipSpeed?.(sp)}
                  className={`px-1.5 py-0.5 rounded font-bold transition text-[10px] ${
                    (selectedClip.speed || 1) === sp
                      ? 'bg-sky-500 text-white'
                      : 'text-slate-600 hover:text-sky-600 hover:bg-sky-50'
                  }`}
                >
                  {sp}x
                </button>
              ))}
            </div>

            {onDeselectClip && (
              <button
                onClick={onDeselectClip}
                className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 transition"
                title="إلغاء تحديد المقطع"
              >
                <X className="w-3 h-3" />
                <span>إلغاء التحديد</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main CapCut & InShot Styled Bottom Editing Toolbar */}
      <div className="px-3 py-2 flex items-center justify-between gap-2 overflow-x-auto custom-scrollbar">
        {/* Main Editing Operations Row */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* 1. Quick Play / Pause Button */}
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition active:scale-95 shadow-xs ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
                : 'bg-sky-500 hover:bg-sky-600 text-white shadow-sky-500/20'
            }`}
            title="تشغيل أو إيقاف معاينة الفيديو (Space)"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>إيقاف (Pause)</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white ml-0.5" />
                <span>تشغيل (Play)</span>
              </>
            )}
          </button>

          <div className="h-5 w-px bg-slate-200 mx-0.5"></div>

          {/* 2. Media Library (الوسائط) */}
          <button
            onClick={() => onSelectTab('media')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition active:scale-95 border ${
              activeTab === 'media'
                ? 'bg-sky-500 border-sky-600 text-white shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300 shadow-2xs'
            }`}
            title="مكتبة الفيديوهات والصور ورفع لقطات جديدة من الجهاز"
          >
            <FolderPlus className={`w-4 h-4 ${activeTab === 'media' ? 'text-white' : 'text-blue-500'}`} />
            <span>الوسائط (Media)</span>
          </button>

          {/* 3. Text & Stickers (النص والملصقات) */}
          <button
            onClick={() => onSelectTab('text')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition active:scale-95 border ${
              activeTab === 'text'
                ? 'bg-sky-500 border-sky-600 text-white shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300 shadow-2xs'
            }`}
            title="إضافة نصوص، شارات السعر، بطاقات العقار ودعوات اتخاذ الإجراء"
          >
            <Type className={`w-4 h-4 ${activeTab === 'text' ? 'text-white' : 'text-sky-500'}`} />
            <span>النص والملصقات</span>
          </button>

          {/* 4. Split / Cut (تقسيم / قص) */}
          <button
            onClick={onSplit}
            disabled={!canSplit}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition active:scale-95 border ${
              selectedClip
                ? 'bg-sky-50 border-sky-300 text-sky-700 hover:bg-sky-100 hover:border-sky-400 shadow-xs'
                : canSplit
                ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-2xs'
                : 'bg-slate-50 border-slate-200/60 text-slate-400 cursor-not-allowed opacity-60'
            }`}
            title="تقسيم المقطع عند موضع المؤشر الزمني الحالي"
          >
            <Scissors className={`w-4 h-4 ${selectedClip ? 'text-sky-600' : 'text-slate-500'}`} />
            <span>تقسيم (Split)</span>
          </button>

          {/* 5. Speed (السرعة) */}
          <button
            onClick={() => onSelectTab('effects')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition active:scale-95 border ${
              activeTab === 'effects' && selectedClip
                ? 'bg-sky-500 border-sky-600 text-white shadow-xs'
                : selectedClip
                ? 'bg-white border-slate-200 text-slate-800 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300 shadow-2xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-2xs'
            }`}
            title="التحكم في سرعة تشغيل الفيديو (0.5x - 2.0x)"
          >
            <Gauge className={`w-4 h-4 ${activeTab === 'effects' && selectedClip ? 'text-white' : 'text-amber-500'}`} />
            <span>السرعة</span>
            {selectedClip?.speed && selectedClip.speed !== 1 && (
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1 py-0.2 rounded font-mono">
                {selectedClip.speed}x
              </span>
            )}
          </button>

          {/* 6. Effects & Filters (المؤثرات والفلتر) */}
          <button
            onClick={() => onSelectTab('effects')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition active:scale-95 border ${
              activeTab === 'effects'
                ? 'bg-sky-500 border-sky-600 text-white shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300 shadow-2xs'
            }`}
            title="الفلاتر العقارية وضبط الألوان والسطوع والتشبع"
          >
            <Sparkles className={`w-4 h-4 ${activeTab === 'effects' ? 'text-white' : 'text-purple-500'}`} />
            <span>المؤثرات والفلتر</span>
          </button>

          {/* 7. Audio & Music (الصوت والموسيقى) */}
          <button
            onClick={() => onSelectTab('audio')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition active:scale-95 border ${
              activeTab === 'audio'
                ? 'bg-sky-500 border-sky-600 text-white shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300 shadow-2xs'
            }`}
            title="إضافة موسيقى خلفية، مؤثرات صوتية وتعديل مستوى الصوت"
          >
            <Music className={`w-4 h-4 ${activeTab === 'audio' ? 'text-white' : 'text-emerald-500'}`} />
            <span>الصوت (Audio)</span>
          </button>

          {/* 8. Templates (قوالب جاهزة) */}
          <button
            onClick={() => onSelectTab('templates')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition active:scale-95 border ${
              activeTab === 'templates'
                ? 'bg-sky-500 border-sky-600 text-white shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300 shadow-2xs'
            }`}
            title="قوالب إعلانات عقارية و UGC جاهزة بنقرة واحدة"
          >
            <LayoutTemplate className={`w-4 h-4 ${activeTab === 'templates' ? 'text-white' : 'text-indigo-500'}`} />
            <span className="hidden md:inline">قوالب (Templates)</span>
          </button>
        </div>

        {/* Action Controls & Save / Export Section */}
        <div className="flex items-center gap-1.5 border-r border-slate-200 pr-2 mr-1">
          {/* Trim In & Out when a clip is selected */}
          {selectedClip && onTrimIn && onTrimOut && (
            <>
              <button
                onClick={onTrimIn}
                className="hidden xl:flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-700 px-2 py-2 rounded-xl text-xs font-medium border border-slate-200 transition"
                title="قص بداية المقطع حتى موقع المؤشر الحالي"
              >
                <ChevronsRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[11px]">قص البداية</span>
              </button>

              <button
                onClick={onTrimOut}
                className="hidden xl:flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-700 px-2 py-2 rounded-xl text-xs font-medium border border-slate-200 transition"
                title="قص نهاية المقطع بعد موقع المؤشر الحالي"
              >
                <ChevronsLeft className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[11px]">قص النهاية</span>
              </button>
            </>
          )}

          {/* Duplicate Button */}
          {selectedClip && (
            <button
              onClick={onDuplicate}
              className="flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-700 px-2.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 transition active:scale-95 shadow-2xs"
              title="تكرار المقطع المحدد"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">تكرار</span>
            </button>
          )}

          {/* Delete Button (حذف) */}
          {(selectedClipId || selectedOverlayId) && (
            <button
              onClick={onDelete}
              className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 py-2 rounded-xl text-xs font-bold border border-rose-200 transition active:scale-95 shadow-xs"
              title={selectedClipId ? 'حذف مقطع الفيديو المحدد' : 'حذف النص / الشارة المحددة'}
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>حذف</span>
            </button>
          )}

          {/* Quick Save with Notice */}
          <button
            onClick={onSaveProject}
            disabled={isSaving}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-200 transition active:scale-95 shadow-2xs disabled:opacity-50"
            title="حفظ التعديلات في Supabase"
          >
            <Save className={`w-3.5 h-3.5 ${isSaving ? 'animate-spin text-sky-500' : 'text-slate-600'}`} />
            <span className="hidden sm:inline">{isSaving ? 'جاري الحفظ...' : 'حفظ'}</span>
          </button>

          {/* Export Video Action Button */}
          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs shadow-sky-500/25 transition active:scale-95 flex-shrink-0"
            title="تصدير وتحميل الفيديو النهائي"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>تصدير</span>
          </button>
        </div>
      </div>
    </div>
  );
};

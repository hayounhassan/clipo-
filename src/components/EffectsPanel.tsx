import React from 'react';
import { 
  Sparkles, 
  Sliders, 
  Sun, 
  Contrast, 
  Palette, 
  Gauge, 
  Volume2, 
  RotateCcw,
  Check
} from 'lucide-react';
import { VideoClip } from '../types';

interface EffectsPanelProps {
  selectedClip: VideoClip | null;
  onUpdateClip: (clip: VideoClip) => void;
}

const FILTER_PRESETS: { id: VideoClip['filter']; name: string; desc: string; icon: string }[] = [
  { id: 'none', name: 'أصلي (Normal)', desc: 'ألوان الفيديو الأصلية بدون تعديل', icon: '🪄' },
  { id: 'real_estate_glow', name: 'إشراق عقاري (RE Glow)', desc: 'تفتيح وإبراز تفاصيل الديكور والإضاءة', icon: '🏡' },
  { id: 'luxury_gold', name: 'دفء ذهبي فاخر (Luxury Gold)', desc: 'درجات ذهبية راقية تناسب الفلل', icon: '✨' },
  { id: 'vibrant_ugc', name: 'ألوان حيوية (Vibrant UGC)', desc: 'تشبع جذاب لمقاطع TikTok و Reels', icon: '🔥' },
  { id: 'warm_sun', name: 'ساعة الغروب (Golden Hour)', desc: 'أجواء الغروب الدافئة والشاعرية', icon: '🌅' },
  { id: 'cinema', name: 'سينمائي مودرن (Cinema)', desc: 'تباين وألوان سينمائية متوازنة', icon: '🎬' },
  { id: 'noir', name: 'أبيض وأسود (Noir)', desc: 'تدرج رمادي سينمائي كلاسيكي', icon: '🖤' },
];

export const EffectsPanel: React.FC<EffectsPanelProps> = ({
  selectedClip,
  onUpdateClip,
}) => {
  if (!selectedClip) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center text-slate-400 space-y-2 select-none bg-white">
        <Sliders className="w-10 h-10 text-slate-300" />
        <p className="text-sm font-semibold text-slate-700">حدد مقطعاً لتعديل ألوانه ومؤثراته</p>
        <p className="text-xs text-slate-500">
          انقر على أي مقطع في الخط الزمني لتطبيق الفلاتر والتحكم بالسطوع والسرعة
        </p>
      </div>
    );
  }

  const handleResetAdjustments = () => {
    onUpdateClip({
      ...selectedClip,
      filter: 'none',
      brightness: 100,
      contrast: 100,
      saturation: 100,
      speed: 1,
      volume: 1,
    });
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar p-3 space-y-4 text-slate-800 select-none bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div>
          <span className="text-xs font-bold text-sky-600">تعديل المقطع:</span>
          <span className="text-xs font-semibold text-slate-800 mr-1.5 truncate max-w-[140px] inline-block align-bottom">
            {selectedClip.name}
          </span>
        </div>
        <button
          onClick={handleResetAdjustments}
          className="text-[11px] text-slate-500 hover:text-sky-600 flex items-center gap-1 transition"
          title="إعادة تعيين الألوان للوضع الافتراضي"
        >
          <RotateCcw className="w-3 h-3" />
          <span>إعادة ضبط</span>
        </button>
      </div>

      {/* Preset Filters Grid */}
      <div>
        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
          <span>فلاتر احترافية جاهزة</span>
        </span>

        <div className="grid grid-cols-2 gap-2">
          {FILTER_PRESETS.map((filter) => {
            const isActive = selectedClip.filter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => onUpdateClip({ ...selectedClip, filter: filter.id })}
                className={`p-2.5 rounded-xl border text-right transition flex flex-col justify-between ${
                  isActive
                    ? 'bg-sky-50 border-sky-500 text-sky-900 ring-1 ring-sky-400'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-base">{filter.icon}</span>
                  {isActive && <Check className="w-3.5 h-3.5 text-sky-500" />}
                </div>
                <div className="mt-2">
                  <div className="text-xs font-bold leading-tight">{filter.name}</div>
                  <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{filter.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sliders for Adjustments */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-3">
        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-sky-500" />
          <span>الضبط الدقيق للألوان</span>
        </span>

        {/* Brightness */}
        <div>
          <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
            <span className="flex items-center gap-1">
              <Sun className="w-3 h-3 text-sky-500" />
              <span>السطوع (Brightness)</span>
            </span>
            <span className="font-mono text-slate-800">{selectedClip.brightness ?? 100}%</span>
          </div>
          <input
            type="range"
            min="60"
            max="140"
            value={selectedClip.brightness ?? 100}
            onChange={(e) =>
              onUpdateClip({ ...selectedClip, brightness: Number(e.target.value) })
            }
            className="w-full accent-sky-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
          />
        </div>

        {/* Contrast */}
        <div>
          <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
            <span className="flex items-center gap-1">
              <Contrast className="w-3 h-3 text-sky-500" />
              <span>التباين (Contrast)</span>
            </span>
            <span className="font-mono text-slate-800">{selectedClip.contrast ?? 100}%</span>
          </div>
          <input
            type="range"
            min="60"
            max="140"
            value={selectedClip.contrast ?? 100}
            onChange={(e) =>
              onUpdateClip({ ...selectedClip, contrast: Number(e.target.value) })
            }
            className="w-full accent-sky-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
          />
        </div>

        {/* Saturation */}
        <div>
          <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
            <span className="flex items-center gap-1">
              <Palette className="w-3 h-3 text-sky-500" />
              <span>التشبع اللوني (Saturation)</span>
            </span>
            <span className="font-mono text-slate-800">{selectedClip.saturation ?? 100}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="180"
            value={selectedClip.saturation ?? 100}
            onChange={(e) =>
              onUpdateClip({ ...selectedClip, saturation: Number(e.target.value) })
            }
            className="w-full accent-sky-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Speed & Volume */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-3">
        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Gauge className="w-3.5 h-3.5 text-sky-500" />
          <span>سرعة المقطع ومستوى الصوت</span>
        </span>

        {/* Speed */}
        <div>
          <label className="text-[11px] font-medium text-slate-600 block mb-1.5">
            سرعة التشغيل:
          </label>
          <div className="grid grid-cols-5 gap-1">
            {[0.5, 1, 1.25, 1.5, 2].map((sp) => (
              <button
                key={sp}
                onClick={() => onUpdateClip({ ...selectedClip, speed: sp })}
                className={`py-1 rounded-lg text-xs font-bold transition border ${
                  (selectedClip.speed || 1) === sp
                    ? 'bg-sky-500 text-white border-sky-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {sp}x
              </button>
            ))}
          </div>
        </div>

        {/* Volume */}
        <div>
          <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
            <span className="flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-sky-500" />
              <span>صوت الفيديو الأصلي</span>
            </span>
            <span className="font-mono text-slate-800">
              {Math.round((selectedClip.volume ?? 1) * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={selectedClip.volume ?? 1}
            onChange={(e) =>
              onUpdateClip({ ...selectedClip, volume: Number(e.target.value) })
            }
            className="w-full accent-sky-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

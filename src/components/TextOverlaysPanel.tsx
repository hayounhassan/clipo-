import React, { useState } from 'react';
import { 
  Type, 
  Plus, 
  Trash2, 
  Sparkles, 
  Tag
} from 'lucide-react';
import { REAL_ESTATE_STICKER_PRESETS } from '../data/sampleMedia';
import { TextOverlay, TextStyle } from '../types';

interface TextOverlaysPanelProps {
  textOverlays: TextOverlay[];
  selectedOverlayId: string | null;
  currentTime: number;
  totalDuration: number;
  onAddOverlay: (overlay: TextOverlay) => void;
  onUpdateOverlay: (overlay: TextOverlay) => void;
  onDeleteOverlay: (overlayId: string) => void;
  onSelectOverlay: (overlayId: string) => void;
}

export const TextOverlaysPanel: React.FC<TextOverlaysPanelProps> = ({
  textOverlays,
  selectedOverlayId,
  currentTime,
  totalDuration,
  onAddOverlay,
  onUpdateOverlay,
  onDeleteOverlay,
  onSelectOverlay,
}) => {
  const selectedOverlay = textOverlays.find((o) => o.id === selectedOverlayId);

  const handleAddPreset = (preset: typeof REAL_ESTATE_STICKER_PRESETS[0]) => {
    const start = Math.max(0, Math.floor(currentTime));
    const end = Math.min(totalDuration || 15, start + 5);

    const newOverlay: TextOverlay = {
      id: `overlay-${Date.now()}`,
      text: preset.text,
      subtitle: preset.subtitle,
      startTime: start,
      endTime: end,
      x: 50,
      y: preset.style === 'call_to_action' ? 82 : preset.style === 'price_tag' ? 25 : 50,
      fontSize: 16,
      color: preset.color,
      bgColor: preset.bgColor,
      fontFamily: 'inherit',
      style: preset.style,
      animation: 'pop',
      badgeIcon: preset.badgeIcon,
    };
    onAddOverlay(newOverlay);
    onSelectOverlay(newOverlay.id);
  };

  const handleAddCustomText = () => {
    const start = Math.max(0, Math.floor(currentTime));
    const end = Math.min(totalDuration || 15, start + 4);

    const newOverlay: TextOverlay = {
      id: `overlay-${Date.now()}`,
      text: 'اكتب نصك هنا...',
      startTime: start,
      endTime: end,
      x: 50,
      y: 50,
      fontSize: 18,
      color: '#FFFFFF',
      bgColor: '#000000',
      fontFamily: 'inherit',
      style: 'clean',
      animation: 'fade',
    };
    onAddOverlay(newOverlay);
    onSelectOverlay(newOverlay.id);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar p-3 space-y-4 text-slate-800 select-none bg-white">
      {/* Add Custom Text Button */}
      <button
        onClick={handleAddCustomText}
        className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white py-2.5 px-4 rounded-xl font-bold text-xs transition active:scale-95 shadow-sm shadow-sky-500/20"
      >
        <Plus className="w-4 h-4" />
        <span>إضافة نص أو تسمية جديدة</span>
      </button>

      {/* Real Estate & UGC Presets */}
      <div>
        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
          <Tag className="w-3.5 h-3.5 text-sky-500" />
          <span>ملصقات وشارات جاهزة للعقارات</span>
        </span>

        <div className="grid grid-cols-1 gap-2">
          {REAL_ESTATE_STICKER_PRESETS.map((preset, idx) => (
            <div
              key={idx}
              onClick={() => handleAddPreset(preset)}
              className="bg-slate-50 border border-slate-200 hover:border-sky-300 rounded-xl p-2.5 cursor-pointer transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-xl flex-shrink-0">{preset.badgeIcon}</span>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-800 group-hover:text-sky-600 transition-colors truncate">
                    {preset.text}
                  </div>
                  {preset.subtitle && (
                    <div className="text-[10px] text-slate-500 truncate">
                      {preset.subtitle}
                    </div>
                  )}
                </div>
              </div>

              <span className="text-[10px] bg-white border border-slate-200 group-hover:bg-sky-500 group-hover:text-white font-bold text-slate-600 px-2 py-0.5 rounded-md transition shadow-xs">
                + إضافة
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Overlay Inspector */}
      {selectedOverlay ? (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-xs font-bold text-sky-600 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5" />
              <span>تعديل النص المحدد</span>
            </span>
            <button
              onClick={() => onDeleteOverlay(selectedOverlay.id)}
              className="text-rose-500 hover:text-rose-600 text-xs flex items-center gap-1"
              title="حذف هذا النص"
            >
              <Trash2 className="w-3 h-3" />
              <span>حذف</span>
            </button>
          </div>

          {/* Text input */}
          <div>
            <label className="text-[11px] font-medium text-slate-600 block mb-1">
              النص الرئيسي:
            </label>
            <input
              type="text"
              value={selectedOverlay.text}
              onChange={(e) =>
                onUpdateOverlay({ ...selectedOverlay, text: e.target.value })
              }
              className="w-full bg-white border border-slate-300 focus:border-sky-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 outline-none"
            />
          </div>

          {/* Subtitle input */}
          <div>
            <label className="text-[11px] font-medium text-slate-600 block mb-1">
              النص الفرعي (اختياري):
            </label>
            <input
              type="text"
              value={selectedOverlay.subtitle || ''}
              onChange={(e) =>
                onUpdateOverlay({ ...selectedOverlay, subtitle: e.target.value })
              }
              placeholder="مثال: المساحة أو الموقع"
              className="w-full bg-white border border-slate-300 focus:border-sky-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 outline-none"
            />
          </div>

          {/* Style Selector */}
          <div>
            <label className="text-[11px] font-medium text-slate-600 block mb-1">
              قالب الملصق:
            </label>
            <select
              value={selectedOverlay.style}
              onChange={(e) =>
                onUpdateOverlay({
                  ...selectedOverlay,
                  style: e.target.value as TextStyle,
                })
              }
              className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-800 outline-none"
            >
              <option value="price_tag">💰 بطاقة سعر فاخرة (Price Tag)</option>
              <option value="real_estate_badge">🏡 شارة عقارية مميزة (Luxury Badge)</option>
              <option value="ugc_caption">🗣️ عنوان UGC مميز (UGC Caption)</option>
              <option value="call_to_action">🔥 زر دعوة لاتخاذ إجراء (Call to Action)</option>
              <option value="location_pill">📐 مواصفات ومعلومات (Pill Badge)</option>
              <option value="headline">📰 عنوان رئيسي (Headline)</option>
              <option value="clean">✨ نص نقي بسيط (Clean Text)</option>
            </select>
          </div>

          {/* Font Size & Emojis */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">
                حجم الخط: {selectedOverlay.fontSize}px
              </label>
              <input
                type="range"
                min="12"
                max="36"
                value={selectedOverlay.fontSize}
                onChange={(e) =>
                  onUpdateOverlay({
                    ...selectedOverlay,
                    fontSize: Number(e.target.value),
                  })
                }
                className="w-full accent-sky-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">
                الأيقونة:
              </label>
              <div className="flex gap-1">
                {['🏡', '💰', '✨', '📲', '🔥', '📍'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() =>
                      onUpdateOverlay({ ...selectedOverlay, badgeIcon: emoji })
                    }
                    className={`p-1 rounded-md text-xs transition border ${
                      selectedOverlay.badgeIcon === emoji
                        ? 'bg-sky-500 text-white border-sky-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Timing */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">
                البداية (ثانية):
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                max={selectedOverlay.endTime - 0.5}
                value={selectedOverlay.startTime}
                onChange={(e) =>
                  onUpdateOverlay({
                    ...selectedOverlay,
                    startTime: Number(e.target.value),
                  })
                }
                className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-800 outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-slate-600 block mb-1">
                النهاية (ثانية):
              </label>
              <input
                type="number"
                step="0.5"
                min={selectedOverlay.startTime + 0.5}
                value={selectedOverlay.endTime}
                onChange={(e) =>
                  onUpdateOverlay({
                    ...selectedOverlay,
                    endTime: Number(e.target.value),
                  })
                }
                className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-800 outline-none"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-center text-slate-500 text-xs">
          اختر أي نص من الخط الزمني أو أضف ملصقاً لتعديله.
        </div>
      )}
    </div>
  );
};

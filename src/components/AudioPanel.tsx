import React, { useRef, useState } from 'react';
import { 
  Music, 
  UploadCloud, 
  Volume2, 
  VolumeX, 
  Trash2, 
  Play, 
  Pause, 
  Plus, 
  Check, 
  Sparkles,
  Sliders
} from 'lucide-react';
import { AudioTrack, VideoClip } from '../types';
import { SAMPLE_AUDIO } from '../data/sampleMedia';

interface AudioPanelProps {
  audioTracks: AudioTrack[];
  selectedClip: VideoClip | null;
  onAddAudioTrack: (audio: AudioTrack) => void;
  onUpdateAudioTrackVolume: (volume: number) => void;
  onRemoveAudioTrack: () => void;
  onUpdateClip: (clip: VideoClip) => void;
}

export const AudioPanel: React.FC<AudioPanelProps> = ({
  audioTracks,
  selectedClip,
  onAddAudioTrack,
  onUpdateAudioTrackVolume,
  onRemoveAudioTrack,
  onUpdateClip,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [playingPreviewId, setPlayingPreviewId] = useState<string | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  const currentAudio = audioTracks[0] || null;

  const handleTogglePreview = (url: string, id: string) => {
    if (playingPreviewId === id) {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
      setPlayingPreviewId(null);
    } else {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
      const audio = new Audio(url);
      previewAudioRef.current = audio;
      audio.play().catch((err) => console.log('Preview playback notice:', err));
      setPlayingPreviewId(id);
      audio.onended = () => setPlayingPreviewId(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const objectUrl = URL.createObjectURL(file);
    const newTrack: AudioTrack = {
      id: `audio-${Date.now()}`,
      name: file.name.replace(/\.[^/.]+$/, ''),
      url: objectUrl,
      duration: 30,
      startTime: 0,
      volume: 0.7,
    };
    onAddAudioTrack(newTrack);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar p-3 space-y-4 text-slate-800 select-none bg-white">
      {/* Current Active Background Track */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5 text-sky-500" />
            <span>الموسيقى الخلفية للمشروع</span>
          </span>
          {currentAudio && (
            <button
              onClick={onRemoveAudioTrack}
              className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition"
              title="إزالة مسار الصوت"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {currentAudio ? (
          <div className="space-y-3">
            <div className="bg-white border border-slate-200/80 rounded-lg p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0">
                  <Music className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-slate-800 truncate">{currentAudio.name}</div>
                  <div className="text-[10px] text-slate-500">مسار نشط على الخط الزمني</div>
                </div>
              </div>
              <span className="text-[11px] font-mono text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                {Math.round(currentAudio.volume * 100)}%
              </span>
            </div>

            {/* Volume Slider */}
            <div>
              <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
                <span className="flex items-center gap-1">
                  <Volume2 className="w-3 h-3 text-sky-500" />
                  <span>مستوى صوت الموسيقى</span>
                </span>
                <span className="font-mono text-slate-800">{Math.round(currentAudio.volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={currentAudio.volume}
                onChange={(e) => onUpdateAudioTrackVolume(Number(e.target.value))}
                className="w-full accent-sky-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-4 px-2 border-2 border-dashed border-slate-200 rounded-lg bg-white">
            <Music className="w-6 h-6 text-slate-300 mx-auto mb-1.5" />
            <p className="text-xs font-semibold text-slate-600">لا توجد موسيقى خلفية حالياً</p>
            <p className="text-[11px] text-slate-400 mt-0.5">اختر من القائمة أدناه أو ارفع ملف صوتي</p>
          </div>
        )}
      </div>

      {/* Selected Clip Original Audio Control */}
      {selectedClip && (
        <div className="bg-sky-50/70 border border-sky-200/80 rounded-xl p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-900 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-sky-600" />
              <span>صوت الفيديو الأصلي للمقطع المحدد</span>
            </span>
            <span className="text-[10px] font-semibold text-sky-700 bg-white px-2 py-0.5 rounded border border-sky-200 truncate max-w-[120px]">
              {selectedClip.name}
            </span>
          </div>

          <div>
            <div className="flex justify-between text-[11px] font-medium text-slate-600 mb-1">
              <span>مستوى صوت المقطع:</span>
              <span className="font-mono font-bold text-sky-700">
                {Math.round((selectedClip.volume ?? 1) * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={selectedClip.volume ?? 1}
              onChange={(e) => onUpdateClip({ ...selectedClip, volume: Number(e.target.value) })}
              className="w-full accent-sky-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => onUpdateClip({ ...selectedClip, volume: (selectedClip.volume ?? 1) === 0 ? 1 : 0 })}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium border flex items-center gap-1.5 transition ${
                (selectedClip.volume ?? 1) === 0
                  ? 'bg-rose-100 border-rose-300 text-rose-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {(selectedClip.volume ?? 1) === 0 ? (
                <>
                  <VolumeX className="w-3 h-3 text-rose-600" />
                  <span>مكتوم (Muted)</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3 h-3 text-slate-500" />
                  <span>كتم صوت المقطع</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Upload Custom Audio File */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={handleFileUpload}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-2.5 px-3 bg-white border border-slate-200 hover:border-sky-400 hover:bg-sky-50/50 rounded-xl text-slate-700 hover:text-sky-700 flex items-center justify-center gap-2 text-xs font-bold transition shadow-xs"
        >
          <UploadCloud className="w-4 h-4 text-sky-500" />
          <span>رفع ملف صوتي من الجهاز (MP3 / WAV)</span>
        </button>
      </div>

      {/* Pre-included Audio Beats */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
          <span>مكتبة الصوتيات والموسيقى الجاهزة</span>
        </span>

        <div className="space-y-1.5">
          {SAMPLE_AUDIO.map((track) => {
            const isCurrentlySet = currentAudio?.name === track.name;
            const isPlayingThis = playingPreviewId === track.id;

            return (
              <div
                key={track.id}
                className={`p-2.5 rounded-xl border transition flex items-center justify-between gap-2 ${
                  isCurrentlySet
                    ? 'bg-sky-50 border-sky-300 ring-1 ring-sky-200'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <button
                    onClick={() => handleTogglePreview(track.url, track.id)}
                    className="w-7 h-7 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-sky-600 hover:border-sky-300 flex items-center justify-center flex-shrink-0 transition"
                    title={isPlayingThis ? 'إيقاف المعاينة' : 'تشغيل للمعاينة'}
                  >
                    {isPlayingThis ? (
                      <Pause className="w-3 h-3 text-sky-500" />
                    ) : (
                      <Play className="w-3 h-3 ml-0.5" />
                    )}
                  </button>

                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-slate-800 truncate">{track.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">المدة: {track.duration} ثانية</div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onAddAudioTrack({
                      id: `audio-${Date.now()}`,
                      name: track.name,
                      url: track.url,
                      duration: track.duration,
                      startTime: 0,
                      volume: 0.7,
                    });
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 flex-shrink-0 ${
                    isCurrentlySet
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-sky-400 hover:text-sky-600'
                  }`}
                >
                  {isCurrentlySet ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>مُضاف</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3 h-3" />
                      <span>استخدام</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

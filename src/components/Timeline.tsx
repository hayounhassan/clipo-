import React, { useRef, useState, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  Scissors, 
  Trash2, 
  Copy, 
  ZoomIn, 
  ZoomOut, 
  Volume2, 
  Type, 
  Music, 
  ChevronsLeft, 
  ChevronsRight,
  Film
} from 'lucide-react';
import { VideoClip, TextOverlay, AudioTrack } from '../types';

interface TimelineProps {
  clips: VideoClip[];
  textOverlays: TextOverlay[];
  audioTracks: AudioTrack[];
  currentTime: number;
  isPlaying: boolean;
  selectedClipId: string | null;
  selectedOverlayId: string | null;
  onTimeUpdate: (time: number) => void;
  onTogglePlay: () => void;
  onSelectClip: (clipId: string | null) => void;
  onSelectOverlay: (overlayId: string | null) => void;
  onSplitClip: (clipId: string, splitTimelineTime: number) => void;
  onTrimClipStart: (clipId: string, newStart: number) => void;
  onTrimClipEnd: (clipId: string, newEnd: number) => void;
  onDeleteClip: (clipId: string) => void;
  onDuplicateClip: (clipId: string) => void;
  onReorderClips: (fromIndex: number, toIndex: number) => void;
  onDeleteOverlay: (overlayId: string) => void;
}

export const Timeline: React.FC<TimelineProps> = ({
  clips,
  textOverlays,
  audioTracks,
  currentTime,
  isPlaying,
  selectedClipId,
  selectedOverlayId,
  onTimeUpdate,
  onTogglePlay,
  onSelectClip,
  onSelectOverlay,
  onSplitClip,
  onTrimClipStart,
  onTrimClipEnd,
  onDeleteClip,
  onDuplicateClip,
  onDeleteOverlay,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(36); // pixels per second
  const timelineContainerRef = useRef<HTMLDivElement | null>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);

  // Compute total duration
  const totalDuration = useMemo(() => {
    if (clips.length === 0) return 10;
    return Math.max(
      10,
      clips.reduce((sum, c) => sum + ((c.clipEnd - c.clipStart) / (c.speed || 1)), 0)
    );
  }, [clips]);

  // Compute start times for each clip sequentially on timeline
  const clipPositions = useMemo(() => {
    let currentStart = 0;
    return clips.map((clip) => {
      const clipDuration = (clip.clipEnd - clip.clipStart) / (clip.speed || 1);
      const start = currentStart;
      currentStart += clipDuration;
      return {
        ...clip,
        timelineStart: start,
        timelineDuration: clipDuration,
      };
    });
  }, [clips]);

  // Find clip at current playhead
  const currentClipAtPlayhead = useMemo(() => {
    return clipPositions.find(
      (c) => currentTime >= c.timelineStart && currentTime < c.timelineStart + c.timelineDuration
    );
  }, [clipPositions, currentTime]);

  // Handle Scrubbing
  const handleTimelineScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineContainerRef.current) return;
    const rect = timelineContainerRef.current.getBoundingClientRect();
    const scrollLeft = timelineContainerRef.current.scrollLeft;
    const clickX = e.clientX - rect.left + scrollLeft;
    const newTime = Math.max(0, Math.min(totalDuration, clickX / zoomLevel));
    onTimeUpdate(newTime);
  };

  const handleMouseDownScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsScrubbing(true);
    handleTimelineScrub(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isScrubbing) {
      handleTimelineScrub(e);
    }
  };

  const handleMouseUp = () => {
    setIsScrubbing(false);
  };

  // Perform split on selected or current clip
  const handleSplitAction = () => {
    const targetClip = selectedClipId 
      ? clipPositions.find((c) => c.id === selectedClipId) 
      : currentClipAtPlayhead;

    if (!targetClip) return;
    onSplitClip(targetClip.id, currentTime);
  };

  // Handle Trim In at playhead
  const handleTrimInAtPlayhead = () => {
    const target = selectedClipId ? clipPositions.find(c => c.id === selectedClipId) : currentClipAtPlayhead;
    if (!target) return;
    const relativeTimeInClip = (currentTime - target.timelineStart) * (target.speed || 1);
    const newClipStart = Math.min(target.clipEnd - 0.5, target.clipStart + relativeTimeInClip);
    onTrimClipStart(target.id, Math.max(0, newClipStart));
  };

  // Handle Trim Out at playhead
  const handleTrimOutAtPlayhead = () => {
    const target = selectedClipId ? clipPositions.find(c => c.id === selectedClipId) : currentClipAtPlayhead;
    if (!target) return;
    const relativeTimeInClip = (currentTime - target.timelineStart) * (target.speed || 1);
    const newClipEnd = Math.max(target.clipStart + 0.5, target.clipStart + relativeTimeInClip);
    onTrimClipEnd(target.id, Math.min(target.duration, newClipEnd));
  };

  // Format seconds
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Generate ruler markers
  const rulerMarks = [];
  const step = zoomLevel > 50 ? 1 : zoomLevel > 25 ? 2 : 5;
  for (let s = 0; s <= Math.ceil(totalDuration) + 5; s += step) {
    rulerMarks.push(s);
  }

  return (
    <div 
      className="bg-white border-t border-slate-200 text-slate-800 flex flex-col h-[240px] select-none"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* InShot Simple Action Toolbar */}
      <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between gap-3 text-xs">
        {/* Primary Controls (Play, Split, Trim, Duplicate, Delete) */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {/* Play/Pause */}
          <button
            onClick={onTogglePlay}
            className="flex items-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white px-3.5 py-1.5 rounded-lg font-bold transition shadow-sm"
            title="تشغيل / إيقاف مؤقت (Space)"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white ml-0.5" />}
            <span>{isPlaying ? 'إيقاف' : 'تشغيل'}</span>
          </button>

          <div className="h-4 w-px bg-slate-300 mx-1"></div>

          {/* Split (تقسيم) */}
          <button
            onClick={handleSplitAction}
            className="flex items-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 font-semibold transition"
            title="تقسيم المقطع عند موضع المؤشر الحالي"
          >
            <Scissors className="w-3.5 h-3.5 text-sky-500" />
            <span>تقسيم (Split)</span>
          </button>

          {/* Trim In (قص البداية) */}
          <button
            onClick={handleTrimInAtPlayhead}
            className="flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-200 font-medium transition"
            title="قص بداية المقطع حتى موقع المؤشر"
          >
            <ChevronsRight className="w-3.5 h-3.5 text-slate-500" />
            <span>قص البداية (Trim In)</span>
          </button>

          {/* Trim Out (قص النهاية) */}
          <button
            onClick={handleTrimOutAtPlayhead}
            className="flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-200 font-medium transition"
            title="قص نهاية المقطع بعد موقع المؤشر"
          >
            <ChevronsLeft className="w-3.5 h-3.5 text-slate-500" />
            <span>قص النهاية (Trim Out)</span>
          </button>

          {/* Duplicate (تكرار) */}
          {selectedClipId && (
            <button
              onClick={() => onDuplicateClip(selectedClipId)}
              className="flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-200 font-medium transition"
              title="تكرار المقطع المحدد"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>تكرار</span>
            </button>
          )}

          {/* Delete (حذف) */}
          {(selectedClipId || selectedOverlayId) && (
            <button
              onClick={() => {
                if (selectedClipId) onDeleteClip(selectedClipId);
                if (selectedOverlayId) onDeleteOverlay(selectedOverlayId);
              }}
              className="flex items-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 py-1.5 rounded-lg border border-rose-200 font-semibold transition"
              title="حذف العنصر المحدد"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>حذف</span>
            </button>
          )}
        </div>

        {/* Zoom Level */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 hidden md:inline">
            عدد المقاطع: <strong className="text-slate-800 font-bold">{clips.length}</strong>
          </span>

          <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setZoomLevel(Math.max(15, zoomLevel - 5))}
              className="p-1 text-slate-400 hover:text-slate-700"
              title="تصغير الخط الزمني"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <input
              type="range"
              min="15"
              max="70"
              value={zoomLevel}
              onChange={(e) => setZoomLevel(Number(e.target.value))}
              className="w-16 h-1 accent-sky-500 cursor-pointer"
            />
            <button
              onClick={() => setZoomLevel(Math.min(80, zoomLevel + 5))}
              className="p-1 text-slate-400 hover:text-slate-700"
              title="تكبير الخط الزمني"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tracks Container */}
      <div
        ref={timelineContainerRef}
        onMouseDown={handleMouseDownScrub}
        onMouseMove={handleMouseMove}
        className="flex-1 overflow-x-auto overflow-y-hidden relative bg-slate-100/70 cursor-crosshair custom-scrollbar"
        style={{ minHeight: '170px' }}
      >
        <div
          className="relative h-full"
          style={{ width: `${Math.max(800, (totalDuration + 4) * zoomLevel)}px` }}
        >
          {/* Time Ruler */}
          <div className="h-6 bg-slate-200/80 border-b border-slate-300 relative select-none">
            {rulerMarks.map((sec) => (
              <div
                key={sec}
                className="absolute top-0 flex flex-col items-center pointer-events-none"
                style={{ left: `${sec * zoomLevel}px` }}
              >
                <span className="text-[10px] text-slate-600 font-mono pl-1">
                  {formatTime(sec)}
                </span>
                <div className="h-2 w-px bg-slate-400 mt-0.5"></div>
              </div>
            ))}
          </div>

          {/* Draggable Playhead Line */}
          <div
            className="absolute top-0 bottom-0 z-30 pointer-events-none transition-all duration-75 flex flex-col items-center"
            style={{ left: `${currentTime * zoomLevel}px` }}
          >
            <div className="w-3 h-3 bg-sky-500 rotate-45 -mt-1 shadow-sm"></div>
            <div className="w-[2px] bg-sky-500 h-full shadow-sm"></div>
          </div>

          {/* TRACK 1: Text & Badges Track */}
          <div className="h-9 border-b border-slate-200 bg-white/60 relative px-2 flex items-center">
            <div className="absolute left-2 top-1.5 z-10 flex items-center gap-1 text-[10px] text-sky-600 font-bold bg-white/90 px-1.5 py-0.5 rounded border border-slate-200 pointer-events-none">
              <Type className="w-3 h-3" />
              <span>النصوص</span>
            </div>

            {textOverlays.map((overlay) => {
              const left = overlay.startTime * zoomLevel;
              const width = Math.max(40, (overlay.endTime - overlay.startTime) * zoomLevel);
              const isSelected = selectedOverlayId === overlay.id;

              return (
                <div
                  key={overlay.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectOverlay(overlay.id);
                    onSelectClip(null);
                  }}
                  style={{ left: `${left}px`, width: `${width}px` }}
                  className={`absolute top-1 bottom-1 rounded-md px-2 flex items-center justify-between text-xs font-semibold truncate cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-sky-500 text-white border-sky-600 shadow-sm ring-1 ring-sky-400'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                  title={`${overlay.text} (${overlay.startTime}s - ${overlay.endTime}s)`}
                >
                  <span className="truncate flex items-center gap-1">
                    {overlay.badgeIcon && <span>{overlay.badgeIcon}</span>}
                    <span>{overlay.text}</span>
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteOverlay(overlay.id);
                    }}
                    className={`p-0.5 text-xs ${isSelected ? 'text-white/80 hover:text-white' : 'text-slate-400 hover:text-rose-500'}`}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>

          {/* TRACK 2: Video Clips Track */}
          <div className="h-24 border-b border-slate-200 bg-white relative p-1 flex items-center">
            <div className="absolute left-2 top-2 z-10 flex items-center gap-1 text-[10px] text-slate-500 font-bold bg-white/90 px-1.5 py-0.5 rounded border border-slate-200 pointer-events-none">
              <Film className="w-3 h-3" />
              <span>الفيديو</span>
            </div>

            {clipPositions.map((clip) => {
              const left = clip.timelineStart * zoomLevel;
              const width = clip.timelineDuration * zoomLevel;
              const isSelected = selectedClipId === clip.id;

              return (
                <div
                  key={clip.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectClip(clip.id);
                    onSelectOverlay(null);
                  }}
                  style={{ left: `${left}px`, width: `${Math.max(30, width)}px` }}
                  className={`absolute top-1.5 bottom-1.5 rounded-xl overflow-hidden flex flex-col justify-between p-2 cursor-pointer transition-all select-none border-2 group ${
                    isSelected
                      ? 'bg-sky-50 border-sky-500 shadow-sm ring-2 ring-sky-500/20'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {/* Clip Header Info */}
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 truncate z-10">
                    <span className="truncate flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-sky-500' : 'bg-slate-400'}`}></span>
                      <span className="truncate">{clip.name}</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 bg-white/80 border border-slate-200 px-1 py-0.2 rounded">
                      {clip.timelineDuration.toFixed(1)}s
                    </span>
                  </div>

                  {/* Clip Footer */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 z-10">
                    <span className="text-sky-600 font-medium">
                      {clip.filter !== 'none' ? `✨ ${clip.filter}` : 'أصلي'}
                    </span>
                    {clip.speed !== 1 && (
                      <span className="bg-white border border-slate-200 text-slate-700 px-1 rounded font-mono font-bold">
                        {clip.speed}x
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* TRACK 3: Audio Track */}
          <div className="h-9 bg-slate-50/80 relative px-2 flex items-center">
            <div className="absolute left-2 top-1.5 z-10 flex items-center gap-1 text-[10px] text-slate-500 font-bold bg-white/90 px-1.5 py-0.5 rounded border border-slate-200 pointer-events-none">
              <Music className="w-3 h-3 text-sky-500" />
              <span>الصوت</span>
            </div>

            {audioTracks.map((audio) => {
              const left = audio.startTime * zoomLevel;
              const width = Math.max(60, audio.duration * zoomLevel);

              return (
                <div
                  key={audio.id}
                  style={{ left: `${left}px`, width: `${width}px` }}
                  className="absolute top-1 bottom-1 bg-sky-50 border border-sky-200 rounded-md px-2 flex items-center justify-between text-xs text-sky-800 font-medium"
                >
                  <span className="truncate flex items-center gap-1">
                    <Volume2 className="w-3 h-3 text-sky-500" />
                    <span>{audio.name}</span>
                  </span>
                  <span className="text-[10px] font-mono text-sky-600">
                    {audio.duration}s
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

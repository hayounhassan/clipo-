import React, { useRef, useEffect, useState, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Eye, 
  EyeOff, 
  Clock, 
  Smartphone, 
  ChevronLeft, 
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { AspectRatio, VideoClip, TextOverlay, AudioTrack } from '../types';

interface VideoPlayerProps {
  aspectRatio: AspectRatio;
  clips: VideoClip[];
  textOverlays: TextOverlay[];
  audioTracks: AudioTrack[];
  currentTime: number;
  isPlaying: boolean;
  onTimeUpdate: (time: number) => void;
  onTogglePlay: () => void;
  onSelectOverlay?: (overlayId: string) => void;
  selectedOverlayId?: string | null;
  onUpdateOverlayPosition?: (id: string, x: number, y: number) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  aspectRatio,
  clips,
  textOverlays,
  audioTracks,
  currentTime,
  isPlaying,
  onTimeUpdate,
  onTogglePlay,
  onSelectOverlay,
  selectedOverlayId,
  onUpdateOverlayPosition,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  
  const [isMuted, setIsMuted] = useState(false);
  const [showSafeZones, setShowSafeZones] = useState(true);
  const [isDraggingOverlay, setIsDraggingOverlay] = useState<string | null>(null);

  // Total timeline duration
  const totalDuration = useMemo(() => {
    if (clips.length === 0) return 0;
    return clips.reduce((sum, c) => sum + ((c.clipEnd - c.clipStart) / (c.speed || 1)), 0);
  }, [clips]);

  // Find active clip at currentTime
  const activeClipInfo = useMemo(() => {
    if (clips.length === 0) return null;
    let accumulatedTime = 0;

    for (let i = 0; i < clips.length; i++) {
      const clip = clips[i];
      const clipDuration = (clip.clipEnd - clip.clipStart) / (clip.speed || 1);
      
      if (currentTime >= accumulatedTime && currentTime <= accumulatedTime + clipDuration) {
        const relativeTimelineOffset = currentTime - accumulatedTime;
        const sourceTime = clip.clipStart + relativeTimelineOffset * (clip.speed || 1);
        return {
          clip,
          index: i,
          sourceTime: Math.min(sourceTime, clip.clipEnd),
          clipDuration,
          accumulatedTime,
        };
      }
      accumulatedTime += clipDuration;
    }

    const lastClip = clips[clips.length - 1];
    return {
      clip: lastClip,
      index: clips.length - 1,
      sourceTime: lastClip.clipEnd,
      clipDuration: (lastClip.clipEnd - lastClip.clipStart) / (lastClip.speed || 1),
      accumulatedTime: totalDuration - ((lastClip.clipEnd - lastClip.clipStart) / (lastClip.speed || 1)),
    };
  }, [clips, currentTime, totalDuration]);

  // Sync video source, volume, playback speed and seek time
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !activeClipInfo) return;

    const { clip, sourceTime } = activeClipInfo;

    if (video.src !== clip.url) {
      video.src = clip.url;
      video.load();
    }

    video.playbackRate = clip.speed || 1;
    video.volume = isMuted ? 0 : (clip.volume ?? 1);

    if (Math.abs(video.currentTime - sourceTime) > 0.25) {
      video.currentTime = sourceTime;
    }

    if (isPlaying) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } else {
      video.pause();
    }
  }, [activeClipInfo?.clip.url, activeClipInfo?.clip.id, isPlaying, isMuted]);

  // Animation frame loop for smooth playback scrubbing
  useEffect(() => {
    let animationFrameId: number;
    let lastTimestamp = performance.now();

    const updatePlayhead = (now: number) => {
      if (isPlaying && totalDuration > 0) {
        const delta = (now - lastTimestamp) / 1000;
        lastTimestamp = now;

        const nextTime = currentTime + delta;
        if (nextTime >= totalDuration) {
          onTimeUpdate(0);
        } else {
          onTimeUpdate(nextTime);
        }
      } else {
        lastTimestamp = now;
      }
      animationFrameId = requestAnimationFrame(updatePlayhead);
    };

    animationFrameId = requestAnimationFrame(updatePlayhead);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, currentTime, totalDuration, onTimeUpdate]);

  // Audio track synchronization
  const activeAudio = audioTracks[0] || null;
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !activeAudio) return;

    if (audio.src !== activeAudio.url) {
      audio.src = activeAudio.url;
    }
    audio.volume = isMuted ? 0 : (activeAudio.volume ?? 0.7);

    if (isPlaying && currentTime >= activeAudio.startTime && currentTime <= activeAudio.startTime + activeAudio.duration) {
      audio.currentTime = (currentTime - activeAudio.startTime) % activeAudio.duration;
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTime, activeAudio, isMuted]);

  // Filter styles
  const getFilterStyle = (clip?: VideoClip) => {
    if (!clip) return {};
    let filterString = '';

    switch (clip.filter) {
      case 'luxury_gold':
        filterString += 'sepia(0.25) saturate(1.3) brightness(1.05) contrast(1.08) ';
        break;
      case 'real_estate_glow':
        filterString += 'brightness(1.15) contrast(1.06) saturate(1.2) ';
        break;
      case 'vibrant_ugc':
        filterString += 'saturate(1.45) contrast(1.12) brightness(1.03) ';
        break;
      case 'warm_sun':
        filterString += 'sepia(0.35) saturate(1.2) brightness(1.02) ';
        break;
      case 'cinema':
        filterString += 'contrast(1.25) brightness(0.96) saturate(1.1) ';
        break;
      case 'noir':
        filterString += 'grayscale(1) contrast(1.25) ';
        break;
      default:
        break;
    }

    const b = (clip.brightness ?? 100) / 100;
    const c = (clip.contrast ?? 100) / 100;
    const s = (clip.saturation ?? 100) / 100;

    filterString += `brightness(${b}) contrast(${c}) saturate(${s})`;

    return { filter: filterString.trim() };
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
  };

  const handleOverlayMouseDown = (e: React.MouseEvent, overlayId: string) => {
    e.stopPropagation();
    setIsDraggingOverlay(overlayId);
    onSelectOverlay?.(overlayId);
  };

  const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingOverlay || !playerContainerRef.current || !onUpdateOverlayPosition) return;
    const rect = playerContainerRef.current.getBoundingClientRect();
    const x = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100));
    onUpdateOverlayPosition(isDraggingOverlay, Math.round(x), Math.round(y));
  };

  const handleContainerMouseUp = () => {
    setIsDraggingOverlay(null);
  };

  // Aspect ratio class with generous preview scaling
  const aspectClass = useMemo(() => {
    switch (aspectRatio) {
      case '9:16':
        return 'aspect-[9/16] w-[280px] sm:w-[320px] md:w-[350px] lg:w-[370px] max-h-[580px]';
      case '16:9':
        return 'aspect-[16/9] w-full max-w-[720px] max-h-[440px]';
      case '1:1':
        return 'aspect-square w-[340px] sm:w-[420px] max-h-[460px]';
      case '4:5':
        return 'aspect-[4/5] w-[320px] sm:w-[380px] max-h-[510px]';
      default:
        return 'aspect-[9/16] w-[340px] max-h-[560px]';
    }
  }, [aspectRatio]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full bg-slate-50 p-4 select-none relative overflow-hidden">
      {/* Centered InShot Canvas Frame */}
      <div className="relative flex items-center justify-center w-full my-auto">
        <div
          ref={playerContainerRef}
          onMouseMove={handleContainerMouseMove}
          onMouseUp={handleContainerMouseUp}
          className={`relative ${aspectClass} bg-black rounded-2xl overflow-hidden shadow-xl border border-slate-300 transition-all duration-300 flex items-center justify-center`}
        >
          {/* Active Clip Video */}
          {activeClipInfo ? (
            <video
              ref={videoRef}
              src={activeClipInfo.clip.url}
              playsInline
              muted={isMuted}
              style={getFilterStyle(activeClipInfo.clip)}
              className="w-full h-full object-cover pointer-events-none"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6 text-slate-400 gap-3">
              <Smartphone className="w-12 h-12 text-slate-600 stroke-[1.5]" />
              <div>
                <p className="text-sm font-semibold text-slate-200">لا يوجد مقطع في الخط الزمني</p>
                <p className="text-xs text-slate-400 mt-1">اختر من الوسائط لإضافة مقاطع</p>
              </div>
            </div>
          )}

          {/* Background Audio */}
          <audio ref={audioRef} />

          {/* Text Overlays & Badges */}
          <div className="absolute inset-0 pointer-events-auto">
            {textOverlays
              .filter((ov) => currentTime >= ov.startTime && currentTime <= ov.endTime)
              .map((ov) => {
                const isSelected = selectedOverlayId === ov.id;
                return (
                  <div
                    key={ov.id}
                    onMouseDown={(e) => handleOverlayMouseDown(e, ov.id)}
                    style={{
                      left: `${ov.x}%`,
                      top: `${ov.y}%`,
                      transform: 'translate(-50%, -50%)',
                      fontSize: `${ov.fontSize}px`,
                      color: ov.color,
                      fontFamily: ov.fontFamily || 'inherit',
                    }}
                    className={`absolute cursor-move select-none transition-transform active:scale-95 ${
                      isSelected ? 'ring-2 ring-sky-400 ring-offset-2 ring-offset-black/60 rounded-xl' : ''
                    }`}
                  >
                    {/* Render style variants */}
                    {ov.style === 'price_tag' && (
                      <div className="bg-slate-950/95 border border-sky-400 text-sky-300 font-extrabold px-3 py-1.5 rounded-xl shadow-lg backdrop-blur-sm flex items-center gap-2">
                        {ov.badgeIcon && <span className="text-base">{ov.badgeIcon}</span>}
                        <div>
                          <div className="leading-tight font-black">{ov.text}</div>
                          {ov.subtitle && (
                            <div className="text-[10px] text-slate-300 font-medium">{ov.subtitle}</div>
                          )}
                        </div>
                      </div>
                    )}

                    {ov.style === 'real_estate_badge' && (
                      <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white font-bold px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-2">
                        {ov.badgeIcon && <span className="text-base">{ov.badgeIcon}</span>}
                        <div>
                          <div className="text-xs sm:text-sm leading-tight text-white">{ov.text}</div>
                          {ov.subtitle && (
                            <div className="text-[10px] text-sky-100 font-normal">{ov.subtitle}</div>
                          )}
                        </div>
                      </div>
                    )}

                    {ov.style === 'call_to_action' && (
                      <div className="bg-sky-500 hover:bg-sky-600 text-white font-black px-4 py-2 rounded-full shadow-xl flex items-center gap-2">
                        {ov.badgeIcon && <span>{ov.badgeIcon}</span>}
                        <span className="text-xs sm:text-sm tracking-wide">{ov.text}</span>
                      </div>
                    )}

                    {ov.style === 'location_pill' && (
                      <div className="bg-slate-900/90 border border-slate-700 text-white px-3 py-1 rounded-lg text-xs font-semibold shadow-md flex items-center gap-1.5">
                        {ov.badgeIcon && <span>{ov.badgeIcon}</span>}
                        <span>{ov.text}</span>
                      </div>
                    )}

                    {ov.style === 'ugc_caption' && (
                      <div className="bg-white text-slate-900 font-black px-3 py-1 rounded-lg shadow-xl text-center leading-snug border border-slate-200">
                        <span>{ov.text}</span>
                        {ov.subtitle && (
                          <div className="text-[11px] font-semibold text-slate-600 mt-0.5">{ov.subtitle}</div>
                        )}
                      </div>
                    )}

                    {ov.style === 'clean' && (
                      <div className="text-white font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] text-center px-2 py-0.5">
                        {ov.text}
                      </div>
                    )}

                    {ov.style === 'headline' && (
                      <div className="bg-slate-900/90 text-white font-black text-center px-3 py-1 rounded-md border-b-2 border-sky-400">
                        {ov.text}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>

          {/* TikTok / Reels Safe Zones Overlay */}
          {showSafeZones && aspectRatio === '9:16' && (
            <div className="absolute inset-0 pointer-events-none border-2 border-dashed border-sky-400/30 m-2 rounded-xl flex flex-col justify-between p-3 text-[10px] text-sky-400/80 font-mono">
              <div className="flex justify-between items-center bg-black/40 px-2 py-0.5 rounded backdrop-blur-[2px]">
                <span>🔝 منطقة الرأس الآمنة</span>
                <span>TikTok / Reels</span>
              </div>
              <div className="flex justify-between items-end">
                <div className="bg-black/40 px-2 py-0.5 rounded text-left backdrop-blur-[2px]">
                  <span>📝 منطقة التسميات والتفاعل</span>
                </div>
                <div className="flex flex-col gap-1 items-center bg-black/40 p-1 rounded backdrop-blur-[2px]">
                  <span>❤️</span>
                  <span>💬</span>
                  <span>↗️</span>
                </div>
              </div>
            </div>
          )}

          {/* Direct Click to Play/Pause */}
          <button
            onClick={onTogglePlay}
            className="absolute inset-0 w-full h-full bg-transparent flex items-center justify-center group focus:outline-none"
            aria-label={isPlaying ? 'إيقاف الفيديو' : 'تشغيل الفيديو'}
          >
            {!isPlaying && (
              <div className="w-14 h-14 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform">
                <Play className="w-6 h-6 fill-white ml-0.5" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Clean InShot-style Bottom Playback Bar */}
      <div className="w-full max-w-[420px] bg-white border border-slate-200/90 rounded-2xl px-4 py-2 flex items-center justify-between gap-3 shadow-sm mt-3">
        {/* Play / Step Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onTimeUpdate(Math.max(0, currentTime - 1))}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            title="رجوع ثانية واحدة (-1s)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={onTogglePlay}
            className="w-9 h-9 rounded-full bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center transition active:scale-95 shadow-sm shadow-sky-500/25"
            title={isPlaying ? 'إيقاف مؤقت (Space)' : 'تشغيل (Space)'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-white" />
            ) : (
              <Play className="w-4 h-4 fill-white ml-0.5" />
            )}
          </button>

          <button
            onClick={() => onTimeUpdate(Math.min(totalDuration, currentTime + 1))}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            title="تقديم ثانية واحدة (+1s)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Timecode display */}
        <div className="flex items-center gap-1.5 text-xs font-mono font-semibold bg-slate-50 px-3 py-1 rounded-lg border border-slate-200 text-slate-700">
          <Clock className="w-3.5 h-3.5 text-sky-500" />
          <span>{formatTime(currentTime)}</span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-500">{formatTime(totalDuration)}</span>
        </div>

        {/* Mute and Safe Zones */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-1.5 rounded-lg transition ${
              isMuted ? 'text-rose-500 bg-rose-50' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
            title={isMuted ? 'إلغاء كتم الصوت' : 'كتم الصوت'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {aspectRatio === '9:16' && (
            <button
              onClick={() => setShowSafeZones(!showSafeZones)}
              className={`p-1.5 rounded-lg transition ${
                showSafeZones ? 'text-sky-600 bg-sky-50' : 'text-slate-400 hover:text-slate-600'
              }`}
              title="دليل المناطق الآمنة لـ TikTok/Reels"
            >
              {showSafeZones ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

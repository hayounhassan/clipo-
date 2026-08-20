import React, { useState, useRef } from 'react';
import { 
  X, 
  Download, 
  Film, 
  CheckCircle2, 
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProjectState } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectState;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const [resolution, setResolution] = useState<'1080p' | '720p'>('1080p');
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [exportedUrl, setExportedUrl] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculate total timeline duration
  const totalDuration = project.clips.reduce(
    (sum, c) => sum + ((c.clipEnd - c.clipStart) / (c.speed || 1)),
    0
  );

  const startExport = async () => {
    if (project.clips.length === 0) {
      setExportError('لا توجد مقاطع في المشروع لتصديرها');
      return;
    }

    setIsExporting(true);
    setProgress(0);
    setExportedUrl(null);
    setExportError(null);

    // Canvas dimensions based on aspect ratio
    let width = 1080;
    let height = 1920;

    if (project.aspectRatio === '16:9') {
      width = 1920;
      height = 1080;
    } else if (project.aspectRatio === '1:1') {
      width = 1080;
      height = 1080;
    } else if (project.aspectRatio === '4:5') {
      width = 1080;
      height = 1350;
    }

    if (resolution === '720p') {
      width = Math.round(width * 0.666);
      height = Math.round(height * 0.666);
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setExportError('تعذر إنشاء محرك معالجة الفيديو في المتصفح');
      setIsExporting(false);
      return;
    }

    try {
      // Setup MediaRecorder from Canvas stream
      const stream = canvas.captureStream(30); // 30 FPS
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : MediaRecorder.isTypeSupported('video/webm')
        ? 'video/webm'
        : 'video/mp4';

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 6000000,
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setExportedUrl(url);
        setIsExporting(false);
        setProgress(100);

        // Celebration confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0284C7', '#10B981', '#38BDF8', '#F59E0B'],
        });
      };

      mediaRecorder.start();

      // Create video element to step through frames
      const tempVideo = document.createElement('video');
      tempVideo.crossOrigin = 'anonymous';
      tempVideo.muted = true;
      tempVideo.playsInline = true;

      const fps = 30;
      const totalFrames = Math.max(30, Math.round(totalDuration * fps));
      let currentFrame = 0;

      // Sequential frame renderer
      const renderNextFrame = async () => {
        if (currentFrame > totalFrames) {
          mediaRecorder.stop();
          return;
        }

        const currentTime = (currentFrame / totalFrames) * totalDuration;
        setProgress(Math.min(99, Math.round((currentFrame / totalFrames) * 100)));

        // Find active clip at currentTime
        let accTime = 0;
        let activeClip = project.clips[0];
        let relativeTimeInClip = 0;

        for (const clip of project.clips) {
          const dur = (clip.clipEnd - clip.clipStart) / (clip.speed || 1);
          if (currentTime >= accTime && currentTime <= accTime + dur) {
            activeClip = clip;
            relativeTimeInClip = clip.clipStart + (currentTime - accTime) * (clip.speed || 1);
            break;
          }
          accTime += dur;
        }

        // Draw background
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        // If active clip source loaded, draw video frame
        if (tempVideo.src !== activeClip.url) {
          tempVideo.src = activeClip.url;
          await new Promise<void>((resolve) => {
            tempVideo.onloadeddata = () => resolve();
            tempVideo.onerror = () => resolve();
            setTimeout(resolve, 500);
          });
        }

        tempVideo.currentTime = Math.min(activeClip.clipEnd, Math.max(activeClip.clipStart, relativeTimeInClip));

        // Wait for seek to complete
        await new Promise((resolve) => setTimeout(resolve, 15));

        // Draw video frame scaling to cover canvas
        try {
          if (tempVideo.readyState >= 2) {
            ctx.save();
            if (activeClip.filter === 'luxury_gold') {
              ctx.filter = 'sepia(0.2) saturate(1.3) brightness(1.05)';
            } else if (activeClip.filter === 'real_estate_glow') {
              ctx.filter = 'brightness(1.15) contrast(1.05) saturate(1.2)';
            } else if (activeClip.filter === 'vibrant_ugc') {
              ctx.filter = 'saturate(1.4) contrast(1.1)';
            } else if (activeClip.filter === 'cinema') {
              ctx.filter = 'contrast(1.2) saturate(1.1)';
            } else if (activeClip.filter === 'noir') {
              ctx.filter = 'grayscale(1) contrast(1.2)';
            }

            const hRatio = width / tempVideo.videoWidth || 1;
            const vRatio = height / tempVideo.videoHeight || 1;
            const ratio = Math.max(hRatio, vRatio);
            const centerShift_x = (width - tempVideo.videoWidth * ratio) / 2;
            const centerShift_y = (height - tempVideo.videoHeight * ratio) / 2;

            ctx.drawImage(
              tempVideo,
              0,
              0,
              tempVideo.videoWidth,
              tempVideo.videoHeight,
              centerShift_x,
              centerShift_y,
              tempVideo.videoWidth * ratio,
              tempVideo.videoHeight * ratio
            );
            ctx.restore();
          }
        } catch {
          // Cross-origin fallback
        }

        // Draw active Text Overlays and Badges
        project.textOverlays
          .filter((ov) => currentTime >= ov.startTime && currentTime <= ov.endTime)
          .forEach((ov) => {
            const posX = (ov.x / 100) * width;
            const posY = (ov.y / 100) * height;
            const scaledFontSize = Math.round(ov.fontSize * (width / 360));

            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            if (ov.style === 'price_tag') {
              ctx.font = `bold ${scaledFontSize}px sans-serif`;
              const textWidth = ctx.measureText(ov.text).width + 60;
              const boxHeight = scaledFontSize * 2.2;

              ctx.fillStyle = 'rgba(24, 24, 27, 0.92)';
              ctx.strokeStyle = '#38BDF8';
              ctx.lineWidth = 4;
              ctx.beginPath();
              ctx.roundRect(posX - textWidth / 2, posY - boxHeight / 2, textWidth, boxHeight, 20);
              ctx.fill();
              ctx.stroke();

              ctx.fillStyle = '#38BDF8';
              ctx.fillText(ov.text, posX, posY - (ov.subtitle ? scaledFontSize * 0.25 : 0));

              if (ov.subtitle) {
                ctx.font = `normal ${Math.round(scaledFontSize * 0.5)}px sans-serif`;
                ctx.fillStyle = '#E4E4E7';
                ctx.fillText(ov.subtitle, posX, posY + scaledFontSize * 0.5);
              }
            } else if (ov.style === 'real_estate_badge') {
              ctx.font = `bold ${scaledFontSize}px sans-serif`;
              const textWidth = ctx.measureText(ov.text).width + 50;
              const boxHeight = scaledFontSize * 2;

              ctx.fillStyle = 'rgba(2, 132, 199, 0.95)';
              ctx.beginPath();
              ctx.roundRect(posX - textWidth / 2, posY - boxHeight / 2, textWidth, boxHeight, 18);
              ctx.fill();

              ctx.fillStyle = '#FFFFFF';
              ctx.fillText(ov.text, posX, posY - (ov.subtitle ? scaledFontSize * 0.2 : 0));
            } else if (ov.style === 'ugc_caption') {
              ctx.font = `900 ${scaledFontSize}px sans-serif`;
              const textWidth = ctx.measureText(ov.text).width + 40;
              const boxHeight = scaledFontSize * 1.8;

              ctx.fillStyle = '#FFFFFF';
              ctx.beginPath();
              ctx.roundRect(posX - textWidth / 2, posY - boxHeight / 2, textWidth, boxHeight, 12);
              ctx.fill();

              ctx.fillStyle = '#0F172A';
              ctx.fillText(ov.text, posX, posY);
            } else if (ov.style === 'call_to_action') {
              ctx.font = `bold ${scaledFontSize}px sans-serif`;
              const textWidth = ctx.measureText(ov.text).width + 60;
              const boxHeight = scaledFontSize * 2;

              ctx.fillStyle = '#0284C7';
              ctx.beginPath();
              ctx.roundRect(posX - textWidth / 2, posY - boxHeight / 2, textWidth, boxHeight, 30);
              ctx.fill();

              ctx.fillStyle = '#FFFFFF';
              ctx.fillText(ov.text, posX, posY);
            } else {
              ctx.font = `bold ${scaledFontSize}px sans-serif`;
              ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
              ctx.shadowBlur = 10;
              ctx.fillStyle = ov.color || '#FFFFFF';
              ctx.fillText(ov.text, posX, posY);
            }

            ctx.restore();
          });

        currentFrame++;
        requestAnimationFrame(renderNextFrame);
      };

      renderNextFrame();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setExportError(`حدث خطأ أثناء التصدير: ${errorMsg}`);
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200 text-slate-800">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">تصدير وتحميل الفيديو</h3>
              <p className="text-[11px] text-slate-500">
                دمج المقاطع، النصوص، والملصقات بجودة عالية
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Summary Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex justify-between items-center text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">اسم المشروع:</span>
              <strong className="text-slate-800 text-sm">{project.name}</strong>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block text-[11px]">المدة الإجمالية:</span>
              <span className="font-mono text-sky-600 font-bold">{totalDuration.toFixed(1)} ثانية</span>
            </div>
          </div>

          {/* Resolution Options */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">
              دقة الفيديو:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setResolution('1080p')}
                disabled={isExporting}
                className={`p-3 rounded-xl border text-right transition ${
                  resolution === '1080p'
                    ? 'bg-sky-50 border-sky-400 text-sky-900 ring-1 ring-sky-400'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-bold">Full HD (1080p)</div>
                <div className="text-[10px] text-slate-500 mt-0.5">أعلى جودة لـ TikTok و Reels</div>
              </button>

              <button
                onClick={() => setResolution('720p')}
                disabled={isExporting}
                className={`p-3 rounded-xl border text-right transition ${
                  resolution === '720p'
                    ? 'bg-sky-50 border-sky-400 text-sky-900 ring-1 ring-sky-400'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-bold">Fast HD (720p)</div>
                <div className="text-[10px] text-slate-500 mt-0.5">تصدير سريع وحجم ملف أصغر</div>
              </button>
            </div>
          </div>

          {/* Progress or Status */}
          {isExporting && (
            <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5 text-sky-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري معالجة وتصدير الفيديو...</span>
                </span>
                <span className="font-mono">{progress}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-sky-500 h-full transition-all duration-150 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-500 text-center">
                يرجى عدم إغلاق النافذة أثناء معالجة الإطارات
              </p>
            </div>
          )}

          {exportError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs">
              {exportError}
            </div>
          )}

          {exportedUrl && (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-800">اكتمل التصدير بنجاح!</h4>
                <p className="text-[11px] text-emerald-600 mt-0.5">
                  الفيديو جاهز للنشر على Instagram Reels و TikTok
                </p>
              </div>

              <a
                href={exportedUrl}
                download={`${project.name || 'reels-video'}.webm`}
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-xs transition shadow-sm"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>تحميل ملف الفيديو (Download)</span>
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition"
          >
            إلغاء
          </button>

          {!exportedUrl && (
            <button
              onClick={startExport}
              disabled={isExporting || project.clips.length === 0}
              className="flex items-center gap-1.5 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-xs font-bold transition shadow-sm shadow-sky-500/20 active:scale-95"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>{isExporting ? 'جاري التصدير...' : 'بدء تصدير الفيديو'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useRef, useState } from 'react';
import { 
  UploadCloud, 
  ArrowUpCircle,
  FileVideo,
  Image as ImageIcon,
  Music,
  Check
} from 'lucide-react';
import { VideoClip, AudioTrack } from '../types';

interface MediaLibraryProps {
  onAddVideoClip: (clip: VideoClip) => void;
  onAddAudioTrack: (audio: AudioTrack) => void;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({
  onAddVideoClip,
  onAddAudioTrack,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [lastUploadedName, setLastUploadedName] = useState<string | null>(null);

  const processFile = (file: File) => {
    setIsUploading(true);
    const objectUrl = URL.createObjectURL(file);
    const fileName = file.name.replace(/\.[^/.]+$/, '');

    if (file.type.startsWith('video/')) {
      const tempVideo = document.createElement('video');
      tempVideo.src = objectUrl;
      tempVideo.onloadedmetadata = () => {
        const duration = Math.max(2, Math.round(tempVideo.duration || 10));
        const newClip: VideoClip = {
          id: `clip-${Date.now()}`,
          name: fileName,
          url: objectUrl,
          duration: duration,
          startTime: 0,
          clipStart: 0,
          clipEnd: duration,
          volume: 1,
          speed: 1,
          filter: 'none',
          brightness: 100,
          contrast: 100,
          saturation: 100,
        };
        onAddVideoClip(newClip);
        setIsUploading(false);
        setLastUploadedName(file.name);
        setTimeout(() => setLastUploadedName(null), 3000);
      };
      tempVideo.onerror = () => {
        const newClip: VideoClip = {
          id: `clip-${Date.now()}`,
          name: fileName,
          url: objectUrl,
          duration: 15,
          startTime: 0,
          clipStart: 0,
          clipEnd: 15,
          volume: 1,
          speed: 1,
          filter: 'none',
          brightness: 100,
          contrast: 100,
          saturation: 100,
        };
        onAddVideoClip(newClip);
        setIsUploading(false);
        setLastUploadedName(file.name);
        setTimeout(() => setLastUploadedName(null), 3000);
      };
    } else if (file.type.startsWith('image/')) {
      // Create a 5-second image clip for video timeline
      const newClip: VideoClip = {
        id: `clip-img-${Date.now()}`,
        name: `${fileName} (صورة)`,
        url: objectUrl,
        thumbnail: objectUrl,
        duration: 5,
        startTime: 0,
        clipStart: 0,
        clipEnd: 5,
        volume: 1,
        speed: 1,
        filter: 'none',
        brightness: 100,
        contrast: 100,
        saturation: 100,
      };
      onAddVideoClip(newClip);
      setIsUploading(false);
      setLastUploadedName(file.name);
      setTimeout(() => setLastUploadedName(null), 3000);
    } else if (file.type.startsWith('audio/')) {
      const newAudio: AudioTrack = {
        id: `audio-${Date.now()}`,
        name: fileName,
        url: objectUrl,
        duration: 30,
        startTime: 0,
        volume: 0.7,
      };
      onAddAudioTrack(newAudio);
      setIsUploading(false);
      setLastUploadedName(file.name);
      setTimeout(() => setLastUploadedName(null), 3000);
    } else {
      setIsUploading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      processFile(files[i]);
    }
    // reset input so same file can be re-uploaded if desired
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        processFile(e.dataTransfer.files[i]);
      }
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar p-5 space-y-6 text-slate-800 select-none bg-white">
      {/* Modern Upload Video & Image Container - Clean, Prominent Floating Square */}
      <div className="w-full flex flex-col items-center justify-center pt-2">
        <div
          id="modern-upload-container"
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`w-full aspect-square max-w-[300px] sm:max-w-[320px] rounded-3xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-3.5 group relative select-none
            ${
              isDragging
                ? 'bg-sky-50 border-2 border-dashed border-sky-500 scale-[1.02] shadow-lg shadow-sky-500/15'
                : 'bg-[#F8FAFC] hover:bg-sky-50/40 border-2 border-dashed border-sky-300 hover:border-sky-500 shadow-md hover:shadow-xl hover:shadow-sky-500/10'
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="video/*,image/*,audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Cloud with Arrow Icon */}
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-sky-100/90 text-sky-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300 shadow-sm border border-sky-200/60">
              <UploadCloud className="w-10 h-10 stroke-[2.2]" />
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-white text-sky-600 shadow-xs flex items-center justify-center border border-sky-100 group-hover:scale-110 transition-transform">
              <ArrowUpCircle className="w-4 h-4 fill-sky-500 text-white" />
            </div>
          </div>

          {/* Texts */}
          <div className="space-y-1 px-2">
            <p className="text-sm sm:text-base font-black text-slate-800 group-hover:text-sky-600 transition-colors leading-snug">
              {isUploading
                ? 'جاري قراءة ورفع الملف...'
                : isDragging
                ? 'أفلت الملفات هنا للرفع الفوري'
                : 'ارفع مقطع فيديو أو صورة من جهازك'}
            </p>
            <p className="text-xs text-slate-500 font-medium tracking-tight">
              يدعم MP4, WEBM, MOV, MP3 والصور بجميع أنواعها
            </p>
          </div>

          {/* Click to browse badge */}
          <div className="mt-1 px-4 py-1.5 rounded-full bg-sky-500/10 group-hover:bg-sky-500 text-sky-700 group-hover:text-white text-xs font-bold transition-colors border border-sky-300/40">
            تصفح الملفات أو اسحب وأفلت هنا
          </div>
        </div>

        {/* Upload success toast */}
        {lastUploadedName && (
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold animate-in fade-in duration-200 shadow-2xs">
            <Check className="w-4 h-4 text-emerald-600" />
            <span className="truncate max-w-[240px]">تمت إضافة {lastUploadedName} للخط الزمني</span>
          </div>
        )}
      </div>

      {/* Supported Media Features Card */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
          أنواع الملفات المدعومة
        </span>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 flex flex-col items-center justify-center text-center gap-1.5">
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
              <FileVideo className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-slate-700">فيديو</span>
            <span className="text-[9px] text-slate-400 font-mono">MP4, WEBM</span>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 flex flex-col items-center justify-center text-center gap-1.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-slate-700">صور</span>
            <span className="text-[9px] text-slate-400 font-mono">JPG, PNG, WEBP</span>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 flex flex-col items-center justify-center text-center gap-1.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Music className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-slate-700">صوتيات</span>
            <span className="text-[9px] text-slate-400 font-mono">MP3, WAV, AAC</span>
          </div>
        </div>
      </div>
    </div>
  );
};

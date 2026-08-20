import React, { useRef, useState } from 'react';
import { 
  UploadCloud, 
  Film, 
  Music, 
  Plus, 
  Sparkles, 
  Check,
  ArrowUpCircle
} from 'lucide-react';
import { SAMPLE_VIDEOS, SAMPLE_AUDIO } from '../data/sampleMedia';
import { VideoClip, AudioTrack, SampleMediaItem } from '../types';

interface MediaLibraryProps {
  onAddVideoClip: (clip: VideoClip) => void;
  onAddAudioTrack: (audio: AudioTrack) => void;
}

export const MediaLibrary: React.FC<MediaLibraryProps> = ({
  onAddVideoClip,
  onAddAudioTrack,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const processFile = (file: File) => {
    setIsUploading(true);
    const objectUrl = URL.createObjectURL(file);

    if (file.type.startsWith('video/')) {
      const tempVideo = document.createElement('video');
      tempVideo.src = objectUrl;
      tempVideo.onloadedmetadata = () => {
        const duration = Math.max(2, Math.round(tempVideo.duration || 10));
        const newClip: VideoClip = {
          id: `clip-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, ''),
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
      };
      tempVideo.onerror = () => {
        const newClip: VideoClip = {
          id: `clip-${Date.now()}`,
          name: file.name,
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
      };
    } else if (file.type.startsWith('audio/')) {
      const newAudio: AudioTrack = {
        id: `audio-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        url: objectUrl,
        duration: 30,
        startTime: 0,
        volume: 0.7,
      };
      onAddAudioTrack(newAudio);
      setIsUploading(false);
    } else {
      setIsUploading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    processFile(files[0]);
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
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleAddSampleVideo = (item: SampleMediaItem) => {
    const newClip: VideoClip = {
      id: `sample-${item.id}-${Date.now()}`,
      name: item.title,
      url: item.url,
      thumbnail: item.thumbnail,
      duration: item.duration,
      startTime: 0,
      clipStart: 0,
      clipEnd: item.duration,
      volume: 1,
      speed: 1,
      filter: 'none',
      brightness: 100,
      contrast: 100,
      saturation: 100,
    };
    onAddVideoClip(newClip);
    setRecentlyAddedId(item.id);
    setTimeout(() => setRecentlyAddedId(null), 2000);
  };

  const handleAddSampleAudio = (item: { id: string; name: string; url: string; duration: number }) => {
    const newAudio: AudioTrack = {
      id: `sample-${item.id}-${Date.now()}`,
      name: item.name,
      url: item.url,
      duration: item.duration,
      startTime: 0,
      volume: 0.8,
    };
    onAddAudioTrack(newAudio);
    setRecentlyAddedId(item.id);
    setTimeout(() => setRecentlyAddedId(null), 2000);
  };

  const filteredVideos = SAMPLE_VIDEOS.filter((v) => 
    selectedCategory === 'all' ? true : v.category === selectedCategory
  );

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar p-4 space-y-6 text-slate-800 select-none bg-white">
      {/* Modern Upload Video Container - Large Perfect Floating Square */}
      <div className="w-full flex flex-col items-center">
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
            accept="video/*,audio/*"
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
                ? 'جاري قراءة ورفع المقطع...'
                : isDragging
                ? 'أفلت المقطع هنا للرفع الفوري'
                : 'ارفع مقطع فيديو من جهازك'}
            </p>
            <p className="text-xs text-slate-500 font-medium tracking-tight">
              يدعم MP4, WEBM, MOV, MP3
            </p>
          </div>

          {/* Click to browse badge */}
          <div className="mt-1 px-4 py-1.5 rounded-full bg-sky-500/10 group-hover:bg-sky-500 text-sky-700 group-hover:text-white text-xs font-bold transition-colors border border-sky-300/40">
            تصفح الملفات أو اسحب وأفلت هنا
          </div>
        </div>
      </div>

      {/* Category Pills & Ready Real Estate Videos */}
      <div className="space-y-3 pt-1 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-sky-500" />
            <span>مقاطع جاهزة للعقارات و UGC</span>
          </span>
          <span className="text-[10px] text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full font-bold border border-sky-200">
            جاهز للتجربة
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'real_estate', label: '🏡 فلل فاخرة' },
            { id: 'interior', label: '🛋️ تشطيب مودرن' },
            { id: 'drone', label: '🚁 درون جوي' },
            { id: 'ugc', label: '🗣️ إعلانات UGC' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Video Presets List */}
        <div className="grid grid-cols-1 gap-2.5">
          {filteredVideos.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50 hover:bg-white border border-slate-200 hover:border-sky-300 rounded-2xl overflow-hidden flex gap-3 p-2.5 transition-all shadow-2xs group"
            >
              <div className="relative w-22 h-16 rounded-xl overflow-hidden bg-slate-900 flex-shrink-0 shadow-2xs">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-1 right-1 bg-black/75 backdrop-blur-2xs text-[9px] font-mono text-white px-1.5 py-0.2 rounded font-bold">
                  {item.duration}s
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 truncate">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {item.description}
                  </p>
                </div>

                <div className="flex justify-end mt-1">
                  <button
                    onClick={() => handleAddSampleVideo(item)}
                    className="flex items-center gap-1.5 bg-white hover:bg-sky-500 hover:text-white text-sky-600 border border-slate-200 px-3 py-1 rounded-xl text-xs font-bold transition active:scale-95 shadow-2xs cursor-pointer"
                  >
                    {recentlyAddedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>تمت الإضافة</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>إضافة للتيم لاين</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audio Presets */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <Music className="w-4 h-4 text-sky-500" />
          <span>موسيقى وخلفيات صوتية</span>
        </span>

        <div className="space-y-2">
          {SAMPLE_AUDIO.map((audio) => (
            <div
              key={audio.id}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-2.5 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0">
                  <Music className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700 truncate">
                  {audio.name}
                </span>
              </div>

              <button
                onClick={() => handleAddSampleAudio(audio)}
                className="flex items-center gap-1 bg-white hover:bg-sky-500 hover:text-white text-slate-700 border border-slate-200 px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer active:scale-95 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

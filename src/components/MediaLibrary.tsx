import React, { useRef, useState } from 'react';
import { 
  UploadCloud, 
  Film, 
  Music, 
  Plus, 
  Sparkles, 
  Check,
  FolderPlus
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
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const file = files[0];
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
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar p-3 space-y-4 text-slate-800 select-none bg-white">
      {/* Upload Box */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 hover:border-sky-500 bg-slate-50 hover:bg-sky-50/50 rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*,audio/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center group-hover:scale-105 transition-transform">
          <UploadCloud className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-800 group-hover:text-sky-600 transition-colors">
            {isUploading ? 'جاري القراءة...' : 'رفع مقطع فيديو أو صوت من جهازك'}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            يدعم MP4, WEBM, MOV, MP3
          </p>
        </div>
      </div>

      {/* Category Pills */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>مقاطع جاهزة للعقارات و UGC</span>
          </span>
          <span className="text-[10px] text-sky-600 font-semibold">جاهز للتجربة</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-2.5">
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
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition ${
                selectedCategory === cat.id
                  ? 'bg-sky-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Video Presets List */}
        <div className="grid grid-cols-1 gap-2">
          {filteredVideos.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50 border border-slate-200 hover:border-sky-300 rounded-xl overflow-hidden flex gap-2.5 p-2 transition group"
            >
              <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-slate-900 flex-shrink-0">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 bg-black/70 text-[9px] font-mono text-white px-1 rounded">
                  {item.duration}s
                </span>
              </div>

              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 truncate">{item.title}</h4>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                    {item.description}
                  </p>
                </div>

                <div className="flex justify-end mt-1">
                  <button
                    onClick={() => handleAddSampleVideo(item)}
                    className="flex items-center gap-1 bg-white hover:bg-sky-500 hover:text-white text-sky-600 border border-slate-200 px-2.5 py-1 rounded-lg text-[11px] font-bold transition active:scale-95 shadow-sm"
                  >
                    {recentlyAddedId === item.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-500" />
                        <span>تمت الإضافة</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3" />
                        <span>إضافة</span>
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
      <div>
        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-2">
          <Music className="w-3.5 h-3.5 text-sky-500" />
          <span>موسيقى وخلفيات صوتية</span>
        </span>

        <div className="space-y-1.5">
          {SAMPLE_AUDIO.map((audio) => (
            <div
              key={audio.id}
              className="bg-slate-50 border border-slate-200 rounded-xl p-2 flex items-center justify-between"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0">
                  <Music className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-medium text-slate-700 truncate">
                  {audio.name}
                </span>
              </div>

              <button
                onClick={() => handleAddSampleAudio(audio)}
                className="flex items-center gap-1 bg-white hover:bg-sky-500 hover:text-white text-slate-700 border border-slate-200 px-2.5 py-1 rounded-lg text-[11px] font-bold transition"
              >
                <Plus className="w-3 h-3" />
                <span>إضافة</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

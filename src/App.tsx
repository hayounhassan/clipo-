import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { MainMenuDrawer } from './components/MainMenuDrawer';
import { BottomEditingToolbar } from './components/BottomEditingToolbar';
import { VideoPlayer } from './components/VideoPlayer';
import { Timeline } from './components/Timeline';
import { MediaLibrary } from './components/MediaLibrary';
import { TextOverlaysPanel } from './components/TextOverlaysPanel';
import { EffectsPanel } from './components/EffectsPanel';
import { AudioPanel } from './components/AudioPanel';
import { TemplatesPanel } from './components/TemplatesPanel';
import { ProjectsManagerModal } from './components/ProjectsManagerModal';
import { ExportModal } from './components/ExportModal';
import { SAMPLE_VIDEOS, SAMPLE_AUDIO } from './data/sampleMedia';
import { testSupabaseConnection, saveProject } from './lib/supabase';
import { ProjectState, VideoClip, TextOverlay, AudioTrack } from './types';
import { X } from 'lucide-react';

// Initial Starter Real Estate UGC Project
const INITIAL_PROJECT: ProjectState = {
  id: `proj-${Date.now()}`,
  name: 'إعلان فيلا فاخرة - حي النرجس',
  aspectRatio: '9:16',
  clips: [
    {
      id: 'clip-1',
      name: 'فيلا فاخرة - جولة خارجية',
      url: SAMPLE_VIDEOS[0].url,
      thumbnail: SAMPLE_VIDEOS[0].thumbnail,
      duration: 15,
      startTime: 0,
      clipStart: 0,
      clipEnd: 5,
      volume: 1,
      speed: 1,
      filter: 'luxury_gold',
      brightness: 105,
      contrast: 105,
      saturation: 110,
    },
    {
      id: 'clip-2',
      name: 'صالون ومطبخ مودرن',
      url: SAMPLE_VIDEOS[1].url,
      thumbnail: SAMPLE_VIDEOS[1].thumbnail,
      duration: 15,
      startTime: 5,
      clipStart: 0,
      clipEnd: 6,
      volume: 1,
      speed: 1,
      filter: 'real_estate_glow',
      brightness: 110,
      contrast: 105,
      saturation: 115,
    },
  ],
  textOverlays: [
    {
      id: 'overlay-1',
      text: '✨ معروض الآن للبيع | Just Listed',
      subtitle: 'حي النرجس، الرياض',
      startTime: 0,
      endTime: 4.5,
      x: 50,
      y: 20,
      fontSize: 16,
      color: '#FFFFFF',
      bgColor: '#0284C7',
      fontFamily: 'inherit',
      style: 'real_estate_badge',
      animation: 'pop',
      badgeIcon: '🏡',
    },
    {
      id: 'overlay-2',
      text: '1,450,000 ريال',
      subtitle: 'شامل السعي والضريبة 🏷️',
      startTime: 4.5,
      endTime: 11,
      x: 50,
      y: 25,
      fontSize: 18,
      color: '#38BDF8',
      bgColor: '#18181B',
      fontFamily: 'inherit',
      style: 'price_tag',
      animation: 'pop',
      badgeIcon: '💰',
    },
    {
      id: 'overlay-3',
      text: 'احجز موعد المعاينة الآن 📲',
      subtitle: 'الرابط في البايو أو واتساب',
      startTime: 6,
      endTime: 11,
      x: 50,
      y: 82,
      fontSize: 16,
      color: '#FFFFFF',
      bgColor: '#0284C7',
      fontFamily: 'inherit',
      style: 'call_to_action',
      animation: 'pop',
      badgeIcon: '🔥',
    },
  ],
  audioTracks: [
    {
      id: 'audio-1',
      name: 'Luxury Upbeat Beat',
      url: SAMPLE_AUDIO[0].url,
      duration: 30,
      startTime: 0,
      volume: 0.6,
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function App() {
  const [project, setProject] = useState<ProjectState>(INITIAL_PROJECT);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [selectedOverlayId, setSelectedOverlayId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'media' | 'text' | 'effects' | 'templates' | 'audio' | null>('media');

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const [supabaseConnected, setSupabaseConnected] = useState<boolean>(true);
  const [isProjectsModalOpen, setIsProjectsModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isMainMenuOpen, setIsMainMenuOpen] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<'ar' | 'en'>('ar');

  // Total Duration
  const totalDuration = useMemo(() => {
    return project.clips.reduce(
      (sum, c) => sum + ((c.clipEnd - c.clipStart) / (c.speed || 1)),
      0
    );
  }, [project.clips]);

  // Initial Supabase test connection
  useEffect(() => {
    const initApp = async () => {
      try {
        const conn = await testSupabaseConnection();
        setSupabaseConnected(conn.success);
      } catch {
        setSupabaseConnected(true);
      }
    };
    initApp();
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedClipId) {
          handleDeleteClip(selectedClipId);
        } else if (selectedOverlayId) {
          handleDeleteOverlay(selectedOverlayId);
        }
      } else if (e.key === 'ArrowRight') {
        setCurrentTime((t) => Math.max(0, t - 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentTime((t) => Math.min(totalDuration, t + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedClipId, selectedOverlayId, totalDuration]);

  // Toggle Play / Pause
  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  // Save Project with Supabase & LocalStorage
  const handleSaveProject = async () => {
    setIsSaving(true);
    setSaveNotice('جاري الحفظ والمزامنة...');
    try {
      const res = await saveProject(project);
      setSaveNotice(res.message);
      setTimeout(() => setSaveNotice(null), 3500);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setSaveNotice(`تم الحفظ (${errorMsg})`);
      setTimeout(() => setSaveNotice(null), 3500);
    } finally {
      setIsSaving(false);
    }
  };

  // Create New Project
  const handleNewProject = () => {
    const newProj: ProjectState = {
      id: `proj-${Date.now()}`,
      name: 'مشروع فيديو جديد',
      aspectRatio: '9:16',
      clips: [],
      textOverlays: [],
      audioTracks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProject(newProj);
    setCurrentTime(0);
    setIsPlaying(false);
    setSelectedClipId(null);
    setSelectedOverlayId(null);
  };

  // Select project from modal
  const handleSelectProject = (loadedProject: ProjectState) => {
    setProject(loadedProject);
    setCurrentTime(0);
    setIsPlaying(false);
    setSelectedClipId(null);
    setSelectedOverlayId(null);
  };

  // Add Video Clip
  const handleAddVideoClip = (clip: VideoClip) => {
    setProject((prev) => ({
      ...prev,
      clips: [...prev.clips, clip],
    }));
    setSelectedClipId(clip.id);
  };

  // Add Audio Track
  const handleAddAudioTrack = (audio: AudioTrack) => {
    setProject((prev) => ({
      ...prev,
      audioTracks: [audio],
    }));
  };

  // Update Audio Track Volume
  const handleUpdateAudioVolume = (volume: number) => {
    setProject((prev) => ({
      ...prev,
      audioTracks: prev.audioTracks.map((a, idx) => (idx === 0 ? { ...a, volume } : a)),
    }));
  };

  // Remove Audio Track
  const handleRemoveAudioTrack = () => {
    setProject((prev) => ({
      ...prev,
      audioTracks: [],
    }));
  };

  // Split Clip
  const handleSplitClip = (clipId: string, splitTimelineTime: number) => {
    setProject((prev) => {
      let accumulatedTime = 0;
      let targetIndex = -1;
      let clipStartTimeOnTimeline = 0;

      for (let i = 0; i < prev.clips.length; i++) {
        const c = prev.clips[i];
        const dur = (c.clipEnd - c.clipStart) / (c.speed || 1);
        if (c.id === clipId) {
          targetIndex = i;
          clipStartTimeOnTimeline = accumulatedTime;
          break;
        }
        accumulatedTime += dur;
      }

      if (targetIndex === -1) return prev;

      const originalClip = prev.clips[targetIndex];
      const offsetSeconds = (splitTimelineTime - clipStartTimeOnTimeline) * (originalClip.speed || 1);
      const splitSourceTime = originalClip.clipStart + offsetSeconds;

      if (
        splitSourceTime <= originalClip.clipStart + 0.3 ||
        splitSourceTime >= originalClip.clipEnd - 0.3
      ) {
        return prev;
      }

      const firstHalf: VideoClip = {
        ...originalClip,
        id: `clip-part1-${Date.now()}`,
        name: `${originalClip.name} (1)`,
        clipEnd: splitSourceTime,
      };

      const secondHalf: VideoClip = {
        ...originalClip,
        id: `clip-part2-${Date.now()}`,
        name: `${originalClip.name} (2)`,
        clipStart: splitSourceTime,
      };

      const newClips = [...prev.clips];
      newClips.splice(targetIndex, 1, firstHalf, secondHalf);

      return {
        ...prev,
        clips: newClips,
      };
    });
  };

  // Trim Start
  const handleTrimClipStart = (clipId: string, newStart: number) => {
    setProject((prev) => ({
      ...prev,
      clips: prev.clips.map((c) => (c.id === clipId ? { ...c, clipStart: newStart } : c)),
    }));
  };

  // Trim End
  const handleTrimClipEnd = (clipId: string, newEnd: number) => {
    setProject((prev) => ({
      ...prev,
      clips: prev.clips.map((c) => (c.id === clipId ? { ...c, clipEnd: newEnd } : c)),
    }));
  };

  // Delete Clip
  const handleDeleteClip = (clipId: string) => {
    setProject((prev) => ({
      ...prev,
      clips: prev.clips.filter((c) => c.id !== clipId),
    }));
    if (selectedClipId === clipId) setSelectedClipId(null);
  };

  // Duplicate Clip
  const handleDuplicateClip = (clipId: string) => {
    setProject((prev) => {
      const target = prev.clips.find((c) => c.id === clipId);
      if (!target) return prev;
      const copy: VideoClip = {
        ...target,
        id: `clip-copy-${Date.now()}`,
        name: `${target.name} (نسخة)`,
      };
      const idx = prev.clips.findIndex((c) => c.id === clipId);
      const updated = [...prev.clips];
      updated.splice(idx + 1, 0, copy);
      return { ...prev, clips: updated };
    });
  };

  // Reorder Clips
  const handleReorderClips = (fromIndex: number, toIndex: number) => {
    setProject((prev) => {
      const updated = [...prev.clips];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return { ...prev, clips: updated };
    });
  };

  // Text Overlays
  const handleAddOverlay = (overlay: TextOverlay) => {
    setProject((prev) => ({
      ...prev,
      textOverlays: [...prev.textOverlays, overlay],
    }));
    setSelectedOverlayId(overlay.id);
  };

  const handleUpdateOverlay = (updated: TextOverlay) => {
    setProject((prev) => ({
      ...prev,
      textOverlays: prev.textOverlays.map((o) => (o.id === updated.id ? updated : o)),
    }));
  };

  const handleDeleteOverlay = (overlayId: string) => {
    setProject((prev) => ({
      ...prev,
      textOverlays: prev.textOverlays.filter((o) => o.id !== overlayId),
    }));
    if (selectedOverlayId === overlayId) setSelectedOverlayId(null);
  };

  const handleUpdateOverlayPosition = (id: string, x: number, y: number) => {
    setProject((prev) => ({
      ...prev,
      textOverlays: prev.textOverlays.map((o) => (o.id === id ? { ...o, x, y } : o)),
    }));
  };

  // Update selected clip adjustments
  const handleUpdateSelectedClip = (updated: VideoClip) => {
    setProject((prev) => ({
      ...prev,
      clips: prev.clips.map((c) => (c.id === updated.id ? updated : c)),
    }));
  };

  const selectedClip = project.clips.find((c) => c.id === selectedClipId) || null;

  // Find clip at current playhead
  const clipUnderPlayhead = useMemo(() => {
    let currentStart = 0;
    for (const clip of project.clips) {
      const dur = (clip.clipEnd - clip.clipStart) / (clip.speed || 1);
      if (currentTime >= currentStart && currentTime <= currentStart + dur) {
        return { clip, start: currentStart, duration: dur };
      }
      currentStart += dur;
    }
    return null;
  }, [project.clips, currentTime]);

  const canSplit = Boolean(
    selectedClip || (clipUnderPlayhead && clipUnderPlayhead.clip)
  );

  const handleToolbarSplit = () => {
    if (selectedClip) {
      handleSplitClip(selectedClip.id, currentTime);
    } else if (clipUnderPlayhead) {
      handleSplitClip(clipUnderPlayhead.clip.id, currentTime);
    }
  };

  const handleToolbarTrimIn = () => {
    const target = selectedClip || clipUnderPlayhead?.clip;
    if (!target) return;
    let accumulatedTime = 0;
    for (const c of project.clips) {
      const dur = (c.clipEnd - c.clipStart) / (c.speed || 1);
      if (c.id === target.id) break;
      accumulatedTime += dur;
    }
    const relativeTimeInClip = (currentTime - accumulatedTime) * (target.speed || 1);
    const newClipStart = Math.min(target.clipEnd - 0.5, target.clipStart + relativeTimeInClip);
    handleTrimClipStart(target.id, Math.max(0, newClipStart));
  };

  const handleToolbarTrimOut = () => {
    const target = selectedClip || clipUnderPlayhead?.clip;
    if (!target) return;
    let accumulatedTime = 0;
    for (const c of project.clips) {
      const dur = (c.clipEnd - c.clipStart) / (c.speed || 1);
      if (c.id === target.id) break;
      accumulatedTime += dur;
    }
    const relativeTimeInClip = (currentTime - accumulatedTime) * (target.speed || 1);
    const newClipEnd = Math.max(target.clipStart + 0.5, target.clipStart + relativeTimeInClip);
    handleTrimClipEnd(target.id, Math.min(target.duration, newClipEnd));
  };

  const handleUpdateClipSpeed = (speed: number) => {
    if (!selectedClip) return;
    handleUpdateSelectedClip({
      ...selectedClip,
      speed,
    });
  };

  return (
    <div 
      className="flex flex-col h-screen w-full bg-slate-50 text-slate-800 overflow-hidden font-sans select-none" 
      dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* 1. Sticky Top Header (Deep Blue Mode) */}
      <Header
        onOpenMainMenu={() => setIsMainMenuOpen(true)}
        currentLanguage={currentLanguage}
        onToggleLanguage={() => setCurrentLanguage((l) => (l === 'ar' ? 'en' : 'ar'))}
        supabaseConnected={supabaseConnected}
      />

      {/* Main Slide-Over Drawer for 3-Bars Menu */}
      <MainMenuDrawer
        isOpen={isMainMenuOpen}
        onClose={() => setIsMainMenuOpen(false)}
        project={project}
        onUpdateProjectName={(name) => setProject((p) => ({ ...p, name }))}
        onUpdateAspectRatio={(ratio) => setProject((p) => ({ ...p, aspectRatio: ratio }))}
        onSaveProject={handleSaveProject}
        onNewProject={handleNewProject}
        onOpenProjectsList={() => setIsProjectsModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        isSaving={isSaving}
        saveNotice={saveNotice}
        supabaseConnected={supabaseConnected}
        currentLanguage={currentLanguage}
        onToggleLanguage={() => setCurrentLanguage((l) => (l === 'ar' ? 'en' : 'ar'))}
      />

      {/* 2. Main Workspace: Tool Drawer (if open) + Large Preview Player */}
      <div className="flex-1 flex flex-row overflow-hidden relative">
        {/* Contextual Side Panel for InShot / CapCut Tools */}
        {activeTab && (
          <aside className="w-[340px] sm:w-[380px] bg-white border-l border-slate-200 flex flex-col flex-shrink-0 z-20 shadow-xs animate-in slide-in-from-right-4 duration-150">
            {/* Panel Title & Close Button */}
            <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <span className="text-xs font-bold text-slate-700">
                {activeTab === 'media' && '📁 مكتبة الوسائط ورفع الملفات'}
                {activeTab === 'text' && '✍️ النصوص والملصقات والشارات'}
                {activeTab === 'effects' && '✨ ضبط الألوان والفلاتر والسرعة'}
                {activeTab === 'audio' && '🎵 إدارة الصوتيات والموسيقى التصويرية'}
                {activeTab === 'templates' && '🎯 قوالب إعلانات جاهزة'}
              </span>
              <button
                onClick={() => setActiveTab(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
                title="إغلاق اللوحة"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-hidden">
              {activeTab === 'media' && (
                <MediaLibrary
                  onAddVideoClip={handleAddVideoClip}
                  onAddAudioTrack={handleAddAudioTrack}
                />
              )}

              {activeTab === 'text' && (
                <TextOverlaysPanel
                  textOverlays={project.textOverlays}
                  selectedOverlayId={selectedOverlayId}
                  currentTime={currentTime}
                  totalDuration={totalDuration}
                  onAddOverlay={handleAddOverlay}
                  onUpdateOverlay={handleUpdateOverlay}
                  onDeleteOverlay={handleDeleteOverlay}
                  onSelectOverlay={(id) => {
                    setSelectedOverlayId(id);
                    setSelectedClipId(null);
                  }}
                />
              )}

              {activeTab === 'effects' && (
                <EffectsPanel
                  selectedClip={selectedClip}
                  onUpdateClip={handleUpdateSelectedClip}
                />
              )}

              {activeTab === 'audio' && (
                <AudioPanel
                  audioTracks={project.audioTracks}
                  selectedClip={selectedClip}
                  onAddAudioTrack={handleAddAudioTrack}
                  onUpdateAudioTrackVolume={handleUpdateAudioVolume}
                  onRemoveAudioTrack={handleRemoveAudioTrack}
                  onUpdateClip={handleUpdateSelectedClip}
                />
              )}

              {activeTab === 'templates' && (
                <TemplatesPanel
                  onApplyTemplate={(newProj) => {
                    setProject((prev) => ({
                      ...prev,
                      ...newProj,
                      updatedAt: new Date().toISOString(),
                    }));
                    setCurrentTime(0);
                  }}
                />
              )}
            </div>
          </aside>
        )}

        {/* Generous Center Video Preview Player */}
        <main className="flex-1 flex flex-col bg-slate-50 relative overflow-hidden">
          <VideoPlayer
            aspectRatio={project.aspectRatio}
            clips={project.clips}
            textOverlays={project.textOverlays}
            audioTracks={project.audioTracks}
            currentTime={currentTime}
            isPlaying={isPlaying}
            onTimeUpdate={setCurrentTime}
            onTogglePlay={handleTogglePlay}
            onSelectOverlay={(id) => {
              setSelectedOverlayId(id);
              setSelectedClipId(null);
              setActiveTab('text');
            }}
            selectedOverlayId={selectedOverlayId}
            onUpdateOverlayPosition={handleUpdateOverlayPosition}
          />
        </main>
      </div>

      {/* 3. CapCut / InShot Bottom Editing Toolbar (Docked above Timeline) */}
      <BottomEditingToolbar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab((prev) => (prev === tab ? null : tab))}
        selectedClip={selectedClip}
        selectedClipId={selectedClipId}
        selectedOverlayId={selectedOverlayId}
        currentTime={currentTime}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onSplit={handleToolbarSplit}
        onDelete={() => {
          if (selectedClipId) handleDeleteClip(selectedClipId);
          else if (selectedOverlayId) handleDeleteOverlay(selectedOverlayId);
        }}
        onDuplicate={() => {
          if (selectedClipId) handleDuplicateClip(selectedClipId);
        }}
        onTrimIn={handleToolbarTrimIn}
        onTrimOut={handleToolbarTrimOut}
        onUpdateClipSpeed={handleUpdateClipSpeed}
        onDeselectClip={() => setSelectedClipId(null)}
        canSplit={canSplit}
        onSaveProject={handleSaveProject}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        isSaving={isSaving}
        saveNotice={saveNotice}
      />

      {/* 4. Unified Interactive Timeline */}
      <Timeline
        clips={project.clips}
        textOverlays={project.textOverlays}
        audioTracks={project.audioTracks}
        currentTime={currentTime}
        isPlaying={isPlaying}
        selectedClipId={selectedClipId}
        selectedOverlayId={selectedOverlayId}
        onTimeUpdate={setCurrentTime}
        onTogglePlay={handleTogglePlay}
        onSelectClip={(id) => {
          setSelectedClipId(id);
          if (id) setActiveTab('effects');
        }}
        onSelectOverlay={(id) => {
          setSelectedOverlayId(id);
          if (id) setActiveTab('text');
        }}
        onSplitClip={handleSplitClip}
        onTrimClipStart={handleTrimClipStart}
        onTrimClipEnd={handleTrimClipEnd}
        onDeleteClip={handleDeleteClip}
        onDuplicateClip={handleDuplicateClip}
        onReorderClips={handleReorderClips}
        onDeleteOverlay={handleDeleteOverlay}
      />

      {/* Projects Modal */}
      <ProjectsManagerModal
        isOpen={isProjectsModalOpen}
        onClose={() => setIsProjectsModalOpen(false)}
        onSelectProject={handleSelectProject}
        onNewProject={handleNewProject}
        currentProjectId={project.id}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        project={project}
      />
    </div>
  );
}

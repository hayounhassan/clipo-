import React, { useEffect, useState } from 'react';
import { 
  X, 
  FolderOpen, 
  Trash2, 
  Plus, 
  Film, 
  Calendar, 
  Layers, 
  Cloud, 
  Smartphone, 
  Tv, 
  Square 
} from 'lucide-react';
import { getProjects, deleteProject } from '../lib/supabase';
import { ProjectState } from '../types';

interface ProjectsManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (project: ProjectState) => void;
  onNewProject: () => void;
  currentProjectId: string;
}

export const ProjectsManagerModal: React.FC<ProjectsManagerModalProps> = ({
  isOpen,
  onClose,
  onSelectProject,
  onNewProject,
  currentProjectId,
}) => {
  const [projects, setProjects] = useState<ProjectState[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchList();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('هل أنت متأكد من حذف هذا المشروع؟')) {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('ar-SA', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200 text-slate-800">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">مشاريع الفيديو الخاصة بي</h3>
              <p className="text-[11px] text-slate-500">مزامنة سحابية مع Supabase والتخزين المحلي</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto custom-scrollbar flex-1 space-y-3">
          <button
            onClick={() => {
              onNewProject();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 hover:border-sky-500 bg-slate-50 hover:bg-sky-50/50 rounded-xl text-xs font-bold text-slate-700 hover:text-sky-600 transition"
          >
            <Plus className="w-4 h-4" />
            <span>إنشاء مشروع جديد فارغ</span>
          </button>

          {loading ? (
            <div className="py-12 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
              <span>جاري تحميل المشاريع...</span>
            </div>
          ) : projects.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              لا توجد مشاريع سابقة محفوظة بعد. احفظ مشروعك الحالي ليظهر هنا!
            </div>
          ) : (
            <div className="space-y-2">
              {projects.map((proj) => {
                const isCurrent = proj.id === currentProjectId;
                return (
                  <div
                    key={proj.id}
                    onClick={() => {
                      onSelectProject(proj);
                      onClose();
                    }}
                    className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between group ${
                      isCurrent
                        ? 'bg-sky-50 border-sky-400 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-sky-600 flex-shrink-0">
                        {proj.aspectRatio === '9:16' ? (
                          <Smartphone className="w-5 h-5" />
                        ) : proj.aspectRatio === '16:9' ? (
                          <Tv className="w-5 h-5" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-800 group-hover:text-sky-600 transition-colors truncate">
                            {proj.name}
                          </h4>
                          {isCurrent && (
                            <span className="text-[9px] bg-sky-500 text-white font-extrabold px-1.5 py-0.5 rounded">
                              مفتوح حالياً
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Layers className="w-3 h-3 text-slate-400" />
                            <span>{proj.clips?.length || 0} مقاطع</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{formatDate(proj.updatedAt)}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleDelete(proj.id, e)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="حذف المشروع"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-[11px] text-slate-600">
          <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
            <Cloud className="w-3.5 h-3.5" />
            <span>Supabase Cloud Sync Ready</span>
          </span>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};

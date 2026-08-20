import React from 'react';
import { 
  Menu, 
  Film, 
  ChevronDown
} from 'lucide-react';
import { ProjectState } from '../types';

interface HeaderProps {
  project?: ProjectState;
  onOpenMainMenu: () => void;
  currentLanguage: 'ar' | 'en';
  onToggleLanguage: () => void;
  supabaseConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMainMenu,
  currentLanguage,
  onToggleLanguage,
}) => {
  return (
    <header 
      id="main-sticky-header" 
      dir="rtl"
      className="sticky top-0 z-30 w-full bg-[#0B1E3B] border-b border-[#1A365D] shadow-md px-3 sm:px-6 py-2.5 flex items-center justify-between select-none text-white transition-all relative"
    >
      {/* 1. أقصى اليمين (Right Side): أيقونة القائمة الرئيسية (3 شرطات) مع أيقونة الفيديو */}
      <div className="flex items-center gap-2.5 z-10 flex-shrink-0">
        {/* Hamburger Menu (3 Horizontal Lines) in crisp white */}
        <button
          id="btn-main-menu-toggle"
          onClick={onOpenMainMenu}
          className="p-2 rounded-xl text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 active:scale-95 transition flex items-center justify-center shadow-xs cursor-pointer"
          title="فتح القائمة الرئيسية والمشاريع والتصدير"
          aria-label="القائمة الرئيسية"
        >
          <Menu className="w-5 h-5 text-white" />
        </button>

        {/* Video Film Badge */}
        <div className="hidden sm:flex items-center pr-2 border-r border-white/15">
          <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-white flex items-center justify-center border border-sky-400/30">
            <Film className="w-3.5 h-3.5 text-sky-300" />
          </div>
        </div>
      </div>

      {/* 2. في منتصف الشريط تماماً (Exact Center): شعار النص "Clipo" مستقر وواضح */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none sm:pointer-events-auto z-10">
        <span className="font-black text-xl sm:text-2xl tracking-tight text-white font-sans drop-shadow-sm">
          Clipo
        </span>
        <span className="text-[10px] font-bold bg-sky-500/30 text-sky-200 border border-sky-400/40 px-1.5 py-0.5 rounded-md tracking-wider uppercase">
          PRO
        </span>
      </div>

      {/* 3. أقصى اليسار (Left Side): زر اللغة الجديد والمختصر (أيقونة وحرف اللغة مع السهم) */}
      <div className="flex items-center z-10 flex-shrink-0">
        <button
          id="btn-language-compact-toggle"
          onClick={onToggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-bold transition active:scale-95 shadow-xs cursor-pointer"
          title="تبديل اللغة (Switch Language)"
        >
          <span className="font-serif font-black text-sm tracking-tight text-white px-0.5">
            {currentLanguage === 'ar' ? 'ع' : 'A'}
          </span>
          <span className="text-[11px] font-sans font-medium text-white/90 hidden sm:inline">
            {currentLanguage === 'ar' ? 'العربية' : 'EN'}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-white/80" />
        </button>
      </div>
    </header>
  );
};

import React from 'react';
import { 
  Sparkles, 
  Building2, 
  TrendingUp, 
  ArrowRight
} from 'lucide-react';
import { SAMPLE_VIDEOS, SAMPLE_AUDIO } from '../data/sampleMedia';
import { ProjectState } from '../types';

interface TemplatesPanelProps {
  onApplyTemplate: (newProject: Partial<ProjectState>) => void;
}

export const TemplatesPanel: React.FC<TemplatesPanelProps> = ({ onApplyTemplate }) => {
  const handleApplyLuxuryRealEstate = () => {
    onApplyTemplate({
      name: 'إعلان فيلا فاخرة - حي النرجس',
      aspectRatio: '9:16',
      clips: [
        {
          id: `clip-villa-${Date.now()}`,
          name: 'فيلا فاخرة - جولة خارجية',
          url: SAMPLE_VIDEOS[0].url,
          thumbnail: SAMPLE_VIDEOS[0].thumbnail,
          duration: 15,
          startTime: 0,
          clipStart: 0,
          clipEnd: 5,
          volume: 0.8,
          speed: 1,
          filter: 'luxury_gold',
          brightness: 105,
          contrast: 105,
          saturation: 115,
        },
        {
          id: `clip-interior-${Date.now()}`,
          name: 'صالون ومطبخ مودرن',
          url: SAMPLE_VIDEOS[1].url,
          thumbnail: SAMPLE_VIDEOS[1].thumbnail,
          duration: 15,
          startTime: 5,
          clipStart: 0,
          clipEnd: 6,
          volume: 0.8,
          speed: 1,
          filter: 'real_estate_glow',
          brightness: 110,
          contrast: 105,
          saturation: 110,
        },
        {
          id: `clip-drone-${Date.now()}`,
          name: 'تصوير درون جوي',
          url: SAMPLE_VIDEOS[2].url,
          thumbnail: SAMPLE_VIDEOS[2].thumbnail,
          duration: 15,
          startTime: 11,
          clipStart: 0,
          clipEnd: 4,
          volume: 0.8,
          speed: 1,
          filter: 'warm_sun',
          brightness: 105,
          contrast: 105,
          saturation: 120,
        },
      ],
      textOverlays: [
        {
          id: `text-badge-${Date.now()}`,
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
          id: `text-price-${Date.now()}`,
          text: '1,450,000 ريال',
          subtitle: 'شامل السعي والضريبة 🏷️',
          startTime: 4.5,
          endTime: 10.5,
          x: 50,
          y: 25,
          fontSize: 18,
          color: '#FACC15',
          bgColor: '#18181B',
          fontFamily: 'inherit',
          style: 'price_tag',
          animation: 'pop',
          badgeIcon: '💰',
        },
        {
          id: `text-cta-${Date.now()}`,
          text: 'احجز موعد المعاينة الآن 📲',
          subtitle: 'الرابط في البايو أو واتساب',
          startTime: 10.5,
          endTime: 15,
          x: 50,
          y: 80,
          fontSize: 16,
          color: '#FFFFFF',
          bgColor: '#E11D48',
          fontFamily: 'inherit',
          style: 'call_to_action',
          animation: 'pop',
          badgeIcon: '🔥',
        },
      ],
      audioTracks: [
        {
          id: `audio-bg-${Date.now()}`,
          name: 'Luxury Upbeat Beat',
          url: SAMPLE_AUDIO[0].url,
          duration: 30,
          startTime: 0,
          volume: 0.6,
        },
      ],
    });
  };

  const handleApplyViralUGC = () => {
    onApplyTemplate({
      name: 'إعلان UGC تريند وتوصية فيديو',
      aspectRatio: '9:16',
      clips: [
        {
          id: `clip-ugc-hook-${Date.now()}`,
          name: 'مقدم محتوى UGC - الخطاف',
          url: SAMPLE_VIDEOS[3].url,
          thumbnail: SAMPLE_VIDEOS[3].thumbnail,
          duration: 15,
          startTime: 0,
          clipStart: 0,
          clipEnd: 4,
          volume: 1,
          speed: 1,
          filter: 'vibrant_ugc',
          brightness: 105,
          contrast: 110,
          saturation: 130,
        },
        {
          id: `clip-ugc-tour-${Date.now()}`,
          name: 'جولة تفاصيل العقار',
          url: SAMPLE_VIDEOS[0].url,
          thumbnail: SAMPLE_VIDEOS[0].thumbnail,
          duration: 15,
          startTime: 4,
          clipStart: 2,
          clipEnd: 9,
          volume: 0.7,
          speed: 1,
          filter: 'luxury_gold',
          brightness: 105,
          contrast: 105,
          saturation: 115,
        },
      ],
      textOverlays: [
        {
          id: `ugc-hook-${Date.now()}`,
          text: 'هذا أفخم تشطيب شفته بالرياض! 😍',
          subtitle: 'شوفوا الصالة والمسبح كيف...',
          startTime: 0,
          endTime: 4,
          x: 50,
          y: 30,
          fontSize: 16,
          color: '#000000',
          bgColor: '#FEF08A',
          fontFamily: 'inherit',
          style: 'ugc_caption',
          animation: 'pop',
          badgeIcon: '🗣️',
        },
        {
          id: `ugc-cta-${Date.now()}`,
          text: 'اطلب العرض الخاص اليوم 🚀',
          startTime: 4,
          endTime: 11,
          x: 50,
          y: 82,
          fontSize: 16,
          color: '#FFFFFF',
          bgColor: '#E11D48',
          fontFamily: 'inherit',
          style: 'call_to_action',
          animation: 'pop',
          badgeIcon: '📲',
        },
      ],
    });
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar p-3 space-y-4 text-slate-800 select-none bg-white">
      <div>
        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-sky-500" />
          <span>قوالب إعلانات جاهزة بنقرة واحدة</span>
        </span>
        <p className="text-[11px] text-slate-500 mb-3">
          توليد مشروع متكامل مع مقاطع متناسقة وبطاقات أسعار بنقرة واحدة.
        </p>
      </div>

      {/* Template 1: Luxury Real Estate */}
      <div className="bg-slate-50 border border-slate-200 hover:border-sky-300 rounded-xl p-3 transition space-y-3 group">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-sky-600 transition-colors">
                🏡 إعلان فيلا فاخرة
              </h4>
              <span className="text-[10px] text-slate-500">3 مقاطع • 9:16 Reels • بطاقة سعر</span>
            </div>
          </div>
          <span className="text-[10px] bg-sky-100 text-sky-700 font-bold px-2 py-0.5 rounded-full">
            الأكثر استخداماً
          </span>
        </div>

        <p className="text-[11px] text-slate-600 leading-snug">
          جولة مسبح + صالة ومطبخ + درون جوي مع بطاقة السعر الفاخر والدعوة للحجز.
        </p>

        <button
          onClick={handleApplyLuxuryRealEstate}
          className="w-full flex items-center justify-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-lg text-xs font-bold transition shadow-sm"
        >
          <span>تطبيق القالب في المشروع</span>
          <ArrowRight className="w-3.5 h-3.5 rotate-180" />
        </button>
      </div>

      {/* Template 2: UGC Viral Hook */}
      <div className="bg-slate-50 border border-slate-200 hover:border-sky-300 rounded-xl p-3 transition space-y-3 group">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-sky-600 transition-colors">
                🔥 فيديو UGC وتوصية مؤثر
              </h4>
              <span className="text-[10px] text-slate-500">مقدم فيديو + جولة + تسميات</span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-600 leading-snug">
          مقدمة Hook قوية بمقدم فيديو حقيقي متبوعاً بجولة سريعة وعناوين مميزة.
        </p>

        <button
          onClick={handleApplyViralUGC}
          className="w-full flex items-center justify-center gap-1.5 bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 py-2 rounded-lg text-xs font-bold border border-slate-200 transition"
        >
          <span>تطبيق قالب UGC</span>
          <ArrowRight className="w-3.5 h-3.5 rotate-180" />
        </button>
      </div>
    </div>
  );
};

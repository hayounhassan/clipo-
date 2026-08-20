import { SampleMediaItem } from '../types';

export const SAMPLE_VIDEOS: SampleMediaItem[] = [
  {
    id: 'sample-villa-1',
    title: 'فيلا فاخرة - جولة خارجية و المسبح',
    category: 'real_estate',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&auto=format&fit=crop&q=80',
    duration: 15,
    description: 'لقطة سينمائية لفيلا مودرن مع مسبح وإضاءة مسائية ذهبية (مثالي للإعلانات)',
  },
  {
    id: 'sample-interior-1',
    title: 'صالون ومطبخ مفتوح مودرن',
    category: 'interior',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
    duration: 15,
    description: 'جولة داخلية في الصالة الرئيسية والمطبخ المودرن بتشطيبات رخامية فخمة',
  },
  {
    id: 'sample-drone-1',
    title: 'تصوير درون جوي للموقع والحي',
    category: 'drone',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80',
    duration: 15,
    description: 'مشهد درون بانورامي لموقع العقار وقربه من الخدمات والمرافق الحيوية',
  },
  {
    id: 'sample-ugc-1',
    title: 'مقدم محتوى UGC يتحدث بحماس',
    category: 'ugc',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    duration: 15,
    description: 'توصية فيديو واقعية بأسلوب Hook قوي لمراجعة العقار أو المنتج',
  },
];

export const SAMPLE_AUDIO = [
  {
    id: 'audio-modern-vibes',
    name: 'Luxury Upbeat Beat (إيقاع عصري فاخر)',
    url: 'https://actions.google.com/sounds/v1/ambient/rain_heavy.ogg',
    duration: 30,
  },
  {
    id: 'audio-lofi-chill',
    name: 'Real Estate Chill Lounge (موسيقى هادئة راقية)',
    url: 'https://actions.google.com/sounds/v1/water/creek_run.ogg',
    duration: 30,
  },
];

export const REAL_ESTATE_STICKER_PRESETS = [
  {
    title: 'السعر الفاخر',
    text: '1,450,000 ريال',
    subtitle: 'شامل الضريبة والسعي 🏷️',
    style: 'price_tag' as const,
    badgeIcon: '💰',
    color: '#FACC15',
    bgColor: '#18181B',
  },
  {
    title: 'عرض جديد حصري',
    text: '✨ معروض الآن للبيع | Just Listed',
    subtitle: 'الموقع: حي النرجس، الرياض',
    style: 'real_estate_badge' as const,
    badgeIcon: '🏡',
    color: '#FFFFFF',
    bgColor: '#0284C7',
  },
  {
    title: 'المواصفات الفنية',
    text: '5 غرف نوم • 6 دورات مياه • مسبح خاص',
    subtitle: 'المساحة: 480 م²',
    style: 'location_pill' as const,
    badgeIcon: '📐',
    color: '#FFFFFF',
    bgColor: '#059669',
  },
  {
    title: 'دعوة لاتخاذ إجراء',
    text: 'احجز موعد المعاينة الآن 📲',
    subtitle: 'الرابط في البايو أو تواصل واتساب',
    style: 'call_to_action' as const,
    badgeIcon: '🔥',
    color: '#FFFFFF',
    bgColor: '#E11D48',
  },
  {
    title: 'تسمية توضيحية UGC',
    text: 'هذا أجمل بيت شفته بالرياض هذا الشهر! 😍',
    subtitle: 'تعالوا نشوف التفاصيل بالداخل...',
    style: 'ugc_caption' as const,
    badgeIcon: '🗣️',
    color: '#000000',
    bgColor: '#FEF08A',
  },
];

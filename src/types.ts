export type AspectRatio = '9:16' | '16:9' | '1:1' | '4:5';

export interface VideoClip {
  id: string;
  name: string;
  url: string;
  thumbnail?: string;
  duration: number; // original source duration in seconds
  startTime: number; // position on timeline in seconds
  clipStart: number; // in-point within source video (trim start)
  clipEnd: number; // out-point within source video (trim end)
  volume: number; // 0 to 1
  speed: number; // 0.5, 1, 1.25, 1.5, 2
  filter: 'none' | 'luxury_gold' | 'vibrant_ugc' | 'warm_sun' | 'real_estate_glow' | 'contrast' | 'noir' | 'cinema';
  brightness: number; // 50 to 150 (100 is default)
  contrast: number; // 50 to 150
  saturation: number; // 0 to 200
}

export type TextStyle = 
  | 'clean' 
  | 'ugc_caption' 
  | 'price_tag' 
  | 'real_estate_badge' 
  | 'headline' 
  | 'call_to_action'
  | 'location_pill';

export type TextAnimation = 'none' | 'fade' | 'pop' | 'slide_up' | 'typewriter';

export interface TextOverlay {
  id: string;
  text: string;
  subtitle?: string;
  startTime: number; // seconds
  endTime: number; // seconds
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  fontSize: number; // in px
  color: string;
  bgColor?: string;
  fontFamily: string;
  style: TextStyle;
  animation: TextAnimation;
  badgeIcon?: string; // emoji or icon tag
}

export interface AudioTrack {
  id: string;
  name: string;
  url: string;
  duration: number;
  startTime: number;
  volume: number;
}

export interface ProjectState {
  id: string;
  name: string;
  description?: string;
  aspectRatio: AspectRatio;
  clips: VideoClip[];
  textOverlays: TextOverlay[];
  audioTracks: AudioTrack[];
  createdAt: string;
  updatedAt: string;
  user_id?: string;
}

export interface SampleMediaItem {
  id: string;
  title: string;
  category: 'real_estate' | 'ugc' | 'drone' | 'interior';
  url: string;
  duration: number;
  thumbnail: string;
  description: string;
}

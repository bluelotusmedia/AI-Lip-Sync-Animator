export enum Step {
  API_KEY,
  IMAGE_UPLOAD,
  CUSTOMIZATION,
  GENERATING,
  RESULT,
}

export interface VoiceOption {
  id: string;
  name: string;
  description: string;
}

export type AspectRatio = '16:9' | '9:16';
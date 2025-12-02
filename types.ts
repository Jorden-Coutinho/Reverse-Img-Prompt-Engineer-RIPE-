export interface VeoPromptData {
  cinematography: string;
  subject: string;
  action: string;
  context_setting: string;
  style_ambiance: string;
  audio: string;
  negative_prompt: string;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
}

export interface UploadedFile {
  data: string; // Base64
  mimeType: string;
  previewUrl: string;
  type: 'image' | 'video';
}
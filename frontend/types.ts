export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  ERROR = 'error',
}

export interface Message {
  id: string;
  role: MessageRole;
  type: MessageType;
  content: string; // Text content, Base64 string for image, or URL for video
  timestamp: number;
  isStreaming?: boolean;
}

export enum GenerationMode {
  CHAT = 'chat',
  IMAGE = 'image',
  VIDEO = 'video',
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  mode: GenerationMode;
}

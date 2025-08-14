export interface ChatMessage {
  id: string;
  content: string;
  isAI: boolean;
  timestamp: Date;
  phase?: string;
}

export interface ChatPhase {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface UserBehavior {
  scrollCount: number;
  clickCount: number;
  touchCount: number;
  timeSpent: number;
  lastInteraction: Date;
  preferredPromptType?: 'banner' | 'button';
  dismissedCount: number;
  installAttempts: number;
}

export interface ApiConfig {
  apiKey: string;
  useCustomApiKey: boolean;
  currentKeyIndex: number;
  dailyUsageCount: number;
  lastUsageDate: string;
  dailyFreeLimit: number;
  endpoints: {
    vercel: string[];
    local: string[];
  };
  testEndpoints: string[];
}

export interface ChatState {
  messages: ChatMessage[];
  currentPhase: string;
  isLoading: boolean;
  usageCount: number;
  usageLimit: number;
}

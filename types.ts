export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export const INITIAL_MESSAGE: Message = {
  id: 'init-1',
  role: 'model',
  text: "Greetings. I am here to help you find clarity. Whether you face a difficult decision, emotional turmoil, or simply seek a better perspective, we can examine it together with reason and balance. What is on your mind?",
  timestamp: new Date(),
};
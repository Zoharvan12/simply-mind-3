
export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  created_at: string;
  status?: 'pending' | 'error';
}

export interface Chat {
  id: string;
  title: string;
  created_at: string;
}

export interface MessagesState {
  messages: Message[];
  chats: Chat[];
  currentChatId: string | null;
  isLoading: boolean;
}

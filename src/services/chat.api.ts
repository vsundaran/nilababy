import { apiClient } from './auth.service';

export interface ChatSuggestion {
  _id: string;
  text: string;
  order: number;
}

export interface Conversation {
  _id: string;
  userId: string;
  title: string;
  lastMessageAt: string;
}

export interface ChatMessage {
  _id: string;
  conversationId: string;
  sender: 'user' | 'ai';
  content: string;
  createdAt: string;
}

export const chatApi = {
  fetchSuggestions: async (): Promise<ChatSuggestion[]> => {
    const { data } = await apiClient.get('/chat/suggestions');
    return data.data;
  },

  fetchConversations: async (page = 1, limit = 20): Promise<{ conversations: Conversation[], total: number }> => {
    const { data } = await apiClient.get('/chat/conversations', { params: { page, limit } });
    return data.data;
  },

  fetchMessages: async (conversationId: string, page = 1, limit = 50): Promise<{ messages: ChatMessage[], total: number }> => {
    const { data } = await apiClient.get(`/chat/conversations/${conversationId}/messages`, { params: { page, limit } });
    return data.data;
  },

  sendMessage: async (content: string, conversationId?: string): Promise<{ conversation: { _id: string, title: string }, userMessage: ChatMessage, aiMessage: ChatMessage }> => {
    const payload = conversationId ? { conversationId, content } : { content };
    const { data } = await apiClient.post('/chat/conversations/message', payload);
    return data.data;
  }
};

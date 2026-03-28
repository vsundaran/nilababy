import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatApi, Conversation, ChatMessage } from '../services/chat.api';
import { getDB } from '../services/db';

const DB_SYNC_INTERVAL = 1000 * 60 * 5; // 5 mins

export const useSuggestions = () => {
  return useQuery({
    queryKey: ['suggestions'],
    queryFn: chatApi.fetchSuggestions,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const db = getDB();
      
      // Try fetching from API and syncing
      try {
        const { conversations } = await chatApi.fetchConversations(1, 100);
        
        // Sync to SQLite
        for (const conv of conversations) {
          await db.execAsync(`
            INSERT OR REPLACE INTO conversations (id, title, lastMessageAt, updatedAt) 
            VALUES ('${conv._id}', '${conv.title.replace(/'/g, "''")}', ${new Date(conv.lastMessageAt).getTime()}, ${Date.now()});
          `);
        }
      } catch (e) {
        console.warn('Offline or API error while fetching conversations', e);
      }

      // Always return from SQLite as source of truth
      const result = await db.getAllAsync<{ id: string, title: string, lastMessageAt: number }>(
        'SELECT * FROM conversations ORDER BY lastMessageAt DESC;'
      );
      
      return result.map(c => ({
        _id: c.id,
        userId: 'local', // Placeholder, not used in UI directly
        title: c.title,
        lastMessageAt: new Date(c.lastMessageAt).toISOString()
      }));
    },
    // We already have API-level sync in the queryFn, React-Query caching is just for fast UI
  });
};

export const useMessages = (conversationId?: string) => {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      
      const db = getDB();

      try {
        // Only fetch from API if it's a real MongoDB ObjectId, not a local temporary ID
        if (!conversationId.startsWith('temp_')) {
          const { messages } = await chatApi.fetchMessages(conversationId, 1, 100);
          
          // Sync to SQLite
          for (const msg of messages) {
            await db.execAsync(`
              INSERT OR REPLACE INTO messages (id, conversationId, sender, content, createdAt, isPending) 
              VALUES ('${msg._id}', '${msg.conversationId}', '${msg.sender}', '${msg.content.replace(/'/g, "''")}', ${new Date(msg.createdAt).getTime()}, 0);
            `);
          }
        }
      } catch (e) {
        console.warn(`Offline or API error fetching messages for ${conversationId}`, e);
      }

      // Return from SQLite
      const result = await db.getAllAsync<{ id: string, sender: string, content: string, createdAt: number, isPending: number }>(
        `SELECT * FROM messages WHERE conversationId = '${conversationId}' ORDER BY createdAt ASC;`
      );

      return result.map(m => ({
        _id: m.id,
        conversationId,
        sender: m.sender as 'user' | 'ai',
        content: m.content,
        createdAt: new Date(m.createdAt).toISOString()
      }));
    },
    enabled: !!conversationId,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content, conversationId }: { content: string, conversationId?: string }) => {
      const db = getDB();
      const localTempId = 'temp_' + Date.now();
      const now = Date.now();

      // Ensure we have a conversation object local for completely new chats
      let currentConvId = conversationId || 'temp_conv_' + now;
      if (!conversationId) {
         await db.execAsync(`
            INSERT INTO conversations (id, title, lastMessageAt, updatedAt) 
            VALUES ('${currentConvId}', 'New Chat', ${now}, ${now});
          `);
      }

      // Write Optimistic User Message to SQLite
      await db.execAsync(`
        INSERT INTO messages (id, conversationId, sender, content, createdAt, isPending) 
        VALUES ('${localTempId}', '${currentConvId}', 'user', '${content.replace(/'/g, "''")}', ${now}, 1);
      `);

      // Invalidate to show local optimistic instantly
      queryClient.invalidateQueries({ queryKey: ['messages', currentConvId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });

      // Call API
      const response = await chatApi.sendMessage(content, conversationId);
      
      // Update SQLite with real IDs and AI message
      const realConvId = response.conversation._id;
      
      // If we created a temporary conversation, replace its ID in DB (cascade will handle messages if enabled correctly, 
      // but let's manually update just in case)
      if (!conversationId) {
        await db.execAsync(`
          INSERT OR REPLACE INTO conversations (id, title, lastMessageAt, updatedAt) 
          VALUES ('${realConvId}', '${response.conversation.title.replace(/'/g, "''")}', ${Date.now()}, ${Date.now()});
        `);
        // We delete the temp one and its messages to avoid duplicate ghosts, 
        // since we are inserting the permanent ones below
        await db.execAsync(`DELETE FROM messages WHERE conversationId = '${currentConvId}'`);
        await db.execAsync(`DELETE FROM conversations WHERE id = '${currentConvId}'`);
      } else {
        // Just delete the temporary local message
        await db.execAsync(`DELETE FROM messages WHERE id = '${localTempId}'`);
      }

      // Insert real user message
      await db.execAsync(`
        INSERT OR REPLACE INTO messages (id, conversationId, sender, content, createdAt, isPending) 
        VALUES ('${response.userMessage._id}', '${realConvId}', 'user', '${response.userMessage.content.replace(/'/g, "''")}', ${new Date(response.userMessage.createdAt).getTime()}, 0);
      `);

      // Insert real AI message
      await db.execAsync(`
        INSERT OR REPLACE INTO messages (id, conversationId, sender, content, createdAt, isPending) 
        VALUES ('${response.aiMessage._id}', '${realConvId}', 'ai', '${response.aiMessage.content.replace(/'/g, "''")}', ${new Date(response.aiMessage.createdAt).getTime()}, 0);
      `);

      // Return the real conversation ID so the UI can switch to it
      return realConvId;
    },
    onSuccess: (newConvId, variables) => {
      // Invalidate both possible keys (if it changed from undefined -> new ID)
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

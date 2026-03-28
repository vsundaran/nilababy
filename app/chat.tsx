import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  Text
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Theme } from '../src/constants/Theme';
import { Header } from '../src/components/chat/Header';
import { ChatMessage, MessageProps } from '../src/components/chat/ChatMessage';
import { QuickSuggestions } from '../src/components/chat/QuickSuggestions';
import { ChatInput } from '../src/components/chat/ChatInput';
import { BottomNavigation } from '../src/components/chat/BottomNavigation';
import { ChatBackground } from '../src/components/chat/ChatBackground';
import { useConversations, useMessages, useSendMessage, useSuggestions } from '../src/hooks/useChatQueries';
import { ChatSkeleton } from '../src/components/chat/ChatSkeleton';
import { TypingIndicator } from '../src/components/chat/TypingIndicator';

export default function ChatScreen() {
  const [inputText, setInputText] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>();
  const flatListRef = useRef<FlatList>(null);
  
  // Queries
  const { data: suggestionsData } = useSuggestions();
  const { data: conversations, isLoading: conversationsLoading } = useConversations();
  
  // Auto-resume last active conversation if possible
  useEffect(() => {
    if (conversations && conversations.length > 0 && !activeConversationId) {
       setActiveConversationId(conversations[0]._id);
    }
  }, [conversations, activeConversationId]);

  const { data: messages = [], isLoading: messagesLoading } = useMessages(activeConversationId);
  const { mutate: sendMessage, isPending } = useSendMessage();

  const formattedSuggestions = useMemo(() => {
    if (!suggestionsData || suggestionsData.length === 0) {
      return ["Baby crying too much", "Can babies drink water?", "Baby not sleeping", "Is honey safe for infants?"];
    }
    return suggestionsData.map(s => s.text);
  }, [suggestionsData]);

  const handleSend = (text: string = inputText) => {
    if (!text.trim() || isPending) return;

    const targetConvId = activeConversationId || `temp_conv_${Date.now()}`;
    if (!activeConversationId) {
       setActiveConversationId(targetConvId);
    }

    sendMessage(
      { content: text, conversationId: targetConvId },
      {
        onSuccess: (newRealConvId) => {
           // Update the active ID to the permanent ID returned by the backend
           if (targetConvId !== newRealConvId) {
             setActiveConversationId(newRealConvId);
           }
        }
      }
    );
    setInputText('');
  };

  // Scroll to bottom when messages change or typing begins
  useEffect(() => {
    if (messages.length > 0 || isPending) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [messages, isPending]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const renderContent = () => {
    // Show skeleton only if loading first time and not currently sending a message
    const isFetchingInitial = (conversationsLoading || (activeConversationId && messagesLoading));
    if (isFetchingInitial && !isPending && messages.length === 0) {
       return <View style={styles.skeletonWrapper}><ChatSkeleton darkMode={darkMode} /></View>;
    }

    return (
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ChatMessage 
            type={item.sender as unknown as MessageProps['type']} 
            content={item.content} 
            darkMode={darkMode} 
          />
        )}
        ListFooterComponent={isPending ? <TypingIndicator darkMode={darkMode} /> : null}
        contentContainerStyle={[
          styles.messageList,
          { paddingBottom: 10 } 
        ]}
        onContentSizeChange={() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }}
        ListEmptyComponent={
           <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
              <Text style={{ fontSize: Theme.Typography.fontSize.lg, fontFamily: Theme.Typography.fontFamily.medium, color: darkMode ? '#8E8E93' : '#AEAEB2' }}>
                 Start a new chat
              </Text>
           </View>
        }
      />
    );
  };

  return (
    <SafeAreaView 
      style={[
        styles.safeArea, 
        darkMode ? styles.bgDark : styles.bgLight
      ]}
      edges={['left', 'right', 'bottom']}
    >
      <StatusBar style={darkMode ? 'light' : 'dark'} />
      <ChatBackground darkMode={darkMode} />
      <Header darkMode={darkMode} onThemeToggle={toggleTheme} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {renderContent()}

        <View style={styles.bottomSection}>
          {/* <QuickSuggestions 
            suggestions={formattedSuggestions} 
            onSelect={handleSend} 
            darkMode={darkMode} 
          /> */}
          <ChatInput 
            value={inputText} 
            onChangeText={setInputText} 
            onSend={() => handleSend()} 
            darkMode={darkMode} 
            disabled={isPending}
          />
        </View>
      </KeyboardAvoidingView>
      
      {/* <BottomNavigation activeTab="chat" darkMode={darkMode} /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  bgLight: {
    backgroundColor: Theme.Colors.backgroundLight,
  },
  bgDark: {
    backgroundColor: Theme.Colors.backgroundDark,
  },
  container: {
    flex: 1,
  },
  messageList: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    flexGrow: 1,
  },
  bottomSection: {
    paddingTop: 8,
  },
  skeletonWrapper: {
    flex: 1,
    marginTop: 20,
  }
});

import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform, 
  StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '../src/constants/Colors';
import { Header } from '../src/components/chat/Header';
import { ChatMessage, MessageProps } from '../src/components/chat/ChatMessage';
import { QuickSuggestions } from '../src/components/chat/QuickSuggestions';
import { ChatInput } from '../src/components/chat/ChatInput';
import { BottomNavigation } from '../src/components/chat/BottomNavigation';
import { useVoiceRecognition } from '../src/hooks/useVoiceRecognition';


const INITIAL_MESSAGES: MessageProps[] = [
  {
    type: 'user',
    content: 'Can a 3 month baby drink water?',
  },
  {
    type: 'ai',
    content: 'Many parents wonder about this. Babies under 6 months usually get all the hydration they need from breast milk or formula. Giving water too early may reduce milk intake.',
  }
];

const SUGGESTIONS = [
  "Baby crying too much",
  "Can babies drink water?",
  "Baby not sleeping",
  "Is honey safe for infants?"
];

import { ChatBackground } from '../src/components/chat/ChatBackground';

export default function ChatScreen() {
  const [messages, setMessages] = useState<MessageProps[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening 
  } = useVoiceRecognition();

  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  const handleSend = (text: string = inputText) => {
    if (!text.trim()) return;

    const newUserMessage: MessageProps = {
      type: 'user',
      content: text,
      darkMode
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputText('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: MessageProps = {
        type: 'ai',
        content: "I'm processing your question about baby care. Please remember I'm an AI assistant and you should consult a pediatrician for medical advice.",
        darkMode
      };
      setMessages(prev => [...prev, aiResponse]);
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 1000);
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <SafeAreaView 
      style={[
        styles.safeArea, 
        darkMode ? styles.bgDark : styles.bgLight
      ]}
      edges={['left', 'right']}
    >
      <ChatBackground darkMode={darkMode} />
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />
      <Header darkMode={darkMode} onThemeToggle={toggleTheme} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <ChatMessage 
              type={item.type} 
              content={item.content} 
              darkMode={darkMode} 
            />
          )}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <View style={styles.bottomSection}>
          <QuickSuggestions 
            suggestions={SUGGESTIONS} 
            onSelect={handleSend} 
            darkMode={darkMode} 
          />
          <ChatInput 
            value={inputText} 
            onChangeText={setInputText} 
            onSend={() => handleSend()} 
            darkMode={darkMode} 
            isRecording={isListening}
            onRecordStart={startListening}
            onRecordEnd={stopListening}
          />
          {/* <BottomNavigation activeTab="chat" darkMode={darkMode} /> */}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  bgLight: {
    backgroundColor: Colors.backgroundLight,
  },
  bgDark: {
    backgroundColor: Colors.backgroundDark,
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
});

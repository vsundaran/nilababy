import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';

export interface MessageProps {
  type: 'user' | 'ai';
  content: string;
  darkMode?: boolean;
}

export const ChatMessage: React.FC<MessageProps> = ({ type, content, darkMode = false }) => {
  const isAI = type === 'ai';

  return (
    <View style={[styles.container, isAI ? styles.containerAI : styles.containerUser]}>
      {isAI ? (
        <View style={styles.aiHeader}>
          <View style={styles.aiAvatar}>
            <MaterialIcons name="brightness-3" size={16} color={Colors.white} />
          </View>
          <Text style={styles.senderName}>Nilababy AI</Text>
        </View>
      ) : (
        <Text style={[styles.senderName, styles.senderNameUser]}>You</Text>
      )}
      
      <View style={[
        styles.bubble,
        isAI ? (darkMode ? styles.bubbleAIDark : styles.bubbleAILight) : styles.bubbleUser,
        isAI ? styles.bubbleAIRounded : styles.bubbleUserRounded
      ]}>
        <Text style={[
          styles.content,
          isAI ? (darkMode ? styles.textAIDark : styles.textAILight) : styles.textUser
        ]}>
          {content}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    maxWidth: '85%',
  },
  containerUser: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  containerAI: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  aiAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '130deg' }]
  },
  senderName: {
    fontSize: 11,
    color: Colors.slate400,
  },
  senderNameUser: {
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  bubble: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 15,
    elevation: 2,
  },
  bubbleUser: {
    backgroundColor: Colors.lavenderSoft,
  },
  bubbleAILight: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.slate100,
  },
  bubbleAIDark: {
    backgroundColor: Colors.slate800,
    borderWidth: 1,
    borderColor: Colors.slate700,
  },
  bubbleUserRounded: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 4,
  },
  bubbleAIRounded: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 24,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
  },
  textUser: {
    color: Colors.white,
  },
  textAILight: {
    color: Colors.slate800,
  },
  textAIDark: {
    color: Colors.slate200,
  },
});

import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';

export interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  darkMode?: boolean;
  isRecording?: boolean;
  onRecordStart?: () => void;
  onRecordEnd?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  value, 
  onChangeText, 
  onSend, 
  darkMode = false,
  isRecording = false,
  onRecordStart,
  onRecordEnd
}) => {
  return (
    <View style={styles.container}>
      <View style={[
        styles.inputWrapper,
        darkMode ? styles.inputWrapperDark : styles.inputWrapperLight
      ]}>
        <TouchableOpacity 
          style={[styles.micButton, isRecording && styles.micButtonActive]}
          onLongPress={onRecordStart}
          onPressOut={onRecordEnd}
          delayLongPress={100}
        >
          <MaterialIcons 
            name={isRecording ? "graphic-eq" : "mic"} 
            size={24} 
            color={isRecording ? Colors.white : Colors.primary} 
          />
        </TouchableOpacity>

        
        <TextInput
          style={[
            styles.input,
            darkMode ? styles.textDark : styles.textLight
          ]}
          placeholder="Ask anything about your baby..."
          placeholderTextColor={Colors.slate400}
          value={value}
          onChangeText={onChangeText}
        />
        
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={onSend}
          disabled={!value.trim()}
        >
          <MaterialIcons name="send" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  inputWrapperLight: {
    backgroundColor: Colors.white,
    borderColor: Colors.slate100,
  },
  inputWrapperDark: {
    backgroundColor: Colors.slate800,
    borderColor: Colors.slate700,
  },
  micButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(170, 186, 248, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  micButtonActive: {
    backgroundColor: Colors.primary,
  },
  input: {

    flex: 1,
    fontSize: 14,
    paddingHorizontal: 12,
  },
  textLight: {
    color: Colors.slate700,
  },
  textDark: {
    color: Colors.slate200,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
});

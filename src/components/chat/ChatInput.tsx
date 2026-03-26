import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Theme } from '../../constants/Theme';
import { MaterialIcons } from '@expo/vector-icons';

export interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  darkMode?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  value, 
  onChangeText, 
  onSend, 
  darkMode = false
}) => {
  return (
    <View style={styles.container}>
      <View style={[
        styles.inputWrapper,
        darkMode ? styles.inputWrapperDark : styles.inputWrapperLight,
        { paddingLeft: 16 }
      ]}>
        <TextInput
          style={[
            styles.input,
            darkMode ? styles.textDark : styles.textLight
          ]}
          placeholder="Ask anything about your baby..."
          placeholderTextColor={Theme.Colors.slate400}
          value={value}
          onChangeText={onChangeText}
        />
        
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={onSend}
          disabled={!value.trim()}
        >
          <MaterialIcons name="send" size={20} color={Theme.Colors.white} />
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
    backgroundColor: Theme.Colors.white,
    borderColor: Theme.Colors.slate100,
  },
  inputWrapperDark: {
    backgroundColor: Theme.Colors.slate800,
    borderColor: Theme.Colors.slate700,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 12,
    fontFamily: Theme.Typography.fontFamily.regular,
  },
  textLight: {
    color: Theme.Colors.slate700,
  },
  textDark: {
    color: Theme.Colors.slate200,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Theme.Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
});

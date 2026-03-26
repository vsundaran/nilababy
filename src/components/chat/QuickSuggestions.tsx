import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Theme } from '../../constants/Theme';

export interface QuickSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  darkMode?: boolean;
}

export const QuickSuggestions: React.FC<QuickSuggestionsProps> = ({ 
  suggestions, 
  onSelect, 
  darkMode = false 
}) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {suggestions.map((suggestion, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.chip,
            darkMode ? styles.chipDark : styles.chipLight
          ]}
          onPress={() => onSelect(suggestion)}
        >
          <Text style={[
            styles.text,
            darkMode ? styles.textDark : styles.textLight
          ]}>
            {suggestion}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(170, 186, 248, 0.2)',
  },
  chipLight: {
    backgroundColor: Theme.Colors.white,
  },
  chipDark: {
    backgroundColor: Theme.Colors.slate800,
  },
  text: {
    fontSize: 12,
    fontFamily: Theme.Typography.fontFamily.medium,
  },
  textLight: {
    color: Theme.Colors.slate700,
  },
  textDark: {
    color: Theme.Colors.slate300,
  },
});

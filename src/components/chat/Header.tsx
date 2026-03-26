import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Theme } from '../../constants/Theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface HeaderProps {
  darkMode?: boolean;
  onThemeToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ darkMode = false, onThemeToggle }) => {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[
      styles.container, 
      { paddingTop: insets.top + 4 },

      darkMode ? styles.containerDark : styles.containerLight
    ]}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {/* <Image 
            source={require('../../../assets/images/nilababy-logo.png')} 
            style={styles.logo}
          /> */}
          <TouchableOpacity 
            onPress={onThemeToggle} 
            style={[styles.iconButton, darkMode ? styles.iconButtonDark : styles.iconButtonLight]}
          >
            <MaterialIcons 
              name={darkMode ? "light-mode" : "dark-mode"} 
              size={20} 
              color={Theme.Colors.primary} 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.centerSection}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, darkMode ? styles.textDark : styles.textLight]}>
              Nilababy
            </Text>
            {/* <MaterialIcons name="brightness-3" size={14} color={Colors.primary} /> */}
          </View>
          <Text style={styles.subtitle}>YOUR CALM GUIDE FOR BABY CARE</Text>
        </View>

        <View style={styles.rightSection}>
          {/* <View style={[styles.profileCircle, darkMode ? styles.profileCircleDark : styles.profileCircleLight]}>
            <MaterialIcons name="person" size={24} color={Colors.primary} />
          </View> */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(170, 186, 248, 0.1)',
  },
  containerLight: {
    backgroundColor: 'rgba(255, 249, 247, 0.8)',
  },
  containerDark: {
    backgroundColor: 'rgba(16, 20, 34, 0.8)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    transitionProperty: 'background-color',
    transitionDuration: '200ms',
  },
  iconButtonLight: {
    backgroundColor: 'rgba(170, 186, 248, 0.1)',
  },
  iconButtonDark: {
    backgroundColor: 'rgba(170, 186, 248, 0.1)',
  },
  centerSection: {
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  title: {
    fontSize: 18,
    letterSpacing: -0.5,
    fontFamily: Theme.Typography.fontFamily.bold,
  },
  textLight: {
    color: Theme.Colors.slate900,
  },
  textDark: {
    color: Theme.Colors.white,
  },
  subtitle: {
    fontSize: 10,
    letterSpacing: 1,
    color: Theme.Colors.slate500,
    fontFamily: Theme.Typography.fontFamily.medium,
    marginTop: 2,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Theme.Colors.white,
    overflow: 'hidden',
  },
  profileCircleLight: {
    backgroundColor: 'rgba(170, 186, 248, 0.2)',
    borderColor: Theme.Colors.white,
  },
  profileCircleDark: {
    backgroundColor: 'rgba(170, 186, 248, 0.2)',
    borderColor: Theme.Colors.slate800,
  },
});

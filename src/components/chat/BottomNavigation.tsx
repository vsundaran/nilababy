import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/src/constants/Colors';


export interface BottomNavigationProps {
  activeTab: 'home' | 'chat' | 'community' | 'doctors' | 'profile';
  darkMode?: boolean;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ 
  activeTab = 'chat', 
  darkMode = false 
}) => {
  const insets = useSafeAreaInsets();
  const tabs = [
    { id: 'home', icon: 'home', label: 'Home' },
    { id: 'chat', icon: 'chat-bubble', label: 'Chat' },
    { id: 'community', icon: 'group', label: 'Community' },
    { id: 'doctors', icon: 'medical-services', label: 'Doctors' },
    { id: 'profile', icon: 'account-circle', label: 'Profile' },
  ] as const;

  return (
    <View style={[
      styles.container,
      { paddingBottom: Math.max(insets.bottom, 16) },
      darkMode ? styles.containerDark : styles.containerLight
    ]}>

      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity 
            key={tab.id} 
            style={styles.tab}
          >
            <MaterialIcons 
              name={tab.icon as any} 
              size={24} 
              color={isActive ? Colors.primary : Colors.slate400} 
            />

            <Text style={[
              styles.label,
              isActive ? styles.labelActive : styles.labelInactive,
              isActive && { fontWeight: '700' }
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    paddingHorizontal: 8,

    borderTopWidth: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  containerLight: {
    backgroundColor: Colors.white,
    borderTopColor: Colors.slate100,
  },
  containerDark: {
    backgroundColor: Colors.backgroundDark,
    borderTopColor: Colors.slate800,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
  },
  labelActive: {
    color: Colors.primary,
  },
  labelInactive: {
    color: Colors.slate400,
  },
});

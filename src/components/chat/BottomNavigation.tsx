import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '@/src/constants/Theme';


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
      { paddingBottom: Math.max(insets.bottom, 8) },
      darkMode ? styles.containerDark : styles.containerLight
    ]}>
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id;
        const isMiddle = index === 2; // "Chat" is the 3rd tab

        return (
          <TouchableOpacity 
            key={tab.id} 
            style={[
              styles.tab,
              isMiddle && styles.middleTab
            ]}
          >
            <View style={[
              isMiddle && styles.middleIconContainer,
              isMiddle && (isActive ? styles.middleIconActive : styles.middleIconInactive)
            ]}>
              <MaterialIcons 
                name={tab.icon as any} 
                size={isMiddle ? 28 : 24} 
                color={isMiddle ? Theme.Colors.white : (isActive ? Theme.Colors.primary : Theme.Colors.slate400)} 
              />
            </View>

            {!isMiddle && (
              <Text style={[
                styles.label,
                isActive ? styles.labelActive : styles.labelInactive,
                { fontFamily: isActive ? Theme.Typography.fontFamily.bold : Theme.Typography.fontFamily.medium }
              ]}>
                {tab.label}
              </Text>
            )}
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
    alignItems: 'flex-end',
    paddingTop: 8,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    
    // Shadow for premium feel
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 20,
  },
  containerLight: {
    backgroundColor: Theme.Colors.white,
    borderTopColor: Theme.Colors.slate100,
  },
  containerDark: {
    backgroundColor: Theme.Colors.slate900,
    borderTopColor: Theme.Colors.slate800,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    gap: 2,
  },
  middleTab: {
    height: 80,
    marginTop: -30,
    justifyContent: 'flex-start',
  },
  middleIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Theme.Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 4,
  },
  middleIconActive: {
    backgroundColor: Theme.Colors.primary,
  },
  middleIconInactive: {
    backgroundColor: Theme.Colors.slate400,
  },
  label: {
    fontSize: 10,
  },
  labelActive: {
    color: Theme.Colors.primary,
  },
  labelInactive: {
    color: Theme.Colors.slate400,
  },
});

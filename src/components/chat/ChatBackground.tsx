import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface ChatBackgroundProps {
  darkMode?: boolean;
}

const ICONS: (keyof typeof MaterialIcons.glyphMap)[] = [
  'child-care', 'toys', 'favorite', 'star', 'pets',
  'wb-sunny', 'cloud', 'local-florist', 'cake', 'coffee'
];

const { width, height } = Dimensions.get('window');

const SPACING = 80; // distance between icons

export const ChatBackground: React.FC<ChatBackgroundProps> = ({ darkMode = false }) => {
  const iconColor = darkMode
    ? 'rgba(255,255,255,0.03)'
    : 'rgba(0,0,0,0.04)';

  const icons = useMemo(() => {
    const rows = Math.ceil(height / SPACING) + 2;
    const cols = Math.ceil(width / SPACING) + 2;

    const data = [];

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const index = (row + col) % ICONS.length;

        data.push({
          id: `${row}-${col}`,
          name: ICONS[index],
          top: row * SPACING,
          left: col * SPACING,
          size: 18 + (index % 3) * 4, // slight variation
          rotation: (index % 4) * 15, // subtle rotation
        });
      }
    }

    return data;
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      {icons.map((icon) => (
        <View
          key={icon.id}
          style={[
            styles.iconWrapper,
            {
              top: icon.top,
              left: icon.left,
              transform: [{ rotate: `${icon.rotation}deg` }],
            },
          ]}
        >
          <MaterialIcons
            name={icon.name}
            size={icon.size}
            color={iconColor}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  iconWrapper: {
    position: 'absolute',
  },
});
import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Theme } from '../../constants/Theme';

export const TypingIndicator: React.FC<{ darkMode?: boolean }> = ({ darkMode }) => {
  const dot1 = new Animated.Value(0);
  const dot2 = new Animated.Value(0);
  const dot3 = new Animated.Value(0);

  useEffect(() => {
    const animateDot = (dot: Animated.Value, delay: number) => {
      return Animated.sequence([
        Animated.timing(dot, {
          toValue: -10,
          duration: 300,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(dot, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]);
    };

    Animated.loop(
      Animated.stagger(200, [
        animateDot(dot1, 0),
        animateDot(dot2, 0),
        animateDot(dot3, 0),
      ])
    ).start();
  }, []);

  const dotColor = darkMode ? '#A0A0A0' : '#8E8E93';

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#2C2C2E' : '#F2F2F7' }]}>
      <Animated.View style={[styles.dot, { backgroundColor: dotColor, transform: [{ translateY: dot1 }] }]} />
      <Animated.View style={[styles.dot, { backgroundColor: dotColor, transform: [{ translateY: dot2 }] }]} />
      <Animated.View style={[styles.dot, { backgroundColor: dotColor, transform: [{ translateY: dot3 }] }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginLeft: 16,
    marginBottom: 16,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

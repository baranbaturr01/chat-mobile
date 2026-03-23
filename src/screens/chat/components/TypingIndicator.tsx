import React, {memo, useEffect, useRef} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import {TypingEvent} from '../../../types/chat';
import {Colors, FontSize, Spacing} from '../../../constants/colors';

interface TypingIndicatorProps {
  typingUsers: TypingEvent[];
}

export const TypingIndicator = memo<TypingIndicatorProps>(({typingUsers}) => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (typingUsers.length === 0) {
      return;
    }

    const animate = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      );

    const a1 = animate(dot1, 0);
    const a2 = animate(dot2, 200);
    const a3 = animate(dot3, 400);

    a1.start();
    a2.start();
    a3.start();

    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
      dot1.setValue(0);
      dot2.setValue(0);
      dot3.setValue(0);
    };
  }, [typingUsers.length, dot1, dot2, dot3]);

  if (typingUsers.length === 0) {
    return null;
  }

  const label =
    typingUsers.length === 1
      ? `${typingUsers[0].username} is typing`
      : `${typingUsers.length} people are typing`;

  const dotStyle = (anim: Animated.Value) => ({
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -4],
        }),
      },
    ],
  });

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <View style={styles.dotsRow}>
          <Animated.View style={[styles.dot, dotStyle(dot1)]} />
          <Animated.View style={[styles.dot, dotStyle(dot2)]} />
          <Animated.View style={[styles.dot, dotStyle(dot3)]} />
        </View>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
});

TypingIndicator.displayName = 'TypingIndicator';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: Spacing.md,
    marginBottom: Spacing.xs,
    gap: Spacing.xs,
  },
  bubble: {
    backgroundColor: Colors.receivedBubble,
    borderRadius: 16,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.textSecondary,
  },
  label: {
    fontSize: FontSize.xs,
    color: Colors.textHint,
  },
});

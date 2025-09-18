import React from 'react';
import { View, StyleSheet } from 'react-native';
import { moodColors } from '../constants/theme';

interface PixelBackgroundProps {
  mood: 'happy' | 'cozy' | 'chill' | 'sad';
}

export default function PixelBackground({ mood }: PixelBackgroundProps) {
  const getBgColor = () => {
    switch(mood) {
      case 'happy': return '#FFF9C4';
      case 'cozy': return '#FFE0B2';
      case 'chill': return '#E1BEE7';
      case 'sad': return '#BBDEFB';
      default: return '#FFE0B2';
    }
  };

  return (
    <View style={[styles.background, { backgroundColor: getBgColor() }]} />
  );
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  }
});
import React, { useRef } from 'react';
import { View, TextInput, StyleSheet, PanResponder, Animated } from 'react-native';
import { moodColors } from '../constants/theme';
import { pixelTheme } from '../constants/theme';

export type MoodType = keyof typeof moodColors;

export interface Note {
  id: string;
  title: string;
  lyrics: string;
  mood: MoodType;
  position: {
    x: number;
    y: number;
  };
}

interface StickyNoteProps {
  note: Note;
  onUpdate: (note: Note) => void;
}

export default function StickyNote({ note, onUpdate }: StickyNoteProps) {
  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1.1,
          useNativeDriver: true,
        }),
        Animated.spring(opacity, {
          toValue: 0.9,
          useNativeDriver: true,
        }),
      ]).start();
    },
    onPanResponderMove: Animated.event(
      [null, { dx: pan.x, dy: pan.y }],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: () => {
      let newX = 0;
      let newY = 0;
      
      newX = (pan.x as any).__getValue();
      newY = (pan.y as any).__getValue();

      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.spring(opacity, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start();

      onUpdate({
        ...note,
        position: {
          x: newX + note.position.x,
          y: newY + note.position.y
        }
      });
      pan.setValue({ x: 0, y: 0 });
    }
  });
  
  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.note,
        styles.pixelBorder,
        { 
          backgroundColor: pixelTheme.colors[note.mood],
          transform: [
            ...pan.getTranslateTransform(),
            { scale }
          ],
          opacity,
          left: note.position.x,
          top: note.position.y
        }
      ]}
    >
      <View style={styles.noteContent}>
        <TextInput
          style={styles.titleInput}
          placeholder="♪ Song title"
          placeholderTextColor="rgba(0,0,0,0.5)"
          value={note.title}
          onChangeText={(text) => onUpdate({ ...note, title: text })}
        />
        <TextInput
          style={styles.lyricsInput}
          placeholder="✎ Add lyrics..."
          placeholderTextColor="rgba(0,0,0,0.4)"
          multiline
          value={note.lyrics}
          onChangeText={(text) => onUpdate({ ...note, lyrics: text })}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  note: {
    position: 'absolute',
    width: 160,
    backgroundColor: '#FFF',
  },
  noteContent: {
    padding: pixelTheme.spacing.md,
  },
  pixelBorder: {
    borderWidth: 4,
    borderColor: pixelTheme.colors.border,
    borderRadius: 0,
  },
  titleInput: {
    fontFamily: pixelTheme.fonts.pixel,
    fontSize: 14,
    color: pixelTheme.colors.border,
    marginBottom: pixelTheme.spacing.sm,
  },
  lyricsInput: {
    fontFamily: pixelTheme.fonts.pixel,
    fontSize: 12,
    color: pixelTheme.colors.border,
    minHeight: 60,
    lineHeight: 18,
  }
});
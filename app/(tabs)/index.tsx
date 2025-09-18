import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import PlaylistBoard from '../../components/PlaylistBoard';
import PixelBackground from '../../components/PixelBackground';
import { Note, MoodType } from '../../components/StickyNote';

export default function PlaylistScreen() {
  const [currentMood, setCurrentMood] = useState<MoodType>('cozy');
  const [notes, setNotes] = useState<Note[]>([]);

  return (
    <View style={styles.container}>
      <PixelBackground mood={currentMood} />
      <PlaylistBoard 
        notes={notes} 
        setNotes={setNotes}
        currentMood={currentMood}
        setCurrentMood={setCurrentMood}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
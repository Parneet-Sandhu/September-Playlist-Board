import React, { useState } from 'react';
import { 
  View, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  Modal,
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { pixelTheme, septemberThemes } from '../constants/theme';
import StickyNote, { Note, MoodType } from './StickyNote';

// Direct image imports
const autumnImage = require('../assets/images/themes/autumn-pixel.jpg');
const rainyImage = require('../assets/images/themes/rainy-pixel.jpg');
const studyImage = require('../assets/images/themes/study-pixel.jpg');
const sunsetImage = require('../assets/images/themes/sunset-pixel.jpg');

// Map theme keys to direct image imports
const themeImages = {
  autumn: autumnImage,
  lake: rainyImage,
  mountain: studyImage,
  sunset: sunsetImage
};

type ThemeKey = keyof typeof septemberThemes;

interface PlaylistBoardProps {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  currentMood: MoodType;
  setCurrentMood: (mood: MoodType) => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PlaylistBoard({ notes, setNotes, currentMood, setCurrentMood }: PlaylistBoardProps) {
  const [selectedTheme, setSelectedTheme] = useState<ThemeKey>('autumn');
  const [showThemeModal, setShowThemeModal] = useState(false);

  const handleAddNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: '',
      lyrics: '',
      mood: currentMood,
      position: { x: 50, y: 50 }
    };
    setNotes([...notes, newNote]);
  };

  const handleUpdateNote = (updatedNote: Note) => {
    const updatedNotes = notes.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    );
    setNotes(updatedNotes);
  };

  const validMoods = Object.keys(pixelTheme.colors).filter(
    (key): key is MoodType => key !== 'background' && key !== 'border'
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Hello September</Text>
          <TouchableOpacity 
            onPress={() => setShowThemeModal(true)}
            style={[styles.settingsButton, styles.pixelBorder]}
          >
            <Ionicons name="images-outline" size={24} color={pixelTheme.colors.border} />
          </TouchableOpacity>
        </View>
        <View style={[styles.imageContainer, styles.pixelBorder]}>
          <Image 
            source={themeImages[selectedTheme]}
            style={[styles.themeImage, styles.imageWithBorder]}
            resizeMode="cover"
          />
        </View>
      </View>

      <Modal
        visible={showThemeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowThemeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.pixelBorder]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choose Theme</Text>
              <TouchableOpacity 
                onPress={() => setShowThemeModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={pixelTheme.colors.border} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.themeList}>
              {Object.entries(septemberThemes).map(([key, theme]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.themeOption,
                    styles.pixelBorder,
                    selectedTheme === key && styles.selectedTheme
                  ]}
                  onPress={() => {
                    setSelectedTheme(key as ThemeKey);
                    setShowThemeModal(false);
                  }}
                >
                  <Image 
                    source={themeImages[key as keyof typeof themeImages]}
                    style={[styles.themeOptionImage, styles.imageWithBorder]}
                    resizeMode="cover"
                  />
                  <View style={styles.themeInfo}>
                    <Text style={styles.themeName}>{theme.name}</Text>
                    <Text style={styles.themeDescription}>{theme.description}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.addButton, styles.pixelBorder]}
          onPress={handleAddNote}
        >
          <Text style={styles.buttonText}>+ ADD SONG</Text>
        </TouchableOpacity>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.moodScroller}
          contentContainerStyle={styles.moodContainer}
        >
          {validMoods.map(mood => (
            <TouchableOpacity
              key={mood}
              style={[
                styles.moodButton,
                styles.pixelBorder,
                { backgroundColor: pixelTheme.colors[mood] },
                currentMood === mood && styles.activeMood
              ]}
              onPress={() => setCurrentMood(mood)}
            >
              <Text style={styles.moodText}>{mood.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.notesContainer}>
        {notes.map(note => (
          <StickyNote
            key={note.id}
            note={note}
            onUpdate={handleUpdateNote}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: pixelTheme.colors.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: pixelTheme.spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: pixelTheme.spacing.md,
  },
  title: {
    fontFamily: pixelTheme.fonts.pixel,
    fontSize: 24,
    color: pixelTheme.colors.border,
  },
  settingsButton: {
    padding: pixelTheme.spacing.sm,
    backgroundColor: '#FFF',
  },
  imageContainer: {
    width: '100%',
    height: 160,
    overflow: 'hidden',
    backgroundColor: '#FFF',
  },
  themeImage: {
    width: '100%',
    height: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: SCREEN_WIDTH * 0.9,
    maxHeight: '80%',
    backgroundColor: '#FFF',
    padding: pixelTheme.spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: pixelTheme.spacing.lg,
  },
  modalTitle: {
    fontFamily: pixelTheme.fonts.pixel,
    fontSize: 20,
    color: pixelTheme.colors.border,
  },
  closeButton: {
    padding: pixelTheme.spacing.xs,
  },
  themeList: {
    flex: 1,
  },
  themeOption: {
    marginBottom: pixelTheme.spacing.md,
    backgroundColor: '#FFF',
    overflow: 'hidden',
  },
  themeOptionImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#e0e0e0', // Light gray background as fallback
  },
  imageWithBorder: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  themeInfo: {
    padding: pixelTheme.spacing.md,
  },
  themeName: {
    fontFamily: pixelTheme.fonts.pixel,
    fontSize: 14,
    color: pixelTheme.colors.border,
    marginBottom: pixelTheme.spacing.xs,
  },
  themeDescription: {
    fontFamily: pixelTheme.fonts.pixel,
    fontSize: 10,
    color: '#666',
  },
  selectedTheme: {
    borderColor: pixelTheme.colors.border,
    borderWidth: 4,
    transform: [{ translateY: -4 }],
  },
  controls: {
    padding: pixelTheme.spacing.md,
  },
  addButton: {
    backgroundColor: pixelTheme.colors.border,
    padding: pixelTheme.spacing.md,
    alignItems: 'center',
    marginBottom: pixelTheme.spacing.md,
  },
  buttonText: {
    fontFamily: pixelTheme.fonts.pixel,
    color: '#FFF',
    fontSize: 14,
  },
  moodScroller: {
    flexGrow: 0,
  },
  moodContainer: {
    paddingRight: pixelTheme.spacing.md,
  },
  moodButton: {
    padding: pixelTheme.spacing.sm,
    marginRight: pixelTheme.spacing.sm,
    minWidth: 100,
    alignItems: 'center',
  },
  moodText: {
    fontFamily: pixelTheme.fonts.pixel,
    fontSize: 12,
    color: pixelTheme.colors.border,
  },
  activeMood: {
    transform: [{ translateY: -4 }],
    borderWidth: 4,
  },
  pixelBorder: {
    borderWidth: 4,
    borderColor: pixelTheme.colors.border,
    borderRadius: 0,
  },
  notesContainer: {
    flex: 1,
    padding: pixelTheme.spacing.md,
  }
});
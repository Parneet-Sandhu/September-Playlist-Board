import React, { useState } from 'react';
import { 
  View, 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  Modal,
  Dimensions,
  Platform,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { pixelTheme } from '../constants/theme';
import StickyNote, { Note, MoodType } from './StickyNote';

// Updated image imports with fallback handling - matching your actual files
const getImageSource = (imageName: string) => {
  try {
    switch(imageName) {
      case 'autumn-pixel':
        return require('../assets/images/themes/autumn-pixel.jpg');
      case 'rainy-pixel':
        return require('../assets/images/themes/rainy-pixel.jpg');
      case 'study-pixel':
        return require('../assets/images/themes/study-pixel.jpg');
      case 'sunset-pixel':
        return require('../assets/images/themes/sunset-pixel.jpg');
      case 'coffee-pixel':
        return require('../assets/images/themes/coffee-pixel.jpg');
      case 'cozy-room-pixel':
        return require('../assets/images/themes/cozy-room-pixel.jpg');
      case 'dorm-pixel':
        return require('../assets/images/themes/dorm-pixel.jpg');
      case 'library-pixel':
        return require('../assets/images/themes/library-pixel.jpg');
      default:
        return null;
    }
  } catch (error) {
    console.log(`Image ${imageName} not found, using fallback`);
    return null;
  }
};

// Enhanced theme configuration - matching all your available images
const enhancedSeptemberThemes = {
  autumn: {
    name: 'Golden Autumn',
    description: 'Crisp leaves and warm sunlight',
    image: 'autumn-pixel',
    backgroundColor: '#FFF4E6',
    accent: '#D2691E'
  },
  rainy: {
    name: 'Rainy Study Day',
    description: 'Cozy indoor vibes with raindrops',
    image: 'rainy-pixel',
    backgroundColor: '#E6F3FF',
    accent: '#4682B4'
  },
  sunset: {
    name: 'September Sunset',
    description: 'Golden hour magic',
    image: 'sunset-pixel',
    backgroundColor: '#FFF0E6',
    accent: '#FF6347'
  },
  study: {
    name: 'Late Night Study',
    description: 'Focused midnight sessions',
    image: 'study-pixel',
    backgroundColor: '#F0E6FF',
    accent: '#9370DB'
  },
  coffee: {
    name: 'Coffee Shop',
    description: 'Warm lattes and lo-fi beats',
    image: 'coffee-pixel',
    backgroundColor: '#F4E4BC',
    accent: '#8B4513'
  },
  cozyRoom: {
    name: 'Cozy Bedroom',
    description: 'Warm blankets and fairy lights',
    image: 'cozy-room-pixel',
    backgroundColor: '#FFE6E6',
    accent: '#CD5C5C'
  },
  dorm: {
    name: 'Dorm Room',
    description: 'College vibes and late nights',
    image: 'dorm-pixel',
    backgroundColor: '#E6E6FA',
    accent: '#6A5ACD'
  },
  library: {
    name: 'Quiet Library',
    description: 'Peaceful reading corner',
    image: 'library-pixel',
    backgroundColor: '#E6F0E6',
    accent: '#228B22'
  }
};

type ThemeKey = keyof typeof enhancedSeptemberThemes;

interface PlaylistBoardProps {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  currentMood: MoodType;
  setCurrentMood: (mood: MoodType) => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Sample September-coded song suggestions
const septemberSongSuggestions = [
  { title: "Wake Me Up When September Ends", artist: "Green Day", mood: "sad" as MoodType },
  { title: "September", artist: "Earth, Wind & Fire", mood: "happy" as MoodType },
  { title: "All Too Well", artist: "Taylor Swift", mood: "sad" as MoodType },
  { title: "Autumn Leaves", artist: "Nat King Cole", mood: "cozy" as MoodType },
  { title: "October", artist: "Broken Bells", mood: "chill" as MoodType },
  { title: "Harvest Moon", artist: "Neil Young", mood: "cozy" as MoodType }
];

export default function PlaylistBoard({ notes, setNotes, currentMood, setCurrentMood }: PlaylistBoardProps) {
  const [selectedTheme, setSelectedTheme] = useState<ThemeKey>('autumn');
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showSongSuggestions, setShowSongSuggestions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleAddNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: '',
      lyrics: '',
      mood: currentMood,
      position: { x: Math.random() * 200 + 50, y: Math.random() * 200 + 50 }
    };
    setNotes([...notes, newNote]);
  };

  const fetchItunesPreview = async (title: string, artist?: string) => {
    try {
      const term = encodeURIComponent(artist ? `${title} ${artist}` : title);
      const url = `https://itunes.apple.com/search?term=${term}&media=music&limit=1`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const t = data.results[0];
        return {
          previewUrl: t.previewUrl as string | undefined,
          trackUrl: t.trackViewUrl as string | undefined,
          artworkUrl: t.artworkUrl100 as string | undefined
        };
      }
    } catch (e) {
      // ignore
    }
    return { previewUrl: undefined, trackUrl: undefined, artworkUrl: undefined };
  };

  const handleAddSuggestedSong = async (song: typeof septemberSongSuggestions[0]) => {
    const extra = await fetchItunesPreview(song.title, song.artist);
    const newNote: Note = {
      id: Date.now().toString(),
      title: `${song.title} - ${song.artist}`,
      lyrics: 'Add your favorite lyrics here...',
      mood: song.mood,
      position: { x: Math.random() * 200 + 50, y: Math.random() * 200 + 50 },
      previewUrl: extra.previewUrl
    };
    setNotes([...notes, newNote]);
    setShowSongSuggestions(false);
  };

  const searchItunes = async () => {
    try {
      setIsSearching(true);
      const term = encodeURIComponent(searchQuery.trim());
      const url = `https://itunes.apple.com/search?term=${term}&media=music&limit=25`;
      const res = await fetch(url);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (e) {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddFromSearch = (track: any) => {
    const title = `${track.trackName} - ${track.artistName}`;
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      lyrics: 'Add your favorite lyrics here...',
      mood: currentMood,
      position: { x: Math.random() * 200 + 50, y: Math.random() * 200 + 50 },
      previewUrl: track.previewUrl
    };
    setNotes([...notes, newNote]);
    setShowSongSuggestions(false);
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleUpdateNote = (updatedNote: Note) => {
    const updatedNotes = notes.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    );
    setNotes(updatedNotes);
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };

  const validMoods = Object.keys(pixelTheme.colors).filter(
    (key): key is MoodType => key !== 'background' && key !== 'border'
  );

  const currentTheme = enhancedSeptemberThemes[selectedTheme];
  const imageSource = getImageSource(currentTheme.image);

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.backgroundColor }]}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Hello September</Text>
            <Text style={styles.subtitle}>{currentTheme.name}</Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              onPress={() => setShowSongSuggestions(true)}
              style={[styles.headerButton, styles.pixelBorder, { backgroundColor: currentTheme.accent }]}
            >
              <Ionicons name="musical-notes" size={16} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setShowThemeModal(true)}
              style={[styles.headerButton, styles.pixelBorder]}
            >
              <Ionicons name="images-outline" size={16} color={pixelTheme.colors.border} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={[styles.imageContainer, styles.pixelBorder]}>
          {imageSource ? (
            <Image 
              source={imageSource}
              style={styles.themeImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.fallbackImage, { backgroundColor: currentTheme.accent }]}>
              <Text style={styles.fallbackText}>{currentTheme.name}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Song Suggestions Modal */}
      <Modal
        visible={showSongSuggestions}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSongSuggestions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.pixelBorder]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Music</Text>
              <TouchableOpacity 
                onPress={() => setShowSongSuggestions(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={pixelTheme.colors.border} />
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={[styles.searchBar, styles.pixelBorder]}>
              <Ionicons name="search" size={18} color={pixelTheme.colors.border} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search songs or artists"
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
                onSubmitEditing={searchItunes}
              />
              <TouchableOpacity style={[styles.searchButton, styles.pixelBorder]} onPress={searchItunes}>
                {isSearching ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.searchButtonText}>SEARCH</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <ScrollView style={styles.resultsList} showsVerticalScrollIndicator={false}>
                {searchResults.map((track: any) => (
                  <TouchableOpacity
                    key={track.trackId}
                    style={[styles.resultRow, styles.pixelBorder]}
                    onPress={() => handleAddFromSearch(track)}
                  >
                    {track.artworkUrl60 ? (
                      <Image source={{ uri: track.artworkUrl60 }} style={styles.resultArtwork} />
                    ) : (
                      <View style={[styles.resultArtwork, { backgroundColor: '#CCC' }]} />
                    )}
                    <View style={styles.resultInfo}>
                      <Text style={styles.resultTitle} numberOfLines={1}>{track.trackName}</Text>
                      <Text style={styles.resultSubtitle} numberOfLines={1}>{track.artistName}</Text>
                    </View>
                    <View style={[styles.addResultButton, styles.pixelBorder]}>
                      <Text style={styles.addResultText}>ADD</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {/* Suggestions Divider */}
            <Text style={styles.sectionDivider}>Or pick a September suggestion</Text>

            <ScrollView style={styles.suggestionsList} showsVerticalScrollIndicator={false}>
              {septemberSongSuggestions.map((song, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.songSuggestion,
                    styles.pixelBorder,
                    { backgroundColor: pixelTheme.colors[song.mood] }
                  ]}
                  onPress={() => handleAddSuggestedSong(song)}
                >
                  <Text style={styles.songTitle}>{song.title}</Text>
                  <Text style={styles.songArtist}>{song.artist}</Text>
                  <Text style={styles.songMood}>{song.mood.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Theme Selection Modal */}
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
            <ScrollView style={styles.themeList} showsVerticalScrollIndicator={false}>
              {Object.entries(enhancedSeptemberThemes).map(([key, theme]) => {
                const themeImageSource = getImageSource(theme.image);
                return (
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
                    {themeImageSource ? (
                      <Image 
                        source={themeImageSource}
                        style={styles.themeOptionImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={[styles.themeOptionImage, { backgroundColor: theme.accent }]}>
                        <Text style={styles.fallbackThemeText}>{theme.name}</Text>
                      </View>
                    )}
                    <View style={styles.themeInfo}>
                      <Text style={styles.themeName}>{theme.name}</Text>
                      <Text style={styles.themeDescription}>{theme.description}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <View style={styles.controls}>
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.addButton, styles.pixelBorder, { backgroundColor: currentTheme.accent }]}
            onPress={handleAddNote}
          >
            <Text style={styles.buttonText}>+ ADD SONG</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.clearButton, styles.pixelBorder]}
            onPress={() => setNotes([])}
          >
            <Text style={[styles.buttonText, { color: pixelTheme.colors.border }]}>CLEAR ALL</Text>
          </TouchableOpacity>
        </View>

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
        {notes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              🎵 Your September playlist is empty
            </Text>
            <Text style={styles.emptyStateSubtext}>
              Add some songs to get started!
            </Text>
          </View>
        ) : (
          notes.map(note => (
            <StickyNote
              key={note.id}
              note={note}
              onUpdate={handleUpdateNote}
              onDelete={() => handleDeleteNote(note.id)}
            />
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 20,
    color: pixelTheme.colors.border,
    flexShrink: 1,
  },
  subtitle: {
    fontFamily: pixelTheme.fonts.pixel,
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
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
  fallbackImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    fontFamily: pixelTheme.fonts.pixel,
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
  },
  fallbackThemeText: {
    fontFamily: pixelTheme.fonts.pixel,
    fontSize: 12,
    color: '#FFF',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: SCREEN_WIDTH * 0.9,
    maxHeight: SCREEN_HEIGHT * 0.8,
    backgroundColor: '#FFF',
    padding: pixelTheme.spacing.md,
    alignSelf: 'center',
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
  suggestionsList: {
    maxHeight: SCREEN_HEIGHT * 0.6,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: pixelTheme.spacing.sm,
    paddingVertical: pixelTheme.spacing.xs,
    marginBottom: pixelTheme.spacing.md,
    backgroundColor: '#FFF',
  },
  searchInput: {
    flex: 1,
    marginLeft: pixelTheme.spacing.sm,
    fontFamily: pixelTheme.fonts.pixel,
    fontSize: 12,
    color: pixelTheme.colors.border,
  },
  searchButton: {
    backgroundColor: '#3F51B5',
    paddingHorizontal: pixelTheme.spacing.sm,
    paddingVertical: pixelTheme.spacing.xs,
    marginLeft: pixelTheme.spacing.sm,
  },
  searchButtonText: {
    color: '#FFF',
    fontFamily: pixelTheme.fonts.pixel,
    fontSize: 10,
  },
  resultsList: {
    maxHeight: SCREEN_HEIGHT * 0.35,
    marginBottom: pixelTheme.spacing.md,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: pixelTheme.spacing.sm,
    backgroundColor: '#FFF',
    marginBottom: pixelTheme.spacing.sm,
  },
  resultArtwork: {
    width: 40,
    height: 40,
    marginRight: pixelTheme.spacing.sm,
    backgroundColor: '#EEE',
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    fontFamily: pixelTheme.fonts.pixel,
    fontSize: 12,
    color: pixelTheme.colors.border,
  },
  resultSubtitle: {
    fontFamily: pixelTheme.fonts.pixel,
    fontSize: 10,
    color: '#666',
  },
  addResultButton: {
    paddingHorizontal: pixelTheme.spacing.sm,
    paddingVertical: pixelTheme.spacing.xs,
    backgroundColor: '#4CAF50',
  },
  addResultText: {
    fontFamily: pixelTheme.fonts.pixel,
    fontSize: 10,
    color: '#FFF',
  },
  sectionDivider: {
    fontFamily: pixelTheme.fonts.pixel,
    fontSize: 10,
    color: '#999',
    marginBottom: pixelTheme.spacing.sm,
    textAlign: 'center',
  },
  songSuggestion: {
    padding: pixelTheme.spacing.md,
    marginBottom: pixelTheme.spacing.sm,
  },
  songTitle: {
    fontFamily: pixelTheme.fonts.pixel,
    fontSize: 14,
    color: pixelTheme.colors.border,
    marginBottom: 4,
  },
  songArtist: {
    fontFamily: pixelTheme.fonts.pixel,
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  songMood: {
    fontFamily: pixelTheme.fonts.pixel,
    fontSize: 10,
    color: '#999',
  },
  themeList: {
    maxHeight: SCREEN_HEIGHT * 0.6,
  },
  themeOption: {
    marginBottom: pixelTheme.spacing.md,
    backgroundColor: '#FFF',
    overflow: 'hidden',
  },
  themeOptionImage: {
    width: '100%',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
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
  buttonRow: {
    flexDirection: 'row',
    gap: pixelTheme.spacing.sm,
    marginBottom: pixelTheme.spacing.md,
  },
  addButton: {
    flex: 1,
    padding: pixelTheme.spacing.md,
    alignItems: 'center',
  },
  clearButton: {
    padding: pixelTheme.spacing.md,
    paddingHorizontal: pixelTheme.spacing.lg,
    backgroundColor: '#FFF',
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
    borderWidth: 4,
    borderColor: pixelTheme.colors.border,
  },
  pixelBorder: {
    borderWidth: 4,
    borderColor: pixelTheme.colors.border,
    borderRadius: 0,
  },
  notesContainer: {
    flex: 1,
    padding: pixelTheme.spacing.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontFamily: pixelTheme.fonts.pixel,
    fontSize: 16,
    color: pixelTheme.colors.border,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontFamily: pixelTheme.fonts.pixel,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  }
});
import React, { useRef, useState } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  PanResponder, 
  Animated, 
  TouchableOpacity,
  Linking,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  youtubeUrl?: string;
  spotifyUrl?: string;
}

interface StickyNoteProps {
  note: Note;
  onUpdate: (note: Note) => void;
  onDelete?: () => void;
}

export default function StickyNote({ note, onUpdate, onDelete }: StickyNoteProps) {
  const pan = useRef(new Animated.ValueXY()).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const [isEditing, setIsEditing] = useState(false);
  const [showActions, setShowActions] = useState(false);
  
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => !isEditing,
    onPanResponderGrant: () => {
      setShowActions(false);
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
          x: Math.max(0, Math.min(300, newX + note.position.x)),
          y: Math.max(0, Math.min(500, newY + note.position.y))
        }
      });
      pan.setValue({ x: 0, y: 0 });
    }
  });

  const handleLongPress = () => {
    setShowActions(!showActions);
  };

  const handleOpenUrl = (url: string) => {
    if (url) {
      Linking.openURL(url).catch(() => {
        Alert.alert('Error', 'Could not open the link');
      });
    }
  };

  const extractYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleUrlChange = (text: string, type: 'youtube' | 'spotify') => {
    if (type === 'youtube') {
      onUpdate({ ...note, youtubeUrl: text });
    } else {
      onUpdate({ ...note, spotifyUrl: text });
    }
  };

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
          top: note.position.y,
          zIndex: isEditing ? 1000 : 1
        }
      ]}
    >
      {/* Action Buttons */}
      {showActions && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => setIsEditing(!isEditing)}
          >
            <Ionicons 
              name={isEditing ? "checkmark" : "create-outline"} 
              size={14} 
              color="#FFF" 
            />
          </TouchableOpacity>
          {onDelete && (
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={onDelete}
            >
              <Ionicons name="trash-outline" size={14} color="#FFF" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Main Content */}
      <View style={styles.noteContent}>
        <TouchableOpacity 
          onLongPress={handleLongPress}
          style={styles.titleContainer}
        >
          <TextInput
            style={styles.titleInput}
            placeholder="♪ Song title"
            placeholderTextColor="rgba(0,0,0,0.5)"
            value={note.title}
            onChangeText={(text) => onUpdate({ ...note, title: text })}
            editable={isEditing}
            multiline
          />
        </TouchableOpacity>

        <TextInput
          style={styles.lyricsInput}
          placeholder="✎ Add lyrics or notes..."
          placeholderTextColor="rgba(0,0,0,0.4)"
          multiline
          value={note.lyrics}
          onChangeText={(text) => onUpdate({ ...note, lyrics: text })}
          editable={isEditing}
        />

        {/* URL Inputs - only show when editing */}
        {isEditing && (
          <View style={styles.urlSection}>
            <View style={styles.urlInputContainer}>
              <Ionicons name="logo-youtube" size={16} color="#FF0000" />
              <TextInput
                style={styles.urlInput}
                placeholder="YouTube URL"
                placeholderTextColor="rgba(0,0,0,0.4)"
                value={note.youtubeUrl || ''}
                onChangeText={(text) => handleUrlChange(text, 'youtube')}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            <View style={styles.urlInputContainer}>
              <Ionicons name="musical-note" size={16} color="#1DB954" />
              <TextInput
                style={styles.urlInput}
                placeholder="Spotify URL"
                placeholderTextColor="rgba(0,0,0,0.4)"
                value={note.spotifyUrl || ''}
                onChangeText={(text) => handleUrlChange(text, 'spotify')}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>
        )}

        {/* Play Buttons - show when URLs are available and not editing */}
        {!isEditing && (note.youtubeUrl || note.spotifyUrl) && (
          <View style={styles.playButtons}>
            {note.youtubeUrl && isValidUrl(note.youtubeUrl) && (
              <TouchableOpacity
                style={[styles.playButton, styles.youtubeButton]}
                onPress={() => handleOpenUrl(note.youtubeUrl!)}
              >
                <Ionicons name="logo-youtube" size={16} color="#FFF" />
              </TouchableOpacity>
            )}
            {note.spotifyUrl && isValidUrl(note.spotifyUrl) && (
              <TouchableOpacity
                style={[styles.playButton, styles.spotifyButton]}
                onPress={() => handleOpenUrl(note.spotifyUrl!)}
              >
                <Ionicons name="musical-note" size={16} color="#FFF" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Mood Indicator */}
      <View style={[styles.moodIndicator, { backgroundColor: pixelTheme.colors[note.mood] }]}>
        <View style={styles.moodDot} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  note: {
    position: 'absolute',
    width: 180,
    backgroundColor: '#FFF',
    minHeight: 120,
  },
  noteContent: {
    padding: pixelTheme.spacing.md,
  },
  pixelBorder: {
    borderWidth: 4,
    borderColor: pixelTheme.colors.border,
    borderRadius: 0,
  },
  titleContainer: {
    marginBottom: pixelTheme.spacing.sm,
  },
  titleInput: {
    fontFamily: pixelTheme.fonts.pixel,
    fontSize: 14,
    color: pixelTheme.colors.border,
    fontWeight: 'bold',
  },
  lyricsInput: {
    fontFamily: pixelTheme.fonts.pixel,
    fontSize: 11,
    color: pixelTheme.colors.border,
    minHeight: 50,
    lineHeight: 16,
  },
  urlSection: {
    marginTop: pixelTheme.spacing.sm,
    paddingTop: pixelTheme.spacing.sm,
    borderTopWidth: 2,
    borderTopColor: '#E0E0E0',
  },
  urlInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: pixelTheme.spacing.xs,
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  urlInput: {
    flex: 1,
    fontFamily: pixelTheme.fonts.pixel,
    fontSize: 10,
    color: pixelTheme.colors.border,
    marginLeft: 8,
    paddingVertical: 2,
  },
  playButtons: {
    flexDirection: 'row',
    marginTop: pixelTheme.spacing.sm,
    gap: 8,
  },
  playButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: pixelTheme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  youtubeButton: {
    backgroundColor: '#FF0000',
  },
  spotifyButton: {
    backgroundColor: '#1DB954',
  },
  actionButtons: {
    position: 'absolute',
    top: -12,
    right: -12,
    flexDirection: 'row',
    gap: 4,
    zIndex: 10,
  },
  actionButton: {
    width: 24,
    height: 24,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: pixelTheme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  moodIndicator: {
    position: 'absolute',
    bottom: -8,
    left: -8,
    width: 16,
    height: 16,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: pixelTheme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodDot: {
    width: 6,
    height: 6,
    backgroundColor: pixelTheme.colors.border,
    borderRadius: 0,
  }
});

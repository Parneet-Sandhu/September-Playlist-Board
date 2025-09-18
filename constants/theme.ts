// Enhanced theme configuration for Pixel September Playlist Board

export const moodColors = {
  happy: '#FFD54F',    // Bright yellow
  cozy: '#FFAB40',     // Warm orange
  chill: '#CE93D8',    // Soft purple
  sad: '#90CAF9',      // Light blue
};

export const pixelTheme = {
  colors: {
    background: '#FFF8E1',
    border: '#2E2E2E',
    ...moodColors,
  },
  fonts: {
    pixel: 'PressStart2P',
    mono: 'Courier New',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
};

// Enhanced September themes with more variety
export const septemberThemes = {
  autumn: {
    name: 'Golden Autumn',
    description: 'Crisp leaves and warm sunlight',
    backgroundColor: '#FFF4E6',
    accent: '#D2691E',
    image: 'autumn-pixel.jpg'
  },
  rainy: {
    name: 'Rainy Study Day', 
    description: 'Cozy indoor vibes with raindrops',
    backgroundColor: '#E6F3FF',
    accent: '#4682B4',
    image: 'rainy-pixel.jpg'
  },
  sunset: {
    name: 'September Sunset',
    description: 'Golden hour magic',
    backgroundColor: '#FFF0E6', 
    accent: '#FF6347',
    image: 'sunset-pixel.jpg'
  },
  study: {
    name: 'Late Night Study',
    description: 'Focused midnight sessions',
    backgroundColor: '#F0E6FF',
    accent: '#9370DB',
    image: 'study-pixel.jpg'
  },
  cozyRoom: {
    name: 'Cozy Bedroom',
    description: 'Warm blankets and fairy lights',
    backgroundColor: '#FFE6E6',
    accent: '#CD5C5C',
    image: 'cozy-room-pixel.jpg'
  },
  library: {
    name: 'Quiet Library',
    description: 'Peaceful reading corner',
    backgroundColor: '#E6F0E6',
    accent: '#228B22',
    image: 'library-pixel.jpg'
  },
  coffee: {
    name: 'Coffee Shop',
    description: 'Warm lattes and lo-fi beats',
    backgroundColor: '#F4E4BC',
    accent: '#8B4513',
    image: 'coffee-pixel.jpg'
  },
  dorm: {
    name: 'Dorm Room',
    description: 'College vibes and late nights',
    backgroundColor: '#E6E6FA',
    accent: '#6A5ACD',
    image: 'dorm-pixel.jpg'
  }
};

// Color scheme for light/dark mode support
export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: '#0a7ea4',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#0a7ea4',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: '#fff',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
  },
};

// Font configuration
export const Fonts = {
  pixel: 'PressStart2P',
  rounded: 'System',
  mono: 'Courier New',
};

// September-coded song database for suggestions
export const septemberSongs = [
  {
    title: "Wake Me Up When September Ends",
    artist: "Green Day",
    mood: "sad" as keyof typeof moodColors,
    genre: "Alternative Rock",
    lyrics: "Summer has come and passed, the innocent can never last...",
    youtubeId: "rdpBZ5_b48g"
  },
  {
    title: "September",
    artist: "Earth, Wind & Fire", 
    mood: "happy" as keyof typeof moodColors,
    genre: "Funk/Soul",
    lyrics: "Do you remember the 21st night of September?",
    youtubeId: "Gs069dndIYk"
  },
  {
    title: "All Too Well",
    artist: "Taylor Swift",
    mood: "sad" as keyof typeof moodColors,
    genre: "Pop/Country",
    lyrics: "And you call me up again just to break me like a promise...",
    youtubeId: "tollGa3S0o8"
  },
  {
    title: "Autumn Leaves",
    artist: "Nat King Cole",
    mood: "cozy" as keyof typeof moodColors,
    genre: "Jazz",
    lyrics: "The falling leaves drift by the window...",
    youtubeId: "r-Z8KuwI7Gc"
  },
  {
    title: "October",
    artist: "Broken Bells",
    mood: "chill" as keyof typeof moodColors,
    genre: "Indie Pop",
    lyrics: "Realize you're getting older and it's a brand new world...",
    youtubeId: "PC6d7ZIivQA"
  },
  {
    title: "Harvest Moon",
    artist: "Neil Young",
    mood: "cozy" as keyof typeof moodColors,
    genre: "Folk Rock",
    lyrics: "Come a little bit closer, hear what I have to say...",
    youtubeId: "n2MtEsrcTTs"
  },
  {
    title: "Golden",
    artist: "Harry Styles",
    mood: "happy" as keyof typeof moodColors,
    genre: "Pop Rock",
    lyrics: "Golden, golden, golden as I open my eyes...",
    youtubeId: "P3cffdsEXXw"
  },
  {
    title: "Cigarette Daydreams",
    artist: "Cage The Elephant",
    mood: "chill" as keyof typeof moodColors,
    genre: "Alternative Rock", 
    lyrics: "Did you stand there all alone? Oh I cannot explain what's going down...",
    youtubeId: "opeETnB8m8w"
  },
  {
    title: "Cornelia Street",
    artist: "Taylor Swift",
    mood: "cozy" as keyof typeof moodColors,
    genre: "Pop",
    lyrics: "We were in the backseat, drunk on something stronger than the drinks in the bar...",
    youtubeId: "VikHepMHTCo"
  },
  {
    title: "Vienna",
    artist: "Billy Joel",
    mood: "chill" as keyof typeof moodColors,
    genre: "Piano Rock",
    lyrics: "Slow down you crazy child, you're so ambitious for a juvenile...",
    youtubeId: "oZdiXvDU4P0"
  }
];

// Mood-based emoji and descriptions
export const moodConfig = {
  happy: {
    emoji: "☀️",
    description: "Upbeat and energetic",
    keywords: ["joyful", "bright", "energetic", "positive"]
  },
  cozy: {
    emoji: "🍂", 
    description: "Warm and comfortable",
    keywords: ["warm", "comfortable", "intimate", "peaceful"]
  },
  chill: {
    emoji: "🌙",
    description: "Relaxed and dreamy", 
    keywords: ["calm", "dreamy", "mellow", "atmospheric"]
  },
  sad: {
    emoji: "💙",
    description: "Melancholic and reflective",
    keywords: ["melancholic", "emotional", "introspective", "bittersweet"]
  }
};

export default {
  moodColors,
  pixelTheme,
  septemberThemes,
  Colors,
  Fonts,
  septemberSongs,
  moodConfig
};
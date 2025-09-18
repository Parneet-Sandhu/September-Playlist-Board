const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};

export const moodColors = {
  happy: '#FFD700',
  cozy: '#FF8C00',
  chill: '#9370DB',
  sad: '#4682B4'
} as const; 

export const pixelTheme = {
  fonts: {
    pixel: 'PressStart2P',
  },
  colors: {
    happy: '#FFE664', // Warmer pixel yellow
    cozy: '#FF9C57', // Warmer pixel orange
    chill: '#B39DDB', // Softer pixel purple
    sad: '#81D4FA', // Brighter pixel blue
    background: '#FFF5E6', // Warm background
    border: '#2A2A2A', // Dark pixel borders
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  }
};

export const septemberThemes = {
  autumn: {
    image: require('../assets/images/themes/autumn-pixel.jpg'),
    name: 'Autumn Lake',
    description: 'Peaceful lake with fall colors',
    colors: { primary: '#FFB74D' }
  },
  lake: {
    image: require('../assets/images/themes/rainy-pixel.jpg'),
    name: 'Rainy Day',
    description: 'Cozy rainy afternoon',
    colors: { primary: '#81D4FA' }
  },
  mountain: {
    image: require('../assets/images/themes/study-pixel.jpg'),
    name: 'Mountain Study',
    description: 'Quiet study spot in the mountains',
    colors: { primary: '#B39DDB' }
  },
  sunset: {
    image: require('../assets/images/themes/sunset-pixel.jpg'),
    name: 'September Sunset',
    description: 'Warm evening vibes',
    colors: { primary: '#FFE082' }
  },
} as const;

export type ThemeId = keyof typeof septemberThemes;


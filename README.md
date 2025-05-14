# MoodWise

MoodWise is a personal informatics app that helps users track their daily mood, physical activities, and weather conditions to gain insights into their well-being and discover patterns that affect their emotional state.

## Features

- Track daily mood (morning and evening)
- Log physical activities from predefined options or create custom ones
- Record weather conditions
- View mood trends and statistics with interactive visualizations
- Calendar view of mood history
- Streak tracking for consistent mood logging
- Detailed analytics showing correlations between activities, weather, and mood

## Tech Stack

- React Native with Expo
- React Navigation for routing (Native Stack and Bottom Tabs)
- React Native Calendars for calendar functionality
- React Native Gifted Charts for data visualization
- Lucide React Native for icons
- React Native Animatable for animations
- AsyncStorage for local data persistence
- Expo Linear Gradient for gradient UI elements

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npx expo start
   ```

3. Install Expo Go on your phone from Google Play or Apple Store
4. Run:
   - Scan the QR code with the Expo Go app

## Project Structure

```
MoodWise/
├── app/
│   ├── src/
│   │   ├── components/    # Reusable UI components and charts
│   │   ├── screens/       # Main app screens (Home, Calendar, Stats, Settings)
│   │   ├── data/          # Sample data and app constants
│   │   ├── utils/         # Utility functions
│   │   ├── constants/     # UI constants and styles
│   │   └── navigation/    # Navigation configuration
│   ├── assets/            # App images and resources
│   └── App.js             # Main entry point
└── package.json          # Project dependencies
```

## Contributing

This is an MVP (Minimum Viable Product) version. Feel free to contribute by opening issues or submitting pull requests.

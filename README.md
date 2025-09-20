# Sportify - Cross-Platform Sports App

A modern **mobile-first** cross-platform sports application built with Expo SDK 54, featuring real-time updates, beautiful UI components, and comprehensive state management. Optimized for mobile devices while providing excellent web support.

## 🚀 Tech Stack

- **Core Framework**: Expo SDK 54
- **Routing**: Expo Router (with native tabs and stack navigation)
- **UI Components**: Gluestack UI (formerly NativeBase)
- **Layout System**: Tamagui
- **State Management**: Redux Toolkit + Axios
- **Real-Time Communication**: Socket.IO Client
- **Icons**: Expo Vector Icons
- **Animations**: React Native Reanimated + Gesture Handler
- **Build Tools**: EAS Build
- **Type Checking**: TypeScript
- **Code Quality**: ESLint + Prettier

## 📱 Mobile-First Design

This application is designed with a **mobile-first approach**, ensuring optimal performance and user experience on smartphones and tablets. The responsive design automatically adapts to different screen sizes:

- **Mobile**: < 768px (Primary focus)
- **Tablet**: 768px - 1024px (Enhanced layout)
- **Desktop/Web**: > 1024px (Full web experience)

## 🌐 Web Support

While mobile-first, the app provides excellent web support with:

- Responsive design that adapts to desktop screens
- Web-optimized navigation and interactions
- Static site generation for fast loading
- Progressive Web App (PWA) capabilities
- Cross-browser compatibility

## 📱 Features

- **Real-time Sports Updates**: Live scores and match updates via Socket.IO
- **Modern UI**: Beautiful, responsive design with Gluestack UI and Tamagui
- **Cross-Platform**: Works on iOS, Android, and Web
- **Type Safety**: Full TypeScript support with strict type checking
- **State Management**: Centralized state with Redux Toolkit
- **Navigation**: Native-like navigation with Expo Router
- **Animations**: Smooth animations with Reanimated and Gesture Handler

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sportify
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## 📁 Project Structure

```
sportify/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Home screen
│   │   ├── explore.tsx    # Explore screen
│   │   └── profile.tsx    # Profile screen
│   └── _layout.tsx         # Root layout
├── src/
│   ├── components/        # Reusable UI components
│   ├── screens/           # Screen components
│   ├── store/             # Redux store configuration
│   │   ├── slices/        # Redux slices
│   │   └── api/           # RTK Query API
│   ├── services/          # API and Socket services
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── assets/                # Images and static assets
└── config files           # ESLint, Prettier, TypeScript, etc.
```

## 🚀 Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run on web browser
- `npm run web:build` - Build static web version
- `npm run web:serve` - Serve built web version locally
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking
- `npm run build:all` - Build for all platforms (EAS)
- `npm run build:android` - Build Android app (EAS)
- `npm run build:ios` - Build iOS app (EAS)
- `npm run build:web` - Build web version

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
API_BASE_URL=https://api.sportify.com/v1
SOCKET_URL=https://api.sportify.com
```

### EAS Build

Configure EAS Build for production builds:

```bash
npm install -g eas-cli
eas login
eas build:configure
```

## 📱 Building for Production

### Android

```bash
eas build --platform android --profile production
```

### iOS

```bash
eas build --platform ios --profile production
```

### Web

```bash
npm run web
```

## 🎨 UI Components & Responsive Design

The app uses Gluestack UI for consistent, accessible components and Tamagui for advanced layout capabilities. All components are fully typed and customizable.

### Responsive Features:
- **Mobile-first design** with progressive enhancement
- **Adaptive layouts** that work on all screen sizes
- **Platform-specific optimizations** for iOS, Android, and Web
- **Touch-friendly interfaces** optimized for mobile interaction
- **Web-optimized navigation** with larger touch targets on desktop

## 🔄 State Management

The app uses Redux Toolkit for state management with:
- **Auth Slice**: User authentication state
- **Sports Slice**: Teams, matches, and favorites
- **API Slice**: RTK Query for server state management

## 🌐 Real-Time Features

Socket.IO integration provides:
- Live match updates
- Real-time score changes
- Push notifications
- Connection status management

## 📝 Code Quality

- **ESLint**: Code linting with React Native specific rules
- **Prettier**: Code formatting
- **TypeScript**: Strict type checking
- **Path Aliases**: Clean imports with `@/` aliases

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.

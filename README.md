# FAMLY APP

A family connection platform built with React Native and Expo, allowing families to connect with other families.

## Technology Stack

- **React Native** with **Expo** - Cross-platform mobile and web development
- **TypeScript** - Type-safe development
- **Web Support** - Test and deploy to web (Vercel) before iOS App Store deployment

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (optional, but recommended)

### Installation

```bash
npm install
```

### Running the App

#### Web (for testing before deployment)
```bash
npm run web
```

#### iOS Simulator
```bash
npm run ios
```

#### Android Emulator
```bash
npm run android
```

#### Development Server
```bash
npm start
```

## Project Structure

```
famly-app/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # Screen components
│   ├── navigation/     # Navigation setup
│   ├── services/       # API and backend services
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   └── contexts/       # React contexts for state management
├── assets/             # Images, fonts, and other assets
├── App.tsx             # Main app component
└── app.json            # Expo configuration
```

## Development

The app is set up to test on web locally before deploying to Vercel. This allows for rapid iteration and testing.

## Deployment

### Web (Vercel)
- Build: `npx expo export:web`
- Deploy to Vercel (configured via Vercel dashboard)

### iOS App Store
- Build using Expo Application Services (EAS)
- Submit through App Store Connect

## License

Private project



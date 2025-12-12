# Project Structure

This document outlines the structure and organization of the FAMLY APP codebase.

## Directory Structure

```
famly-app/
├── src/
│   ├── components/      # Reusable UI components
│   │   └── (components will be organized by feature or type)
│   ├── screens/         # Screen components (one per screen)
│   │   └── (screens will be organized by feature)
│   ├── navigation/      # Navigation configuration
│   │   └── (navigation setup, routes, etc.)
│   ├── services/        # API and backend services
│   │   └── (API clients, service layers)
│   ├── types/           # TypeScript type definitions
│   │   └── (shared types, interfaces, enums)
│   ├── utils/           # Utility functions
│   │   ├── config.ts    # Environment configuration
│   │   └── (helper functions, formatters, validators)
│   └── contexts/        # React contexts for state management
│       └── (global state, auth context, etc.)
├── assets/              # Images, fonts, and other static assets
├── App.tsx              # Main app component
├── app.json             # Expo configuration
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── .eslintrc.js         # ESLint configuration
├── .prettierrc          # Prettier configuration
└── README.md            # Project documentation
```

## Naming Conventions

### Files and Directories
- **Components**: PascalCase (e.g., `Button.tsx`, `FamilyCard.tsx`)
- **Screens**: PascalCase (e.g., `LoginScreen.tsx`, `HomeScreen.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`, `validateEmail.ts`)
- **Types**: PascalCase (e.g., `User.ts`, `Family.ts`)
- **Services**: camelCase (e.g., `authService.ts`, `apiService.ts`)

### Code Style
- Use TypeScript for all new files
- Follow ESLint and Prettier configurations
- Use functional components with hooks
- Prefer named exports for components
- Use default exports sparingly (mainly for screens)

## Development Workflow

### Running the App
```bash
# Start development server
npm start

# Run on web
npm run web

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

### Code Quality
```bash
# Lint code
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Environment Variables
- Copy `.env.example` to `.env` for local development
- Use `EXPO_PUBLIC_` prefix for variables that should be accessible in the app
- Access variables via `src/utils/config.ts`

## Adding New Features

1. **New Screen**: Create in `src/screens/` and add route in `src/navigation/`
2. **New Component**: Create in `src/components/` (organize by feature if needed)
3. **New Service**: Create in `src/services/` and add types in `src/types/`
4. **New Utility**: Add to `src/utils/` if it's a general utility, or co-locate with feature

## Best Practices

- Keep components small and focused
- Use TypeScript types for all props and data structures
- Handle loading and error states
- Follow React Native best practices for performance
- Test on both web and mobile during development
- Document complex logic and business rules



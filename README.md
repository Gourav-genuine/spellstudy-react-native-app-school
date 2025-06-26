# SpellStudy School Mobile App

A comprehensive React Native mobile application for school management, built to replicate all features of the SpellStudy web frontend.

## Current Status

✅ **Basic Setup Complete** - The foundation has been established with:

- React Native app structure
- Expo SDK 53 integration
- Essential dependencies installed
- Navigation framework ready
- State management with Recoil configured
- Basic UI components planned

🚧 **In Development** - Core features are being implemented:

- Authentication system
- Dashboard with statistics
- Student management
- Class management
- Staff management
- Fee management
- Reports and analytics

## Features

### 🏫 Complete School Management

- **Dashboard**: Overview statistics and quick actions
- **Student Management**: Add, edit, view student records
- **Class Management**: Organize classes and sections
- **Staff Management**: Manage teaching and non-teaching staff
- **Fee Management**: Handle fee collection and tracking
- **Attendance**: Mark and track daily attendance
- **Timetable**: Manage class schedules
- **Exams**: Schedule and manage examinations
- **Reports**: Generate analytics and reports
- **Notifications**: Real-time alerts and messages

### 🔐 Authentication & Security

- Secure login with JWT tokens
- Role-based access control
- Biometric authentication support
- Session management

### 📱 Mobile-First Design

- Responsive layouts for all screen sizes
- Native mobile components
- Optimized performance
- Offline data caching

### 🎨 Modern UI/UX

- Material Design components
- Dark/Light theme support
- Smooth animations
- Intuitive navigation

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation v6
- **State Management**: Recoil
- **UI Components**: React Native Paper
- **Icons**: React Native Vector Icons
- **Charts**: Victory Native & React Native Chart Kit
- **Storage**: AsyncStorage
- **HTTP Client**: Fetch API
- **Notifications**: Expo Notifications

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Quick Start

1. **Navigate to the app directory**

   ```bash
   cd spellstudy-react-native-app-school
   ```

2. **Install dependencies** (already done)

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Run on device/simulator**
   - Scan the QR code with Expo Go app on your phone
   - Or press 'i' for iOS simulator
   - Or press 'a' for Android emulator

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
API_BASE_URL=http://localhost:5000
APP_ENV=development
```

### Backend Integration

This app is designed to work with the SpellStudy backend API. Ensure your backend server is running and accessible.

## Project Structure (Planned)

```
spellstudy-react-native-app-school/
├── App.js                          # Main app component
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
├── babel.config.js                 # Babel configuration (to be created)
├── metro.config.js                 # Metro bundler config (to be created)
├── components/                     # Reusable components (created)
│   ├── navigation/                 # Navigation components (created)
│   ├── state/                      # Recoil state atoms (created)
│   └── ui/                         # UI components (created)
├── screens/                        # Screen components (created)
├── services/                       # API services (created)
├── utils/                          # Utility functions (created)
├── constants/                      # App constants (created)
└── assets/                         # Images, fonts, etc.
```

## Features to be Implemented

### 🔐 Authentication & Security

- [x] Basic structure
- [ ] Login screen with JWT tokens
- [ ] Role-based access control
- [ ] Session management

### 🏫 School Management Features

- [x] Dashboard structure
- [ ] Student Management (Add, edit, view records)
- [ ] Class Management (Organize classes and sections)
- [ ] Staff Management (Teaching and non-teaching staff)
- [ ] Fee Management (Fee collection and tracking)
- [ ] Attendance (Mark and track daily attendance)
- [ ] Timetable (Manage class schedules)
- [ ] Exams (Schedule and manage examinations)
- [ ] Reports (Analytics and reports)
- [ ] Notifications (Real-time alerts)

### 📱 Mobile Features

- [x] Responsive design foundation
- [ ] Offline data caching
- [ ] Push notifications
- [ ] Dark/Light theme support

## Current Dependencies

### Core Dependencies

- **expo**: ~53.0.12 - Expo SDK
- **react**: 19.0.0 - React library
- **react-native**: 0.79.4 - React Native framework

### Navigation

- **@react-navigation/native**: ^6.1.18 - Navigation library
- **@react-navigation/bottom-tabs**: ^6.6.1 - Bottom tab navigation
- **@react-navigation/stack**: ^6.3.5 - Stack navigation
- **@react-navigation/drawer**: ^6.7.2 - Drawer navigation

### State Management & UI

- **recoil**: ^0.7.7 - State management
- **react-native-paper**: ^5.12.0 - Material Design components
- **react-native-vector-icons**: ^10.2.0 - Icon library
- **@react-native-async-storage/async-storage**: ^1.23.1 - Local storage

### Additional Utilities

- **react-native-toast-message**: ^2.2.1 - Toast notifications

## Next Steps

1. **Complete Navigation Setup**

   - Implement authentication flow
   - Create screen navigation structure
   - Add role-based navigation

2. **Implement Core Screens**

   - Login/Authentication screens
   - Dashboard with real data
   - Student management screens
   - Class and staff management

3. **Add Backend Integration**

   - API service implementation
   - State management with real data
   - Error handling and loading states

4. **Enhanced Features**
   - Add more UI components
   - Implement offline functionality
   - Add push notifications
   - Create reports and analytics

## Backend Integration

This app is designed to work with the SpellStudy backend API. The API service structure is already created and ready for integration once the backend endpoints are available.

### Environment Configuration

Create a `.env` file based on `.env.example`:

```env
API_BASE_URL=http://localhost:5000
APP_ENV=development
```

## Development

The app is currently in the foundation phase. All the core structure, navigation, state management, and service layers have been planned and partially implemented.

To continue development:

1. **Test the current setup**: Run `npm start` and verify the basic app loads
2. **Implement authentication**: Complete the login flow
3. **Add screens gradually**: Start with the dashboard and student management
4. **Integrate with backend**: Connect to the SpellStudy API

## Architecture

The app follows React Native best practices:

- Component-based architecture
- Centralized state management with Recoil
- Service layer for API calls
- Modular navigation structure
- Responsive design patterns

## Contributing

This is a foundational setup. The next steps involve implementing the planned features and connecting to the backend API.

For questions or contributions:

- Review the existing structure in `/components`, `/screens`, and `/services`
- Follow the established patterns for new features
- Test thoroughly on both iOS and Android

---

**Status**: Foundation complete, ready for feature development
**Next Milestone**: Complete authentication and dashboard implementation

## User Roles & Permissions

The app supports different user roles with varying access levels:

- **Super Admin**: Full access to all features
- **Admin**: Administrative access
- **Principal**: School management access
- **Teacher**: Student and class management
- **Accountant**: Fee management focus
- **Staff**: Limited access

## Features by Screen

### Dashboard

- Overview statistics
- Quick action buttons
- Recent activity feed
- Navigation shortcuts

### Students

- Student list with search/filter
- Add new students
- View/edit student details
- Attendance tracking
- Fee status

### Classes

- Class management
- Section organization
- Timetable integration
- Student assignments

### Staff

- Staff directory
- Role management
- Contact information
- Performance tracking

### Fees

- Fee collection
- Payment tracking
- Receipt generation
- Outstanding reports

## Development

### Code Style

- ESLint configuration included
- Prettier for code formatting
- Follow React Native best practices

### State Management

- Recoil atoms for global state
- Local state for component-specific data
- Persistent storage with AsyncStorage

### Navigation

- Stack navigation for hierarchical screens
- Tab navigation for main sections
- Drawer navigation for additional features

## Building for Production

### Android

```bash
# Build APK
npm run build:android

# Build AAB for Play Store
npm run build:android:bundle
```

### iOS

```bash
# Build for iOS
npm run build:ios
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For support and questions:

- Email: support@spellstudy.com
- Documentation: [docs.spellstudy.com](https://docs.spellstudy.com)

## License

This project is proprietary software. All rights reserved.

---

Built with ❤️ for modern school management

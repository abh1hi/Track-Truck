# Track Truck - Fleet Tracking Platform

A comprehensive fleet tracking platform with real-time GPS monitoring capabilities for both fleet owners and employees.

## Project Overview

Track Truck consists of two main applications:
- **Employee Mobile App**: Simple interface for employees to toggle GPS tracking
- **Owner Dashboard**: Web-based dashboard for fleet owners to monitor their vehicles in real-time

## Tech Stack

- **Frontend**: Vue.js 3 (Owner Dashboard)
- **Mobile Apps**: Capacitor by Ionic (Android/iOS)
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Real-time Communication**: Socket.io
- **Maps**: OpenStreetMap with Leaflet.js
- **Authentication**: JWT-based authentication

## Features

### Employee App
- ✅ Simple one-button GPS tracking toggle
- ✅ Background location tracking
- ✅ Battery optimization
- ✅ Online/offline status

### Owner Dashboard
- ✅ Real-time fleet location monitoring
- ✅ Interactive map with employee markers
- ✅ Employee management and status tracking
- ✅ Location history and analytics
- ✅ Geofencing and alerts

## Project Structure

```
Track-Truck/
├── backend/              # Node.js/Express backend
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication & validation
│   ├── socket/          # Socket.io handlers
│   └── config/          # Database & app configuration
├── owner-dashboard/      # Vue.js web dashboard
│   ├── src/
│   ├── components/
│   └── views/
├── employee-app/         # Capacitor mobile app
│   ├── src/
│   ├── android/
│   └── ios/
└── docs/                # Documentation
```

## Development Phases

- **Phase 1**: Project Foundation & Backend API ✅
- **Phase 2**: Employee Mobile App Development 🚧
- **Phase 3**: Owner Dashboard Development 📋
- **Phase 4**: Real-time Features & Testing 📋
- **Phase 5**: Deployment & Launch 📋

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB
- Vue CLI
- Capacitor CLI
- Android Studio (for Android builds)
- Xcode (for iOS builds)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/abh1hi/Track-Truck.git
cd Track-Truck
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install dashboard dependencies:
```bash
cd ../owner-dashboard
npm install
```

4. Install mobile app dependencies:
```bash
cd ../employee-app
npm install
```

### Environment Setup

Create `.env` files in respective directories with required environment variables.

## Development Commands

### Backend
```bash
cd backend
npm run dev    # Start development server
npm run test   # Run tests
```

### Owner Dashboard
```bash
cd owner-dashboard
npm run serve  # Start development server
npm run build  # Build for production
```

### Employee Mobile App
```bash
cd employee-app
npm run serve          # Start in browser
ionic capacitor run android  # Run on Android
ionic capacitor run ios      # Run on iOS
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Privacy & Security

This application handles sensitive location data. Please ensure compliance with local privacy laws and regulations when deploying in production.

## Support

For questions and support, please open an issue in this repository.

---

**Note**: This project is currently under active development. Features and APIs may change.

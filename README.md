# Dorm Booking System - UI

A modern, student-friendly homepage UI for a dormitory booking platform built with Next.js 14, TypeScript, and TailwindCSS.

## 🚀 Features

- **Modern Design**: Clean, youthful interface designed for university students
- **Responsive Layout**: Mobile-first design that works on all devices
- **Dark Mode**: Toggle between light and dark themes
- **Interactive Components**: 
  - Sticky navigation with smooth scroll effects
  - Advanced search bar with filters
  - Animated room cards with hover effects
  - Gradient buttons and modern UI elements
- **Dorms List Page**: Complete dormitory browsing with map integration
- **Google Maps Integration**: Interactive map view with custom markers
- **Advanced Filtering**: Filter by building, gender, room type, and price
- **Accessibility**: Built with accessibility best practices
- **TypeScript**: Full type safety throughout the application

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **Maps**: Google Maps JavaScript API (@react-google-maps/api)
- **Fonts**: Inter & Poppins (Google Fonts)

## 📦 Installation

1. Navigate to the UI directory:
   ```bash
   cd UI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Google Maps API key:
   ```bash
   # Create .env.local file
   echo "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-api-key-here" > .env.local
   ```
   
   Get your API key from [Google Cloud Console](https://console.cloud.google.com/google/maps-apis) and enable:
   - Maps JavaScript API
   - Places API (optional)
   - Geocoding API (optional)

## 🗺️ Google Maps Integration

The application includes interactive Google Maps integration for viewing dormitory locations.

### Quick Setup

1. **Get Google Maps API Key**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable **Maps JavaScript API**
   - Create API Key in **APIs & Services** > **Credentials**

2. **Configure Environment**:
   ```bash
   # Create .env.local file in UI/ directory
   echo "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-actual-api-key-here" > .env.local
   ```

3. **Restart Development Server**:
   ```bash
   npm run dev
   ```

4. **Test Integration**:
   - Visit `/maps-demo` for Google Maps demo
   - Visit `/buildings` and switch to "Map" view

### Features Included

- ✅ **Interactive Google Maps** with custom markers
- ✅ **Info Windows** with dormitory information  
- ✅ **Map Controls** (zoom, fullscreen)
- ✅ **Responsive Design** for mobile/desktop
- ✅ **Dark Mode Support**
- ✅ **Error Handling** for missing API key
- ✅ **Loading States**

### Detailed Setup Guide

For complete setup instructions, see:
- `docs/GOOGLE_MAPS_SETUP.md` - Detailed setup guide
- `GOOGLE_MAPS_README.md` - Quick reference
- `/maps-demo` - Interactive demo page

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎨 Design Features

### Color Palette
- **Primary**: Blue gradient (#3B82F6 to #8B5CF6)
- **Secondary**: Purple accents
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- **Primary Font**: Inter (clean, modern)
- **Display Font**: Poppins (headings, emphasis)
- **Responsive**: Scales beautifully across devices

### Components
- **Cards**: Rounded corners, soft shadows, hover effects
- **Buttons**: Gradient backgrounds, smooth transitions
- **Forms**: Clean inputs with focus states
- **Navigation**: Sticky header with smooth scrolling

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: 
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
- **Grid System**: Flexible layouts that adapt to screen size
- **Touch Friendly**: Large tap targets for mobile users

## 🌙 Dark Mode

- **Automatic Detection**: Respects system preference
- **Manual Toggle**: User can override system setting
- **Persistent**: Remembers user choice across sessions
- **Smooth Transitions**: Animated theme switching

## 🚀 Performance

- **Next.js 14**: Latest features and optimizations
- **Image Optimization**: Automatic image optimization
- **Code Splitting**: Automatic code splitting
- **Lazy Loading**: Components load as needed
- **SEO Optimized**: Meta tags and structured data

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Project Structure

```
UI/
├── app/                 # Next.js 14 App Router
│   ├── page.tsx        # Homepage
│   ├── buildings/      # Buildings pages
│   └── globals.css     # Global styles
├── components/         # React components
│   ├── ui/            # Reusable UI components
│   ├── Navbar.tsx     # Navigation component
│   ├── Footer.tsx     # Footer component
│   └── ...
├── lib/               # Utility functions
├── types/             # TypeScript type definitions
├── constants/         # Application constants
├── services/          # Data services
├── hooks/             # Custom React hooks
└── docs/              # Documentation
```

## 🎯 Key Pages

- **Homepage** (`/`): Hero section, featured dorms, features
- **Buildings** (`/buildings`): List of all dormitory buildings
- **Building Detail** (`/buildings/[id]`): Individual building information
- **Rooms** (`/buildings/[id]/rooms`): Rooms within a building
- **Room Detail** (`/rooms/[id]`): Individual room information and booking

## 🛡️ Error Handling

- **Error Boundaries**: Graceful error handling
- **Loading States**: User-friendly loading indicators
- **Fallback UI**: Meaningful error messages
- **Retry Mechanisms**: Automatic retry for failed requests

## 📊 Data Management

- **Mock Data Service**: Comprehensive mock data for development
- **Type Safety**: Full TypeScript coverage
- **Custom Hooks**: Reusable state management
- **Local Storage**: Persistent user preferences

## 🎨 Customization

### Colors
Modify `tailwind.config.js` to change the color palette:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      }
    }
  }
}
```

### Fonts
Update `app/layout.tsx` to use different fonts:

```typescript
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- **Email**: support@dormbooking.com
- **Phone**: 028 1234 5678
- **Documentation**: See `docs/` folder

---

Built with ❤️ for university students

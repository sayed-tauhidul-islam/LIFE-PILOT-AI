# Life Pilot AI - Feature Guide

## ✨ New Features Added

### 1. Navigation Bar

The application now includes a comprehensive navigation bar with the following features:

#### Left Side - Menu Icon

Click the menu icon (☰) to access:

- **Settings**: Configure your application preferences
- **Theme Selector**: Choose between three themes:
  - 🌞 **Light Theme**: White background with black text
  - 🌙 **Dark Theme**: Dark gray background with white text
  - 💙 **Blue Theme**: Blue background with white text
- **Logout**: Sign out of your account

#### Center - Quick Navigation

Quick links to all sections:

- **AI Advice**: View AI-powered daily recommendations
- **Weather**: Check weather conditions and activity suggestions
- **Prayer Times**: View daily Islamic prayer times
- **Financial**: Access financial tips and budget analysis
- **Routine**: See your personalized daily routine
- **Tasks**: Manage your daily tasks

#### Right Side - User Profile

- **Profile Icon**: Circular user icon with your initial
- **Dropdown Menu**: Access to:
  - View Profile
  - Edit Profile
  - Account Settings

### 2. Prayer Times Feature

A dedicated prayer times section showing:

- **Five Daily Prayers**:
  - Fajr (Dawn)
  - Dhuhr (Noon)
  - Asr (Afternoon)
  - Maghrib (Sunset)
  - Isha (Night)
- **Next Prayer Indicator**: Highlights the upcoming prayer
- **Countdown Timer**: Shows time remaining until next prayer
- **Location Display**: Shows your city and country

### 3. Theme System

Three beautiful themes to customize your experience:

#### Light Theme (Default)

- White background
- Black text
- Red accents for important information
- Perfect for daytime use

#### Dark Theme

- Dark gray/black background
- White text
- Red accents maintained
- Easy on the eyes at night

#### Blue Theme

- Deep blue background
- White text
- Red accents for highlights
- Professional and calming

**Theme Persistence**: Your selected theme is saved and will persist across sessions.

### 4. Responsive Design

- **Desktop**: Full navigation bar with all options visible
- **Mobile**: Compact navigation with responsive buttons
- **Touch-Friendly**: All buttons are optimized for touch screens

## 🗄️ Database Structure

### MongoDB Collections

1. **users**: User profiles and preferences
2. **routines**: Daily routines (student/professional/family)
3. **meetings**: Scheduled meetings and events
4. **expenses**: Financial transactions and expenses
5. **tasks**: Daily tasks and to-dos
6. **prayer_times**: Prayer times based on location

### Database Initialization

Run the database initialization script:

```bash
init-database.bat
```

This will:

1. Create all necessary collections
2. Set up validation rules
3. Create indexes for performance
4. Optionally load sample data

## 🎨 Theme Usage

### Switching Themes

1. Click the **menu icon (☰)** in the top-left corner
2. Look for the **Theme** section in the dropdown
3. Click on your desired theme:
   - Light Theme
   - Dark Theme
   - Blue Theme

### Theme Features

- Instant theme switching
- No page reload required
- Theme saved automatically
- All sections adapt to theme colors

## 🕌 Prayer Times Usage

### Viewing Prayer Times

1. Scroll to the **Prayer Times** card or
2. Click **Prayer Times** in the navigation bar

### Features

- Current prayer highlighted in red
- Countdown to next prayer
- All five daily prayers displayed
- Location-based timings

### Customization

Prayer times are calculated based on your location settings in your user profile.

## 📱 Mobile Experience

The navbar automatically adapts for mobile devices:

- Hamburger menu for settings
- Horizontal scrolling navigation buttons
- Touch-optimized button sizes
- Responsive layout adjustments

## 🔐 User Profile Management

### Profile Information

- Name
- Age
- Monthly Income
- Family Size
- Location (for prayer times)

### Profile Actions

Access from the profile dropdown:

- **View Profile**: See your complete profile
- **Edit Profile**: Update your information
- **Account Settings**: Manage account preferences

## 💡 Tips for Best Experience

1. **Set Your Location**: Add your city and country for accurate prayer times
2. **Choose Your Theme**: Select a theme that suits your environment
3. **Use Quick Navigation**: Click navbar links to jump to specific sections
4. **Check Daily**: Review AI recommendations each morning
5. **Mobile Friendly**: Access from any device, anywhere

## 🚀 Getting Started

1. Fill in your profile information
2. Select your preferred theme
3. Review the AI recommendations
4. Check your prayer times
5. Monitor your financial tips
6. Optimize your daily routine

## 📊 Dashboard Sections

All sections are accessible via navbar:

### 🤖 AI Advice

- Today's prioritized tasks
- Personalized recommendations
- Weather-based suggestions

### ☀️ Weather

- Current weather conditions
- Temperature
- Activity suggestions

### 🕌 Prayer Times

- Five daily prayers
- Next prayer countdown
- Location-based timings

### 💰 Financial

- Budget alerts
- Spending analysis
- Saving tips

### ⚡ Routine

- Sleep pattern analysis
- Daily routine optimization
- Productivity tips

### 📋 Tasks

- Morning tasks
- Afternoon tasks
- Evening tasks

## 🎯 Features in Development

- Calendar integration
- Real-time weather API
- Advanced AI recommendations
- Goal tracking
- Social features
- Expense OCR scanning
- Mobile app

---

**Need Help?** Check the README.md for technical details or contact support.

**Version**: 1.0.0
**Last Updated**: January 25, 2026

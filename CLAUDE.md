# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Watermark Camera Pro** application - a professional watermark tool for engineering/construction documentation. It's a React + TypeScript single-page application built with Vite that allows users to upload photos and overlay customizable information watermarks (e.g., time, weather, location). The app includes optional AI-powered image analysis via Google Gemini API to auto-populate watermark fields.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
tsc && vite build

# Preview production build
npm run preview
```

## Environment Setup

Create a `.env.local` file with your Gemini API key:
```
GEMINI_API_KEY=your_api_key_here
```

Note: The Gemini API integration is optional. The app works without it, but won't have AI-powered image analysis features.

## Architecture

### Core Structure

- **App.tsx** - Main application component containing all UI and state management
  - Manages watermark data (title + customizable items) and styling (colors, fonts, opacity, layout)
  - State persists to localStorage for user convenience
  - Auto-updates timestamp field on mount
  - Renders a two-pane layout: controls sidebar (left) and canvas preview (right)

- **types.ts** - TypeScript definitions
  - `WatermarkData`: Contains title and array of `WatermarkItem[]` (id, label, value)
  - `WatermarkStyle`: All styling parameters (colors, opacity, fonts, scale factors)

- **utils/canvasUtils.ts** - Canvas rendering logic
  - `drawWatermarkedImage()`: Core function that draws original image + watermark overlay
  - Watermark is a rounded rectangle box positioned at bottom-left
  - Header section (colored, shows title with yellow dot indicator)
  - Body section (semi-transparent white, shows label-value rows with text wrapping)
  - Font rendering supports CJK characters with custom font families and weights

- **services/geminiService.ts** - AI integration (optional)
  - `analyzeImageContext()`: Sends image to Gemini API for analysis
  - Returns estimated weather and location based on image content
  - Auto-populates watermark fields by matching labels (heuristic: contains "气"/"weather" or "点"/"location")

### Key Features

1. **Fully Customizable Watermark**
   - Dynamic header/body colors, opacity, text colors
   - Independent font family and weight selection for header and body
   - Scalable box width and font sizes
   - Add/remove/edit watermark rows

2. **Canvas-Based Rendering**
   - High-quality output matching original image resolution
   - Text wrapping for long content
   - Rounded corners with shadow effects

3. **State Persistence**
   - localStorage saves user's watermark data and style preferences
   - Timestamp auto-updates on app load

4. **PWA Support**
   - Configured with vite-plugin-pwa for offline usage
   - Manifest targets mobile/portrait orientation

## Important Implementation Details

### API Key Handling
The `geminiService.ts` uses a helper function `getApiKey()` that checks both Vite's `import.meta.env.VITE_API_KEY` and `process.env.API_KEY`. The vite.config.ts defines `process.env.API_KEY` for build-time injection.

### Font Rendering
The app supports multiple font families including Chinese fonts (Microsoft YaHei, SimHei, KaiTi, SimSun). Font weight toggle works by checking if current weight is bold-like (600/700/bold) and toggling to 400 or 700.

### Canvas Text Wrapping
Character-by-character splitting is used for better CJK text wrapping (`text.split("")` instead of word-based splitting).

### Timestamp Format
Auto-generated timestamp format: `YYYY.MM.DD HH:MM`

## File Organization

```
/
├── App.tsx                 # Main UI component
├── index.tsx              # React entry point
├── types.ts               # TypeScript interfaces
├── services/
│   └── geminiService.ts   # AI image analysis
├── utils/
│   └── canvasUtils.ts     # Canvas rendering utilities
├── vite.config.ts         # Vite + PWA configuration
├── tsconfig.json          # TypeScript config (strict mode enabled)
└── package.json           # Dependencies and scripts
```

## Dependencies

**Core:**
- React 18.3 + React DOM
- TypeScript 5.6 (strict mode)
- Vite 5.4

**UI/Icons:**
- lucide-react (icon library)
- Tailwind CSS (via inline classes)

**AI/PWA:**
- @google/genai (Gemini API client)
- vite-plugin-pwa (Progressive Web App support)

# AGENTS.md

This file provides guidance for AI agents working in this repository.

## Project Overview

**Watermark Camera Pro** - A React + TypeScript single-page application built with Vite for adding customizable watermarks to images. Features AI-powered image analysis via Google Gemini API.

## Build Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production (runs TypeScript check first)
npm run build

# Preview production build
npm run preview

# Lint code (ESLint + Prettier)
npm run lint

# Auto-format code
npm run format

# Run tests
npm run test

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage
```

TypeScript type checking is enforced during build (`tsc && vite build`).

## Test Files

- `src/hooks/useWatermarkStore.test.ts` - Zustand store tests
- `src/components/App.test.tsx` - Component rendering tests
- `tests/setup.ts` - Vitest configuration and mocks

## Project Structure

```
src/
├── components/          # UI components
│   ├── CanvasPreview.tsx    # Canvas preview and download
│   ├── ControlPanel.tsx     # Image upload controls
│   ├── DataEditor.tsx       # Watermark content editing
│   ├── StyleEditor.tsx      # Style configuration
│   └── index.ts
├── constants/           # Constants and defaults
│   └── defaultConfig.ts
├── hooks/               # Custom hooks and state
│   └── useWatermarkStore.ts # Zustand store
├── types/               # TypeScript types
│   └── index.ts
├── utils/               # Utility functions
│   └── canvasUtils.ts
├── App.tsx              # Main app component
└── index.tsx            # Entry point
```

## State Management

Uses **Zustand** for state management. Access state and actions via `useWatermarkStore`:

```typescript
import { useWatermarkStore } from './hooks/useWatermarkStore';

const { imageSrc, data, style, setImageSrc, updateStyle } = useWatermarkStore();
```

## Code Style Guidelines

### TypeScript

- Strict mode enabled (`strict: true` in tsconfig.json)
- No unused locals or parameters allowed
- Enable `noFallthroughCasesInSwitch: true`
- Use interface declarations for data types (see `src/types/index.ts`)
- Prefer named exports for types: `export interface WatermarkItem { ... }`

### Naming Conventions

- **Components**: PascalCase (e.g., `App`, `CanvasPreview`)
- **Variables/Functions**: camelCase (e.g., `generateId`, `handleItemChange`)
- **Constants**: SCREAMING_SNAKE_CASE for static values (e.g., `DEFAULT_DATA`)
- **Files**: kebab-case for utilities (e.g., `canvasUtils.ts`), PascalCase for components
- **Interfaces**: PascalCase with descriptive names (e.g., `WatermarkData`, `WatermarkStyle`)

### React Components

- Use `React.FC<Props>` for type annotations
- Prefer hooks (`useState`, `useEffect`, `useRef`) for state management
- Use functional components only
- Destructure props for better readability
- Keep components focused; extract complex logic to utility functions

### Error Handling

- Use try-catch for operations that may fail (localStorage, API calls)
- Log errors/warnings to console: `console.warn()` for warnings, `console.error()` for errors
- Return graceful fallbacks when possible (e.g., default config on parse failure)
- Do not swallow errors silently

### Imports

- Use named imports from libraries: `import { Upload, Download } from "lucide-react"`
- Group imports: React → Libraries → Components/Utils → Types
- Use relative imports for local files: `import { drawWatermarkedImage } from "./utils/canvasUtils"`

### Styling

- Use Tailwind CSS utility classes in JSX
- Follow existing className ordering: structural → visual → interactive
- Support CJK fonts: Include fallbacks like `"Microsoft YaHei", sans-serif`

### Canvas Rendering

- Character-by-character splitting for CJK text wrapping (`text.split("")`)
- Scale elements relative to image resolution for high-quality output
- Use `ctx.save()`/`ctx.restore()` for state isolation

### State Persistence

- Zustand's `persist` middleware handles localStorage with prefixed keys
- Wrap deserialization in try-catch with fallback to defaults

### API Integration

- Check for API keys at runtime: `import.meta.env.VITE_API_KEY`
- Gracefully degrade when API key is missing
- Use structured responses with SchemaType for Gemini API

### Code Quality

- Avoid comments unless explaining complex logic
- Keep functions small and single-purpose
- Extract constants to the top of files (DEFAULT_DATA, DEFAULT_STYLE)
- Use TypeScript inference where possible

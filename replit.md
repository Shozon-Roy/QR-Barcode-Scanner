# QR & Barcode Scanner/Generator App

## Overview
This project is a QR code and barcode scanner/generator web application. The app allows users to scan QR codes and barcodes using their camera, scan codes from images, generate new QR codes and barcodes, and maintain a history of scanned and created codes.

The application uses a modern stack with a React frontend (using Vite), Express.js backend, and is designed for persistence with Drizzle ORM. The UI is built with a combination of TailwindCSS and shadcn/ui components.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS with shadcn/ui components
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: React Query for server state
- **UI Component Library**: shadcn/ui components based on Radix UI primitives

### Backend
- **Framework**: Express.js with TypeScript
- **API Style**: RESTful API
- **Database Access**: Drizzle ORM
- **Authentication**: Session-based (prepared but not fully implemented)

### Database
- **ORM**: Drizzle with PostgreSQL support
- **Schema**: Basic user model defined in shared/schema.ts
- **Current Implementation**: Using in-memory storage (MemStorage) as fallback

## Key Components

### Frontend Components
1. **Tab System**: The app is organized into three main tabs:
   - Scanner: For scanning QR/barcodes through camera or image
   - Generate: For creating new QR/barcodes
   - History: For viewing past scanned/created codes

2. **UI Components**:
   - Header: App title and navigation
   - BottomNavigation: Tab switching
   - ScannerTab: Contains VIP card and scanner options
   - GenerateTab: Contains content input and QR/barcode type selection
   - HistoryTab: Displays history of scanned and generated codes

3. **shadcn/ui Components**:
   - A comprehensive set of accessible UI components based on Radix UI
   - Styled with TailwindCSS
   - Includes toasts, dialogs, forms, and other UI elements

### Backend Components
1. **Express Server**: Handles API requests and serves the static frontend
2. **Routes**: API endpoints defined in server/routes.ts
3. **Storage**: Interface for data persistence in server/storage.ts
4. **Schema**: Database schema defined in shared/schema.ts

## Data Flow

1. **User Authentication**:
   - Schema is prepared for user authentication but not fully implemented
   - User model includes username and password fields

2. **QR/Barcode Scanning**:
   - Frontend captures camera feed or image
   - Processes to detect and decode QR codes/barcodes
   - Results are displayed and can be saved to history

3. **QR/Barcode Generation**:
   - User inputs content or selects type-specific data
   - Backend generates the QR code/barcode
   - Result is displayed and saved to history

4. **History Management**:
   - Scanned and generated codes are stored
   - User can view, filter, and manage history items

## External Dependencies

### Frontend
- React and React DOM
- TailwindCSS for styling
- Radix UI for accessible component primitives
- React Query for server state management
- Wouter for client-side routing

### Backend
- Express.js for API and server
- Drizzle ORM for database access
- Zod for schema validation

## Deployment Strategy

The application is configured for deployment on Replit:

1. **Development**:
   - `npm run dev` starts the development server
   - Vite serves the frontend with HMR
   - Express handles API requests

2. **Production Build**:
   - `npm run build` compiles both frontend and backend
   - Frontend assets are built with Vite
   - Backend is bundled with esbuild

3. **Production Serving**:
   - `npm run start` runs the production build
   - Express serves the static frontend assets
   - API endpoints handle data requests

## Development Roadmap

1. **Database Integration**:
   - Implement PostgreSQL connection via Drizzle ORM
   - Replace MemStorage with database persistence

2. **Authentication**:
   - Implement user registration and login
   - Add session management

3. **QR/Barcode Functionality**:
   - Integrate camera API for scanning
   - Implement code generation for all supported types
   - Build history persistence

4. **VIP/Premium Features**:
   - Implement subscription/payment system
   - Add premium-only features (batch processing, advanced types)
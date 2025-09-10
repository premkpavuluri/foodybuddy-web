# Foody Buddy Web Application

A modern food delivery web application built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- **Home Page**: Hero section with feature cards and featured menu items
- **Menu Page**: Searchable menu with category filters and food item grid
- **Cart Page**: Shopping cart with item management
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **API Integration**: Simulated API calls (ready for backend integration)

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Home page
│   ├── menu/page.tsx      # Menu page
│   ├── cart/page.tsx      # Cart page
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── LoadingSpinner.tsx
│   ├── layout/            # Layout components
│   │   ├── Layout.tsx
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   └── pages/             # Page-specific components
│       ├── Home/
│       ├── Menu/
│       └── Cart/
├── hooks/                 # Custom React hooks
│   ├── useMenu.ts
│   └── useCart.ts
├── lib/
│   └── api/              # API client and services
│       └── client.ts
├── types/                # TypeScript type definitions
│   └── index.ts
└── constants/            # Application constants
    └── index.ts
```

## Getting Started

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Run the development server:
   ```bash
   yarn dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useEffect, custom hooks)
- **API**: Simulated API calls (ready for backend integration)

## Component Architecture

The application follows a component-based architecture with:

- **UI Components**: Reusable, styled components (Button, Card, Input, etc.)
- **Layout Components**: Page structure and navigation
- **Page Components**: Specific page implementations
- **Custom Hooks**: Business logic and state management
- **API Layer**: Centralized API calls and data fetching

## API Integration

Currently uses simulated API calls with mock data. The API layer is structured to easily integrate with the backend services:

- `menuApi`: Menu items and search functionality
- `orderApi`: Order creation and management
- `userApi`: User profile and authentication

## Future Enhancements

- [ ] User authentication and profiles
- [ ] Order tracking and history
- [ ] Payment integration
- [ ] Real-time updates
- [ ] Mobile app (React Native)
- [ ] Admin dashboard

## Development

The application is built with modern React patterns and follows Next.js best practices:

- Server and Client Components separation
- TypeScript for type safety
- Tailwind CSS for styling
- Custom hooks for state management
- Component composition and reusability
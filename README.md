# FoodyBuddy Web Frontend

A Next.js frontend application for the FoodyBuddy microservices application.

## Features

- Modern React/Next.js application with TypeScript
- Tailwind CSS for styling
- Shopping cart functionality
- Order management
- Responsive design

## Prerequisites

- Node.js 18+
- npm or yarn

## Getting Started

### Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Docker

### Build the Docker image:
```bash
docker build -t foodybuddy-web .
```

### Run the container:
```bash
docker run -p 3000:3000 foodybuddy-web
```

## API Integration

This frontend is designed to communicate with the FoodyBuddy API Gateway service. In a full microservices setup:

- Menu items would be fetched from the API Gateway
- Orders would be placed through the API Gateway
- Payment processing would be handled by the backend services

Currently, the application uses mock data for demonstration purposes.

## Project Structure

```
src/
├── app/
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout component
│   └── page.tsx         # Home page component
└── ...
```

## Technologies Used

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- ESLint
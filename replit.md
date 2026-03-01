# IPO Learning Game

## Overview
Educational web application teaching Input-Processing-Output (IPO) concepts through interactive business case scenarios for ICDI bachelor students at Chiang Mai University.

## Architecture
- **Frontend**: React + TypeScript + Tailwind CSS + Shadcn UI
- **Backend**: Express.js REST API
- **Database**: PostgreSQL with Drizzle ORM
- **Routing**: Wouter (frontend), Express (backend)
- **State**: React Query for server state

## Key Files
- `shared/schema.ts` - Database schema (students, gameSessions, challengeResponses)
- `shared/gameData.ts` - All 15 business case challenges with IPO content
- `server/routes.ts` - API endpoints for registration, sessions, responses, leaderboard
- `server/db.ts` - Database connection
- `client/src/App.tsx` - Main app with routing
- `client/src/pages/HomePage.tsx` - Landing page
- `client/src/pages/RegistrationPage.tsx` - Student registration
- `client/src/pages/GamePage.tsx` - Main game interface
- `client/src/pages/ResultsPage.tsx` - Results and leaderboard
- `client/src/components/game/` - Challenge components (DragDrop, MultipleChoice, Classification)

## Business Cases
5 real-world scenarios (not from lecture slides):
1. Netflix (Entertainment & Media) - Content delivery
2. Spotify (Music Streaming) - AI recommendations
3. Grab (Mobility & Super-app) - Ride-hailing + delivery
4. Shopify (E-commerce Platform) - Merchant stores
5. Airbnb (Hospitality) - Two-sided marketplace

## Game Flow
1. Register with full name + student ID
2. Complete 15 challenges (drag-drop, multiple-choice, scenario, classification)
3. View results with sector breakdown and leaderboard

## API Endpoints
- POST /api/students/register
- GET /api/students/:studentId
- POST /api/sessions/start
- GET /api/sessions/:sessionId
- PATCH /api/sessions/:sessionId
- POST /api/responses
- GET /api/sessions/:sessionId/responses
- GET /api/leaderboard

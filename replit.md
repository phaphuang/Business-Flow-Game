# IPO Learning Game

## Overview
Educational web application teaching Input-Processing-Output (IPO) concepts through interactive business case scenarios for ICDI bachelor students at Chiang Mai University.

## Architecture
- **Frontend**: React + TypeScript + Tailwind CSS + Shadcn UI
- **Backend**: Express.js REST API with in-memory caching
- **Database**: PostgreSQL with Drizzle ORM
- **Routing**: Wouter (frontend), Express (backend)
- **State**: React Query for server state (staleTime: Infinity, no refetch on focus)

## Performance Optimizations
- Server-side in-memory cache for leaderboard (30s TTL), sessions (10s TTL), responses (15s TTL)
- Cache invalidation on writes (PATCH session, POST response)
- React Query configured with staleTime: Infinity to avoid unnecessary refetches
- All challenges are multiple-choice for fast rendering (no drag-drop or classification overhead)
- Pre-computed businessCase lookup map for O(1) sector resolution

## Key Files
- `shared/schema.ts` - Database schema (students, gameSessions, challengeResponses)
- `shared/gameData.ts` - All 30 multiple-choice challenges across 5 business cases
- `server/routes.ts` - API endpoints with server-side caching
- `server/db.ts` - Database connection
- `client/src/App.tsx` - Main app with routing
- `client/src/pages/HomePage.tsx` - Landing page
- `client/src/pages/RegistrationPage.tsx` - Student registration
- `client/src/pages/GamePage.tsx` - Main game interface (multiple choice only)
- `client/src/pages/ResultsPage.tsx` - Results and leaderboard
- `client/src/components/game/MultipleChoiceChallenge.tsx` - Challenge component

## Business Cases
5 real-world scenarios (not from lecture slides):
1. Netflix (Entertainment & Media) - Content delivery, CDN, event streaming
2. Spotify (Music Streaming) - AI recommendations, cold start, audio analysis
3. Grab (Mobility & Super-app) - Ride-hailing, super-app ecosystem
4. Shopify (E-commerce Platform) - Pod architecture, Black Friday scale
5. Airbnb (Hospitality) - Two-sided marketplace, network effects, trust

## Game Structure
- 30 multiple-choice questions (6 per business case)
- Each case: 2 easy (100pts), 2 medium (150pts), 2 hard (200pts)
- Total possible score: 4,500 points
- Designed for 30-45 minutes of engagement

## Game Flow
1. Register with full name + student ID
2. Complete 30 multiple-choice challenges
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

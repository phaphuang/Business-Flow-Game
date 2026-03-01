# IPO Learning Game

## Overview
Educational web application teaching Input-Processing-Output (IPO) concepts through interactive challenges for ICDI bachelor students at Chiang Mai University.

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
- Pre-computed businessCase lookup map for O(1) sector resolution

## Key Files
- `shared/schema.ts` - Database schema (students, gameSessions, challengeResponses)
- `shared/gameData.ts` - All 30 interactive challenges across 5 business cases
- `server/routes.ts` - API endpoints with server-side caching
- `server/db.ts` - Database connection
- `client/src/App.tsx` - Main app with routing
- `client/src/pages/HomePage.tsx` - Landing page with 5 challenge type descriptions
- `client/src/pages/RegistrationPage.tsx` - Student registration
- `client/src/pages/GamePage.tsx` - Main game interface with 5 interactive types
- `client/src/pages/ResultsPage.tsx` - Results and leaderboard
- `client/src/components/game/DragSortChallenge.tsx` - Drag & drop for IPO sort + classification
- `client/src/components/game/OrderingChallenge.tsx` - Sequence ordering (drag to reorder)
- `client/src/components/game/MatchingChallenge.tsx` - Click-to-connect pair matching
- `client/src/components/game/CalculationChallenge.tsx` - Numeric input calculation

## 5 Interactive Challenge Types
1. **drag-drop-ipo** - Drag items into Input/Processing/Output zones
2. **drag-drop-classify** - Drag items into Digital Tool/Technology/Business Concept zones
3. **ordering** - Drag steps into correct sequence order
4. **matching** - Click left item then right item to connect pairs (color-coded badges)
5. **calculation** - Read scenario data and compute numeric answer (with tolerance)

## Challenge Data Structure
Each challenge has:
- `role`, `scenario`, `mission`, `explanation` (scenario framing)
- `type`: one of the 5 interactive types
- Type-specific fields: `items` (drag-drop), `steps` (ordering), `pairs` (matching), `calcData` (calculation)
- `correctAnswer`: type-specific correct answer format

## Business Cases
5 real-world scenarios (not from lecture slides):
1. Netflix (Entertainment & Media) - Content delivery, CDN, event streaming
2. Spotify (Music Streaming) - AI recommendations, cold start, audio analysis
3. Grab (Mobility & Super-app) - Ride-hailing, super-app ecosystem
4. Shopify (E-commerce Platform) - Pod architecture, Black Friday scale
5. Airbnb (Hospitality) - Two-sided marketplace, network effects, trust

## Game Structure
- 30 interactive challenges (6 per business case)
- Each case: 2 easy (100pts), 2 medium (150pts), 2 hard (200pts)
- Distribution per case: 2 drag-drop-ipo, 1 ordering, 1 drag-drop-classify, 1 matching, 1 calculation
- Total possible score: 4,500 points
- Designed for 30-45 minutes of engagement

## Game Flow
1. Register with full name + student ID
2. Complete 30 interactive challenges (drag, order, match, calculate)
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

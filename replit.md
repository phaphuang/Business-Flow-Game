# IPO Learning Game

## Overview
Educational web application teaching Input-Processing-Output (IPO) concepts through interactive challenges for ICDI bachelor students at Chiang Mai University.

## Architecture
- **Frontend**: React + TypeScript + Tailwind CSS + Shadcn UI (mobile-first)
- **Backend**: Express.js REST API with in-memory caching
- **Database**: PostgreSQL with Drizzle ORM
- **Routing**: Wouter (frontend), Express (backend)
- **State**: React Query for server state (staleTime: Infinity, no refetch on focus)
- **Mobile**: Touch-optimized, tap-to-assign interactions, safe-area support, PWA meta tags

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
- `client/src/components/game/DragSortChallenge.tsx` - Tap-to-assign for IPO sort + classification
- `client/src/components/game/OrderingChallenge.tsx` - Sequence ordering (up/down buttons)
- `client/src/components/game/MatchingChallenge.tsx` - Tap-to-connect pair matching
- `client/src/components/game/CalculationChallenge.tsx` - Numeric input calculation
- `client/src/components/game/QuestMap.tsx` - Scrollable horizontal quest progress map
- `client/src/components/game/CelebrationOverlay.tsx` - Answer feedback with confetti

## 5 Interactive Challenge Types (all touch-friendly)
1. **drag-drop-ipo** - Tap item to select, tap zone to place (Input/Processing/Output)
2. **drag-drop-classify** - Tap item to select, tap zone to place (Tool/Technology/Business)
3. **ordering** - Reorder steps using up/down arrow buttons (44px touch targets)
4. **matching** - Tap left item then tap right item to connect (color-coded badges)
5. **calculation** - Numeric input with inputMode=decimal (with tolerance)

## Mobile Optimizations
- Viewport: width=device-width, user-scalable=no, viewport-fit=cover
- PWA meta tags: apple-mobile-web-app-capable, theme-color
- Safe area insets via CSS env() for notched phones
- touch-action: manipulation on all interactive elements (prevents double-tap zoom)
- 16px font-size on inputs (prevents iOS auto-zoom)
- Minimum 44px touch targets on buttons and interactive elements
- overscroll-behavior: none (prevents pull-to-refresh)
- Tap-to-dismiss on celebration overlay
- Responsive typography: text-sm on mobile, text-base on sm+
- Full-width buttons with py-6 for easy tapping

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

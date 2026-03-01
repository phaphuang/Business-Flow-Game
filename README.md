# IPO Learning Game

  An educational web application teaching Input-Processing-Output (IPO) concepts through interactive business case scenarios.

  ## 🎯 Overview

  This game helps ICDI bachelor students learn about digital business ecosystems by exploring 5 real-world companies:
  - 📺 **Netflix**: Content delivery platform (300M+ subscribers)
  - 🎵 **Spotify**: AI-powered music recommendations (600M+ users)
  - 🚗 **Grab**: Southeast Asian super-app (ride-hailing + delivery + fintech)
  - 🛍️ **Shopify**: E-commerce platform (5.6M+ merchants)
  - 🏠 **Airbnb**: Two-sided marketplace (hospitality)

  ## 🎮 Game Features

  ### Challenge Types
  1. **Drag & Drop**: Categorize components into Input, Processing, or Output
  2. **Multiple Choice**: Answer questions about digital technologies
  3. **Scenario-Based**: Apply IPO concepts to real business problems
  4. **Classification**: Classify items as Digital Tools, Technologies, or Business Concepts

  ### Scoring System
  - Easy challenges: 100 points
  - Medium challenges: 150 points
  - Hard challenges: 200 points
  - Total possible: 2,250 points across 15 challenges

  ### Game Flow
  1. Student registers with full name and student ID
  2. Completes 15 timed challenges (45-90 seconds each)
  3. Receives immediate educational feedback after each answer
  4. Views comprehensive results with sector-by-sector breakdown
  5. Compares performance on leaderboard

  ## 🏗️ Technical Architecture

  ### Frontend
  - **React** with TypeScript
  - **Tailwind CSS** + Shadcn UI components
  - **Wouter** for routing
  - **React Query** for data fetching
  - HTML5 drag-and-drop API

  ### Backend
  - **Express.js** REST API
  - **PostgreSQL** database
  - **Drizzle ORM** for type-safe queries
  - **Zod** for validation

  ### Database Schema

  #### Students Table
  - id (UUID)
  - fullName (text)
  - studentId (unique identifier)
  - createdAt (timestamp)

  #### Game Sessions Table
  - id (UUID)
  - studentId (foreign key)
  - startedAt, completedAt (timestamps)
  - totalScore, timeSpentMinutes
  - isCompleted (boolean)

  #### Challenge Responses Table
  - id (UUID)
  - sessionId (foreign key)
  - challengeId, sector
  - userAnswer, correctAnswer (JSON)
  - isCorrect, pointsEarned
  - timeSpentSeconds
  - answeredAt (timestamp)

  ## 🚀 Getting Started

  ### Prerequisites
  - Node.js installed
  - PostgreSQL database provisioned (automatically done on Replit)

  ### Setup & Run

  1. **Push database schema**:
     ```bash
     npm run db:push
     ```

  2. **Start development server**:
     ```bash
     npm run dev
     ```

  3. **Open the application** in your browser

  ## 📊 API Endpoints

  ### Students
  - `POST /api/students/register` - Register new student
  - `GET /api/students/:studentId` - Get student details
  - `GET /api/students/:studentId/sessions` - Get student's game sessions

  ### Game Sessions
  - `POST /api/sessions/start` - Start new game session
  - `GET /api/sessions/:sessionId` - Get session details
  - `PATCH /api/sessions/:sessionId` - Update session (score, completion)

  ### Challenges
  - `POST /api/responses` - Submit challenge response
  - `GET /api/sessions/:sessionId/responses` - Get all responses for a session

  ### Leaderboard
  - `GET /api/leaderboard` - Get top 10 performers

  ## 🎓 Educational Content

  ### Business Case Examples

  #### Netflix (Entertainment & Media)
  - **Input**: Live event feeds, user viewing data, VOD content
  - **Processing**: AWS transcoding, Open Connect CDN (17K+ servers), 38M events/sec monitoring
  - **Output**: 300M+ subscribers, 100M concurrent devices

  #### Spotify (Music Streaming)
  - **Input**: User listening behavior, audio files with 12 sonic metrics
  - **Processing**: CNN audio analysis, BaRT reinforcement learning, collaborative filtering
  - **Output**: Personalized playlists (Discover Weekly), AI DJ narration

  #### Grab (Mobility & Super-app)
  - **Input**: Ride requests, driver locations, food orders, restaurant inventory
  - **Processing**: Real-time matching, route optimization, digital payments
  - **Output**: 200M users across 8 countries, integrated services

  #### Shopify (E-commerce Platform)
  - **Input**: 5.6M merchant stores, customer orders, inventory
  - **Processing**: Ruby on Rails with 100+ pods, 66M Kafka messages/sec
  - **Output**: $292.3B GMV, 40K checkouts/min during peak

  #### Airbnb (Hospitality)
  - **Input**: 8M+ property listings, guest searches, booking requests
  - **Processing**: Microservices on AWS, search algorithms, payment processing
  - **Output**: Global marketplace, trust & safety systems

  ## 📈 Performance Tracking

  ### Student Analytics
  - Total score and accuracy percentage
  - Time spent on game
  - Performance breakdown by business sector
  - Correct vs incorrect answers per sector

  ### Leaderboard Features
  - Top 10 student rankings
  - Score-based sorting
  - Completion time tracking
  - Real-time updates

  ## 🔒 Data Privacy

  - Student IDs must be unique
  - All session data is stored securely in PostgreSQL
  - No external data sharing
  - Educational use only

  ## 🛠️ Development

  ### Project Structure
  ```
  ├── client/              # React frontend
  │   ├── src/
  │   │   ├── pages/      # Route pages
  │   │   ├── components/ # Reusable components
  │   │   └── lib/        # Utilities
  ├── server/              # Express backend
  │   ├── routes.ts       # API endpoints
  │   ├── db.ts          # Database connection
  │   └── index.ts       # Server entry
  ├── shared/              # Shared types & data
  │   ├── schema.ts      # Database schema
  │   └── gameData.ts    # Challenge content
  └── migrations/          # Database migrations
  ```

  ### Adding New Business Cases

  1. Update `shared/gameData.ts`:
     - Add to `businessCases` object
     - Create challenges in `challenges` array

  2. Ensure challenges include:
     - Unique ID
     - Sector name
     - Challenge type
     - Difficulty level
     - Time limit
     - Points value
     - Question text
     - Correct answer
     - Educational explanation

  ## 📝 License

  Educational use for ICDI Bachelor Program.

  ## 🤝 Contributing

  This is an educational project for bachelor students. Improvements welcome!

  ---

  Built with ❤️ for ICDI Bachelor Students
  
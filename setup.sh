#!/bin/bash

  echo "🎮 IPO Learning Game - Setup"
  echo "================================"
  echo ""

  echo "📦 Step 1: Installing dependencies..."
  npm install

  echo ""
  echo "🗄️  Step 2: Setting up database..."
  npm run db:push

  echo ""
  echo "✅ Setup complete!"
  echo ""
  echo "🚀 To start the application, run:"
  echo "   npm run dev"
  echo ""
  echo "📖 Then open your browser and navigate to the application"
  echo ""
  
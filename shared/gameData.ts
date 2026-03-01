// Business case scenarios for the IPO Learning Game

  export interface Challenge {
    id: string;
    sector: string;
    company: string;
    type: 'drag-drop' | 'multiple-choice' | 'scenario' | 'classification';
    difficulty: 'easy' | 'medium' | 'hard';
    timeLimit: number; // seconds
    points: number;
    question: string;
    options?: string[];
    correctAnswer: any;
    explanation: string;
    items?: { id: string; text: string; category: string }[];
  }

  export const businessCases = {
    netflix: {
      name: "Netflix",
      sector: "Entertainment & Media",
      description: "Content Delivery Platform serving 300M+ subscribers globally",
      icon: "📺",
      color: "bg-red-500",
    },
    spotify: {
      name: "Spotify",
      sector: "Music Streaming",
      description: "AI-powered music recommendation platform with 600M+ users",
      icon: "🎵",
      color: "bg-green-500",
    },
    grab: {
      name: "Grab",
      sector: "Mobility & Super-app",
      description: "Southeast Asia's ride-hailing and delivery super-app",
      icon: "🚗",
      color: "bg-emerald-600",
    },
    shopify: {
      name: "Shopify",
      sector: "E-commerce Platform",
      description: "E-commerce platform powering 5.6M+ merchant stores",
      icon: "🛍️",
      color: "bg-purple-500",
    },
    airbnb: {
      name: "Airbnb",
      sector: "Hospitality & Sharing Economy",
      description: "Two-sided marketplace connecting hosts and guests globally",
      icon: "🏠",
      color: "bg-pink-500",
    },
  };

  export const challenges: Challenge[] = [
    // NETFLIX CHALLENGES
    {
      id: "netflix-1",
      sector: "Entertainment & Media",
      company: "Netflix",
      type: "drag-drop",
      difficulty: "easy",
      timeLimit: 90,
      points: 100,
      question: "Categorize the following components of Netflix's content delivery platform into Input, Processing, or Output:",
      items: [
        { id: "n1", text: "Live event feeds from AWS MediaConnect", category: "input" },
        { id: "n2", text: "300M+ subscribers streaming content", category: "output" },
        { id: "n3", text: "Cloud-based transcoding with AWS", category: "processing" },
        { id: "n4", text: "User viewing data and preferences", category: "input" },
        { id: "n5", text: "Open Connect CDN with 17,000+ servers", category: "processing" },
        { id: "n6", text: "100M concurrent device streaming capability", category: "output" },
      ],
      correctAnswer: {
        input: ["n1", "n4"],
        processing: ["n3", "n5"],
        output: ["n2", "n6"],
      },
      explanation: "Netflix uses live feeds and user data as INPUT, processes content through cloud transcoding and CDN infrastructure, and delivers OUTPUT to millions of concurrent viewers.",
    },
    {
      id: "netflix-2",
      sector: "Entertainment & Media",
      company: "Netflix",
      type: "multiple-choice",
      difficulty: "medium",
      timeLimit: 45,
      points: 150,
      question: "Netflix processes 38 million events per second for real-time monitoring. Which digital technology enables this massive-scale data processing?",
      options: [
        "Traditional SQL databases with manual queries",
        "Event streaming platforms like Kafka and real-time analytics",
        "Email notifications and spreadsheets",
        "Desktop applications with local storage",
      ],
      correctAnswer: 1,
      explanation: "Netflix uses event streaming platforms (Kafka, Mantis, Druid) to process 38M events/second in real-time, enabling immediate monitoring and decision-making for their live streaming infrastructure.",
    },
    {
      id: "netflix-3",
      sector: "Entertainment & Media",
      company: "Netflix",
      type: "classification",
      difficulty: "hard",
      timeLimit: 60,
      points: 200,
      question: "Classify the following Netflix components as Digital Tools, Digital Technologies, or Business Concepts:",
      items: [
        { id: "nc1", text: "AWS MediaLive for live broadcast ingest", category: "tool" },
        { id: "nc2", text: "Network effects from subscriber growth", category: "business" },
        { id: "nc3", text: "Cloud computing infrastructure", category: "technology" },
        { id: "nc4", text: "Open Connect Appliances (OCAs)", category: "tool" },
        { id: "nc5", text: "Cost reduction through owned CDN infrastructure", category: "business" },
        { id: "nc6", text: "Multi-region content replication", category: "technology" },
      ],
      correctAnswer: {
        tool: ["nc1", "nc4"],
        technology: ["nc3", "nc6"],
        business: ["nc2", "nc5"],
      },
      explanation: "Digital Tools are specific software/hardware (MediaLive, OCAs). Technologies are broader computing concepts (cloud, replication). Business concepts focus on economic value (network effects, cost savings).",
    },

    // SPOTIFY CHALLENGES
    {
      id: "spotify-1",
      sector: "Music Streaming",
      company: "Spotify",
      type: "drag-drop",
      difficulty: "easy",
      timeLimit: 90,
      points: 100,
      question: "Map these elements of Spotify's recommendation system to Input, Processing, or Output:",
      items: [
        { id: "s1", text: "User listening behavior and skips", category: "input" },
        { id: "s2", text: "Discover Weekly personalized playlist", category: "output" },
        { id: "s3", text: "CNN-based audio analysis algorithms", category: "processing" },
        { id: "s4", text: "Audio files with 12 sonic metrics", category: "input" },
        { id: "s5", text: "Reinforcement learning (BaRT) system", category: "processing" },
        { id: "s6", text: "AI DJ with personalized narration", category: "output" },
      ],
      correctAnswer: {
        input: ["s1", "s4"],
        processing: ["s3", "s5"],
        output: ["s2", "s6"],
      },
      explanation: "Spotify takes user behavior and audio data as INPUT, processes it through AI/ML algorithms, and delivers personalized experiences as OUTPUT.",
    },
    {
      id: "spotify-2",
      sector: "Music Streaming",
      company: "Spotify",
      type: "multiple-choice",
      difficulty: "medium",
      timeLimit: 45,
      points: 150,
      question: "Spotify uses three main pillars for recommendations: collaborative filtering, NLP, and audio analysis. What business concept does this multi-layered approach primarily demonstrate?",
      options: [
        "Cost minimization through simple algorithms",
        "Data-driven personalization to increase user engagement",
        "Manual curation by human editors",
        "Random song selection for variety",
      ],
      correctAnswer: 1,
      explanation: "Spotify's multi-layered ML approach demonstrates data-driven personalization, a key business concept that increases user engagement by analyzing multiple data sources to create highly relevant recommendations.",
    },
    {
      id: "spotify-3",
      sector: "Music Streaming",
      company: "Spotify",
      type: "scenario",
      difficulty: "hard",
      timeLimit: 75,
      points: 200,
      question: "A new artist uploads their first song to Spotify with zero streams. How does Spotify's system handle this 'cold start' problem to recommend the song to relevant users?",
      options: [
        "Wait until the song gets 1,000 streams before recommending it",
        "Only show it to users who follow the artist on social media",
        "Use audio analysis (CNN) to understand sonic features and match with similar-taste users, plus NLP from metadata",
        "Randomly show it to all users equally",
      ],
      correctAnswer: 2,
      explanation: "Spotify solves the cold start problem using audio analysis (CNN models analyze the actual sound) combined with NLP from metadata, allowing recommendations before any streaming data exists. This demonstrates how Digital Technologies (ML/AI) solve real Business Concepts (discovery and growth for new artists).",
    },

    // GRAB CHALLENGES
    {
      id: "grab-1",
      sector: "Mobility & Super-app",
      company: "Grab",
      type: "drag-drop",
      difficulty: "easy",
      timeLimit: 90,
      points: 100,
      question: "Organize these components of Grab's super-app platform by Input, Processing, or Output:",
      items: [
        { id: "g1", text: "Passenger ride requests", category: "input" },
        { id: "g2", text: "Completed ride with payment", category: "output" },
        { id: "g3", text: "Real-time matching algorithms", category: "processing" },
        { id: "g4", text: "Driver GPS location data", category: "input" },
        { id: "g5", text: "Route optimization engine", category: "processing" },
        { id: "g6", text: "Food delivery to customer", category: "output" },
      ],
      correctAnswer: {
        input: ["g1", "g4"],
        processing: ["g3", "g5"],
        output: ["g2", "g6"],
      },
      explanation: "Grab collects ride requests and location data as INPUT, processes them through matching and optimization algorithms, and delivers completed services as OUTPUT.",
    },
    {
      id: "grab-2",
      sector: "Mobility & Super-app",
      company: "Grab",
      type: "multiple-choice",
      difficulty: "medium",
      timeLimit: 45,
      points: 150,
      question: "Grab operates as a 'super-app' combining ride-hailing, food delivery, and digital payments. What business concept does this strategy represent?",
      options: [
        "Specialization in a single service",
        "Ecosystem integration creating network effects across services",
        "Outsourcing all operations to third parties",
        "Geographic limitation to one country",
      ],
      correctAnswer: 1,
      explanation: "Grab's super-app strategy demonstrates ecosystem integration, where combining multiple services (mobility, delivery, fintech) creates network effects—each service strengthens the others by sharing users, data, and infrastructure.",
    },
    {
      id: "grab-3",
      sector: "Mobility & Super-app",
      company: "Grab",
      type: "classification",
      difficulty: "hard",
      timeLimit: 60,
      points: 200,
      question: "Classify these Grab platform elements as Digital Tools, Digital Technologies, or Business Concepts:",
      items: [
        { id: "gc1", text: "Mobile app for riders and drivers", category: "tool" },
        { id: "gc2", text: "Two-sided marketplace model", category: "business" },
        { id: "gc3", text: "Real-time GPS and mapping", category: "technology" },
        { id: "gc4", text: "Digital wallet (GrabPay)", category: "tool" },
        { id: "gc5", text: "Revenue diversification across services", category: "business" },
        { id: "gc6", text: "Cloud infrastructure for scalability", category: "technology" },
      ],
      correctAnswer: {
        tool: ["gc1", "gc4"],
        technology: ["gc3", "gc6"],
        business: ["gc2", "gc5"],
      },
      explanation: "Tools are specific applications (mobile app, wallet). Technologies are underlying capabilities (GPS, cloud). Business concepts are strategic approaches (two-sided marketplace, diversification).",
    },

    // SHOPIFY CHALLENGES
    {
      id: "shopify-1",
      sector: "E-commerce Platform",
      company: "Shopify",
      type: "drag-drop",
      difficulty: "easy",
      timeLimit: 90,
      points: 100,
      question: "Categorize these Shopify platform components into Input, Processing, or Output:",
      items: [
        { id: "sh1", text: "Merchant product listings and inventory", category: "input" },
        { id: "sh2", text: "40,000 checkouts per minute", category: "output" },
        { id: "sh3", text: "Ruby on Rails processing with 100+ pods", category: "processing" },
        { id: "sh4", text: "Customer orders and payment information", category: "input" },
        { id: "sh5", text: "66 million Kafka messages per second", category: "processing" },
        { id: "sh6", text: "$292.3B in GMV processed annually", category: "output" },
      ],
      correctAnswer: {
        input: ["sh1", "sh4"],
        processing: ["sh3", "sh5"],
        output: ["sh2", "sh6"],
      },
      explanation: "Shopify receives merchant data and customer orders as INPUT, processes them through scalable infrastructure, and delivers massive transaction volume as OUTPUT.",
    },
    {
      id: "shopify-2",
      sector: "E-commerce Platform",
      company: "Shopify",
      type: "multiple-choice",
      difficulty: "medium",
      timeLimit: 45,
      points: 150,
      question: "During Black Friday 2025, Shopify processed 284 million requests per minute. What digital technology architecture enables this massive scalability?",
      options: [
        "Single centralized server with manual processing",
        "Modular pod architecture with 100+ isolated instances and distributed databases",
        "Email-based order processing system",
        "Desktop software installed on merchant computers",
      ],
      correctAnswer: 1,
      explanation: "Shopify uses a modular pod architecture with 100+ isolated instances, each with dedicated MySQL, Redis, and Memcached. This distributed system allows independent scaling and prevents global outages.",
    },
    {
      id: "shopify-3",
      sector: "E-commerce Platform",
      company: "Shopify",
      type: "scenario",
      difficulty: "hard",
      timeLimit: 75,
      points: 200,
      question: "A small business owner wants to sell internationally. Shopify Markets increased cross-border transactions by 97% for small businesses in 2024. Which combination of elements makes this possible?",
      options: [
        "Only the merchant's own marketing efforts",
        "Digital Tools (Shopify Markets app) + Digital Technologies (currency conversion, localization) + Business Concepts (marketplace expansion, reduced barriers)",
        "Manual translation services only",
        "Requiring customers to visit physical stores",
      ],
      correctAnswer: 1,
      explanation: "International selling requires all three: Digital Tools (Shopify Markets app provides the interface), Digital Technologies (automated currency conversion, payment processing, localization), and Business Concepts (marketplace expansion strategy, reducing entry barriers for small merchants).",
    },

    // AIRBNB CHALLENGES
    {
      id: "airbnb-1",
      sector: "Hospitality & Sharing Economy",
      company: "Airbnb",
      type: "drag-drop",
      difficulty: "easy",
      timeLimit: 90,
      points: 100,
      question: "Map these Airbnb two-sided marketplace elements to Input, Processing, or Output:",
      items: [
        { id: "a1", text: "8M+ property listings from hosts", category: "input" },
        { id: "a2", text: "Confirmed bookings with payments", category: "output" },
        { id: "a3", text: "Search and ranking algorithms", category: "processing" },
        { id: "a4", text: "Guest search queries and preferences", category: "input" },
        { id: "a5", text: "Microservices architecture on AWS", category: "processing" },
        { id: "a6", text: "Trust & safety verification system", category: "output" },
      ],
      correctAnswer: {
        input: ["a1", "a4"],
        processing: ["a3", "a5"],
        output: ["a2", "a6"],
      },
      explanation: "Airbnb takes property listings and guest searches as INPUT, processes them through algorithms and microservices, and delivers bookings and trust systems as OUTPUT.",
    },
    {
      id: "airbnb-2",
      sector: "Hospitality & Sharing Economy",
      company: "Airbnb",
      type: "multiple-choice",
      difficulty: "medium",
      timeLimit: 45,
      points: 150,
      question: "Airbnb operates a two-sided marketplace connecting hosts and guests. What business concept explains why more hosts attract more guests, which then attracts even more hosts?",
      options: [
        "Linear growth model",
        "Network effects creating a self-reinforcing cycle",
        "Fixed marketplace with no growth",
        "Competition reducing platform value",
      ],
      correctAnswer: 1,
      explanation: "Network effects are the business concept where platform value increases as more participants join. More hosts → more options for guests → more guests join → more revenue for hosts → more hosts join, creating a positive cycle.",
    },
    {
      id: "airbnb-3",
      sector: "Hospitality & Sharing Economy",
      company: "Airbnb",
      type: "classification",
      difficulty: "hard",
      timeLimit: 60,
      points: 200,
      question: "Classify these Airbnb platform components as Digital Tools, Digital Technologies, or Business Concepts:",
      items: [
        { id: "ac1", text: "Airbnb mobile app and website", category: "tool" },
        { id: "ac2", text: "Two-sided marketplace business model", category: "business" },
        { id: "ac3", text: "AWS cloud infrastructure", category: "technology" },
        { id: "ac4", text: "Secure payment processing system", category: "tool" },
        { id: "ac5", text: "Trust through ratings and reviews", category: "business" },
        { id: "ac6", text: "Microservices architecture", category: "technology" },
      ],
      correctAnswer: {
        tool: ["ac1", "ac4"],
        technology: ["ac3", "ac6"],
        business: ["ac2", "ac5"],
      },
      explanation: "Tools are user-facing applications (app, payment system). Technologies are technical infrastructure (cloud, microservices). Business concepts are strategic models (two-sided marketplace, trust systems).",
    },
  ];

  export const getSectorChallenges = (sector: string): Challenge[] => {
    return challenges.filter(c => c.sector === sector);
  };

  export const getChallenge = (id: string): Challenge | undefined => {
    return challenges.find(c => c.id === id);
  };

  export const getAllSectors = (): string[] => {
    return Object.values(businessCases).map(bc => bc.sector);
  };
  
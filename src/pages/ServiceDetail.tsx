
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, Clock, Shield, Trophy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useCart } from '@/contexts/CartContext';
import { supabase } from "@/integrations/supabase/client";

// Updated services with detailed game-specific information
const fallbackServices = [
  // League of Legends Services
  {
    id: "lol-boost-1",
    title: "League of Legends Rank Boost",
    description: "Fast rank boosting from Iron to Challenger by our professional LoL players.",
    fullDescription: "Our League of Legends rank boosting service helps you climb the ranked ladder quickly and efficiently. Our team of professional players (Diamond to Challenger) will play on your account using secure VPN connections to boost your rank while maintaining high win rates and preserving your account's safety.",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    gallery: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3"
    ],
    rating: 4.8,
    reviews: 156,
    price: 49.99,
    category: "Boosting",
    game: "League of Legends",
    timeEstimate: "24-72 hours depending on ranks",
    features: [
      "Professional boosters with 5+ years of experience",
      "Secure VPN protection for account safety",
      "Regular progress updates and communication",
      "Champion preference selection available",
      "Duo boost option available for safer boosting"
    ],
    options: [
      {
        id: "bronze-to-silver",
        name: "Bronze to Silver",
        description: "Boost from any Bronze division to Silver",
        price: 49.99
      },
      {
        id: "silver-to-gold",
        name: "Silver to Gold",
        description: "Boost from any Silver division to Gold",
        price: 79.99
      },
      {
        id: "gold-to-platinum",
        name: "Gold to Platinum",
        description: "Boost from any Gold division to Platinum",
        price: 119.99
      }
    ],
    faqs: [
      {
        question: "How long does the boosting process take?",
        answer: "The time varies depending on your current rank and your target rank. Generally, it takes 24-72 hours to complete a standard division boosting order."
      },
      {
        question: "Is my account safe?",
        answer: "Yes, we take security very seriously. Our boosters use VPN protection and follow strict security protocols to ensure your account's safety."
      },
      {
        question: "Can I play on my account during the boosting process?",
        answer: "We recommend not playing on your account during the boosting process to avoid any potential issues or delays."
      },
      {
        question: "What if I'm not satisfied with the service?",
        answer: "We have a satisfaction guarantee. If you're not happy with our service, please contact our support team, and we'll make it right."
      }
    ]
  },
  {
    id: "lol-coaching-1",
    title: "LoL Pro Coaching",
    description: "One-on-one coaching sessions with Diamond+ players to improve your skills and gameplay.",
    fullDescription: "Our League of Legends coaching service pairs you with high-elo players (Diamond+) who will analyze your gameplay, identify areas for improvement, and provide personalized guidance. Each session is tailored to your specific needs, whether it's improving mechanics, game knowledge, or strategic thinking.",
    image: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    gallery: [
      "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3"
    ],
    rating: 4.9,
    reviews: 89,
    price: 29.99,
    category: "Coaching",
    game: "League of Legends",
    timeEstimate: "1-2 hours per session",
    features: [
      "One-on-one sessions with Diamond+ players",
      "Role-specific coaching for all positions",
      "Champion mastery guidance",
      "VOD review and analysis",
      "Custom practice drills and exercises"
    ],
    options: [
      {
        id: "single-session",
        name: "Single Coaching Session",
        description: "One 1-hour coaching session",
        price: 29.99
      },
      {
        id: "three-sessions",
        name: "Three Session Package",
        description: "Three 1-hour coaching sessions",
        price: 79.99
      },
      {
        id: "five-sessions",
        name: "Five Session Package",
        description: "Five 1-hour coaching sessions with progress tracking",
        price: 119.99
      }
    ],
    faqs: [
      {
        question: "How do I schedule a coaching session?",
        answer: "After purchasing, you'll receive a link to our scheduling system where you can choose a time that works for you and your coach."
      },
      {
        question: "What do I need for a coaching session?",
        answer: "You'll need a stable internet connection, Discord for communication, and League of Legends installed on your device."
      },
      {
        question: "Can I request a specific coach?",
        answer: "Yes, you can request a specific coach when scheduling your session, subject to availability."
      },
      {
        question: "What if I need to reschedule?",
        answer: "You can reschedule your session up to 24 hours before the scheduled time. Please contact our support team if you need to reschedule with less notice."
      }
    ]
  },
  {
    id: "lol-skins-1",
    title: "LoL Skins Package",
    description: "Get access to premium and limited edition skins for your favorite champions.",
    fullDescription: "Our League of Legends skins package offers you access to premium, rare, and limited edition skins for your favorite champions at discounted prices. We offer safe delivery methods and guaranteed authenticity for all skin purchases.",
    image: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    gallery: [
      "https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1609741199878-3e8ebf6ef0c2?auto=format&fit=crop&q=80&w=1432&ixlib=rb-4.0.3"
    ],
    rating: 4.7,
    reviews: 124,
    price: 39.99,
    category: "Items & Skins",
    game: "League of Legends",
    timeEstimate: "Delivery within 24 hours",
    features: [
      "Access to premium and limited edition skins",
      "Safe and secure delivery methods",
      "Champion-specific skin bundles available",
      "Includes rare legacy skins",
      "Account safety guaranteed"
    ],
    options: [
      {
        id: "basic-pack",
        name: "Basic Skin Pack",
        description: "5 random premium skins",
        price: 39.99
      },
      {
        id: "premium-pack",
        name: "Premium Skin Pack",
        description: "10 premium skins of your choice",
        price: 69.99
      },
      {
        id: "ultimate-pack",
        name: "Ultimate Skin Pack",
        description: "15 premium skins + 3 ultimate skins",
        price: 119.99
      }
    ],
    faqs: [
      {
        question: "How do I receive the skins?",
        answer: "After purchase, we'll contact you to arrange the delivery of the skins to your account using our secure gifting method."
      },
      {
        question: "Can I choose specific skins?",
        answer: "Yes, with our Premium and Ultimate packages, you can select specific skins that you want (subject to availability)."
      },
      {
        question: "What if a skin I want is not available?",
        answer: "If a specific skin you requested is not available, we'll offer you alternatives or provide a partial refund for that skin."
      },
      {
        question: "Is this service against League of Legends terms of service?",
        answer: "Our skin delivery methods are designed to comply with Riot Games' terms of service to ensure your account remains in good standing."
      }
    ]
  },
  
  // Valorant Services
  {
    id: "valorant-boost-1",
    title: "Valorant Rank Boosting",
    description: "Boost your Valorant rank from Iron to Radiant with our professional players.",
    fullDescription: "Our Valorant rank boosting service helps you climb through the competitive ranks quickly and efficiently. Our team of professional players (Immortal and Radiant rank) will play on your account using secure methods to boost your rank while maintaining high win rates and preserving your account's safety.",
    image: "https://images.unsplash.com/photo-1580327344181-c1163234e5a0?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    gallery: [
      "https://images.unsplash.com/photo-1580327344181-c1163234e5a0?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1627896157734-4d2d20b6c029?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1556438064-2d7646166914?auto=format&fit=crop&q=80&w=1474&ixlib=rb-4.0.3"
    ],
    rating: 4.9,
    reviews: 87,
    price: 54.99,
    category: "Boosting",
    game: "Valorant",
    timeEstimate: "24-72 hours depending on ranks",
    features: [
      "Boosting by Immortal and Radiant players",
      "Secure VPN protection for account safety",
      "Agent preference selection available",
      "Regular progress updates via Discord or email",
      "Stream option available for complete transparency"
    ],
    options: [
      {
        id: "iron-to-bronze",
        name: "Iron to Bronze",
        description: "Boost from any Iron rank to Bronze",
        price: 54.99
      },
      {
        id: "bronze-to-silver",
        name: "Bronze to Silver",
        description: "Boost from any Bronze rank to Silver",
        price: 74.99
      },
      {
        id: "silver-to-gold",
        name: "Silver to Gold",
        description: "Boost from any Silver rank to Gold",
        price: 99.99
      }
    ],
    faqs: [
      {
        question: "How long does the boosting process take?",
        answer: "The time varies depending on your current rank and your target rank. Generally, it takes 24-72 hours to complete a standard rank boosting order."
      },
      {
        question: "Is my account safe?",
        answer: "Yes, we take security very seriously. Our boosters use VPN protection and follow strict security protocols to ensure your account's safety."
      },
      {
        question: "Can I specify which agents to play?",
        answer: "Yes, you can specify which agents you prefer our boosters to play, which helps make the boosting less detectable."
      },
      {
        question: "What if I get banned?",
        answer: "While our methods minimize the risk of bans, in the extremely rare case of a ban occurring as a direct result of our boosting service, we offer a full refund or a replacement account of similar value."
      }
    ]
  },
  {
    id: "valorant-coaching-1",
    title: "Valorant Aim Training",
    description: "Improve your aim, game sense, and strategies with personalized coaching sessions.",
    fullDescription: "Our Valorant aim training service offers personalized coaching to help you improve your aim mechanics, game sense, and tactical understanding. Our coaches are high-rank players with proven track records who will analyze your gameplay and provide targeted exercises to improve your performance.",
    image: "https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&q=80&w=1476&ixlib=rb-4.0.3",
    gallery: [
      "https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&q=80&w=1476&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1507457379470-08b800bebc67?auto=format&fit=crop&q=80&w=1528&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1629429407760-f54a671f9d02?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3"
    ],
    rating: 4.8,
    reviews: 65,
    price: 24.99,
    category: "Coaching",
    game: "Valorant",
    timeEstimate: "1-2 hours per session",
    features: [
      "Personalized aim training routines",
      "Crosshair and sensitivity optimization",
      "Agent-specific ability usage training",
      "VOD review and analysis",
      "Map-specific strategies and callouts"
    ],
    options: [
      {
        id: "aim-fundamentals",
        name: "Aim Fundamentals",
        description: "1-hour session focused on basic aim mechanics",
        price: 24.99
      },
      {
        id: "aim-and-positioning",
        name: "Aim & Positioning Package",
        description: "3-hour package covering aim and positioning",
        price: 59.99
      },
      {
        id: "complete-training",
        name: "Complete Player Package",
        description: "5-hour comprehensive training package",
        price: 89.99
      }
    ],
    faqs: [
      {
        question: "How do the coaching sessions work?",
        answer: "Sessions are conducted over Discord with screen sharing. Your coach will watch you play, provide real-time feedback, and assign specific training exercises."
      },
      {
        question: "Do I need any special equipment?",
        answer: "A gaming mouse, headset with microphone, and Discord is required. We also recommend having the ability to record your gameplay for review."
      },
      {
        question: "Can coaching really improve my aim?",
        answer: "Yes, our structured approach to aim training has shown significant improvements for players at all skill levels, with most seeing results within 1-2 weeks of consistent practice."
      },
      {
        question: "Who are your coaches?",
        answer: "Our coaches are Immortal and Radiant rank players, many with competitive tournament experience and proven teaching abilities."
      }
    ]
  },
  {
    id: "valorant-skins-1",
    title: "Valorant Points Package",
    description: "Get Valorant Points to purchase premium weapon skins and battle passes at a discount.",
    fullDescription: "Our Valorant Points package offers you VP at discounted rates compared to the in-game store. Use these points to purchase premium weapon skins, the latest battle pass, or other in-game cosmetics to enhance your gameplay experience and stand out from other players.",
    image: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    gallery: [
      "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1368&ixlib=rb-4.0.3"
    ],
    rating: 4.6,
    reviews: 112,
    price: 19.99,
    category: "Currency",
    game: "Valorant",
    timeEstimate: "Delivery within 24 hours",
    features: [
      "Discounted Valorant Points packages",
      "Safe and secure delivery methods",
      "Use for premium weapon skins",
      "Purchase battle passes and agent contracts",
      "Account safety guaranteed"
    ],
    options: [
      {
        id: "small-vp",
        name: "1000 Valorant Points",
        description: "Small Valorant Points package",
        price: 19.99
      },
      {
        id: "medium-vp",
        name: "2800 Valorant Points",
        description: "Medium Valorant Points package",
        price: 39.99
      },
      {
        id: "large-vp",
        name: "5350 Valorant Points",
        description: "Large Valorant Points package",
        price: 69.99
      }
    ],
    faqs: [
      {
        question: "How do I receive the Valorant Points?",
        answer: "After purchase, we'll contact you to arrange the delivery of the VP to your account using our secure method."
      },
      {
        question: "How long does delivery take?",
        answer: "We typically deliver Valorant Points within 24 hours of purchase confirmation."
      },
      {
        question: "Is this service against Valorant's terms of service?",
        answer: "Our delivery methods are designed to comply with Riot Games' terms of service to ensure your account remains in good standing."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept credit/debit cards, PayPal, and various cryptocurrency options for all purchases."
      }
    ]
  },
  
  // Fortnite Services
  {
    id: "fortnite-vbucks-1",
    title: "Fortnite V-Bucks Bundle",
    description: "Discounted V-Bucks packages to purchase skins, emotes, and Battle Passes.",
    fullDescription: "Our Fortnite V-Bucks bundles offer discounted in-game currency that you can use to purchase cosmetic items, emotes, battle passes, and other in-game content. Get more value for your money with our safe and reliable V-Bucks delivery service.",
    image: "https://images.unsplash.com/photo-1519669556878-63bdad8a1a49?auto=format&fit=crop&q=80&w=1471&ixlib=rb-4.0.3",
    gallery: [
      "https://images.unsplash.com/photo-1519669556878-63bdad8a1a49?auto=format&fit=crop&q=80&w=1471&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&q=80&w=1504&ixlib=rb-4.0.3"
    ],
    rating: 4.6,
    reviews: 203,
    price: 19.99,
    category: "Currency",
    game: "Fortnite",
    timeEstimate: "Delivery within 24 hours",
    features: [
      "Discounted V-Bucks packages",
      "Safe and secure delivery methods",
      "Use for skins, emotes, and battle passes",
      "Available for all platforms",
      "Account safety guaranteed"
    ],
    options: [
      {
        id: "small-vbucks",
        name: "1000 V-Bucks",
        description: "Small V-Bucks package",
        price: 19.99
      },
      {
        id: "medium-vbucks",
        name: "2800 V-Bucks",
        description: "Medium V-Bucks package",
        price: 39.99
      },
      {
        id: "large-vbucks",
        name: "5000 V-Bucks",
        description: "Large V-Bucks package",
        price: 69.99
      }
    ],
    faqs: [
      {
        question: "How do I receive the V-Bucks?",
        answer: "After purchase, we'll contact you to arrange the delivery of the V-Bucks to your Fortnite account using our secure method."
      },
      {
        question: "How long does delivery take?",
        answer: "We typically deliver V-Bucks within 24 hours of purchase confirmation."
      },
      {
        question: "Is this service available for all platforms?",
        answer: "Yes, our V-Bucks service is available for PC, PlayStation, Xbox, Nintendo Switch, and mobile platforms."
      },
      {
        question: "Is this service against Fortnite's terms of service?",
        answer: "Our delivery methods are designed to comply with Epic Games' terms of service to ensure your account remains in good standing."
      }
    ]
  },
  {
    id: "fortnite-wins-1",
    title: "Fortnite Victory Package",
    description: "Get guaranteed wins in Fortnite with our professional players carrying your account.",
    fullDescription: "Our Fortnite Victory Package guarantees you wins in Solo, Duo, or Squad modes with our professional players carrying your account. We'll help you improve your stats, unlock victory umbrellas, and complete win-based challenges while you either spectate and learn or take a break.",
    image: "https://images.unsplash.com/photo-1589241062272-c0a000072145?auto=format&fit=crop&q=80&w=1374&ixlib=rb-4.0.3",
    gallery: [
      "https://images.unsplash.com/photo-1589241062272-c0a000072145?auto=format&fit=crop&q=80&w=1374&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1616159356458-3ef5892e8744?auto=format&fit=crop&q=80&w=1374&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1589395595558-b4edcf91639e?auto=format&fit=crop&q=80&w=1374&ixlib=rb-4.0.3"
    ],
    rating: 4.7,
    reviews: 178,
    price: 29.99,
    category: "Boosting",
    game: "Fortnite",
    timeEstimate: "Varies by package (typically 1-3 hours per win)",
    features: [
      "Guaranteed Victory Royales",
      "Professional players with high K/D ratios",
      "Option to spectate and learn or take a break",
      "Unlock season victory umbrellas",
      "Complete win-based challenges"
    ],
    options: [
      {
        id: "single-win",
        name: "Single Victory",
        description: "One guaranteed Victory Royale",
        price: 29.99
      },
      {
        id: "triple-win",
        name: "Triple Victory Pack",
        description: "Three guaranteed Victory Royales",
        price: 69.99
      },
      {
        id: "premium-win",
        name: "Premium Victory Pack",
        description: "Five guaranteed Victory Royales + 10+ eliminations per game",
        price: 99.99
      }
    ],
    faqs: [
      {
        question: "How does the Victory Package work?",
        answer: "After purchase, we'll arrange a time for one of our professional players to log into your account and play matches until achieving the guaranteed number of wins."
      },
      {
        question: "Can I watch while the pro plays on my account?",
        answer: "Yes, we offer a streaming option where you can watch the games live, communicate with the player, and learn strategies."
      },
      {
        question: "How long does it take to get a win?",
        answer: "Our pros typically secure a Victory Royale within 1-3 hours, depending on game conditions and lobby difficulty."
      },
      {
        question: "Is my account safe?",
        answer: "Yes, we use secure methods to access your account and follow strict security protocols to ensure your account's safety."
      }
    ]
  },
  {
    id: "fortnite-challenges-1",
    title: "Battle Pass Challenges",
    description: "Complete all your Battle Pass challenges to unlock exclusive skins and rewards.",
    fullDescription: "Our Battle Pass Challenge completion service helps you unlock all the exclusive cosmetics, V-Bucks, and rewards from your Fortnite Battle Pass without spending countless hours grinding. Our team efficiently completes weekly challenges, milestone quests, and special event tasks.",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=1547&ixlib=rb-4.0.3",
    gallery: [
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=1547&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1472457897821-70d3819a0e24?auto=format&fit=crop&q=80&w=1469&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1604085572504-a392ddf0d86a?auto=format&fit=crop&q=80&w=1528&ixlib=rb-4.0.3"
    ],
    rating: 4.5,
    reviews: 142,
    price: 34.99,
    category: "Achievements",
    game: "Fortnite",
    timeEstimate: "24-72 hours depending on challenge volume",
    features: [
      "Complete weekly challenges and quests",
      "Unlock all Battle Pass cosmetics and rewards",
      "Earn V-Bucks from Battle Pass progression",
      "Complete special event challenges",
      "Safe and efficient challenge completion"
    ],
    options: [
      {
        id: "weekly-challenges",
        name: "Weekly Challenges",
        description: "Complete all challenges for one week",
        price: 34.99
      },
      {
        id: "monthly-challenges",
        name: "Monthly Challenge Pack",
        description: "Complete all challenges for one month",
        price: 89.99
      },
      {
        id: "full-season",
        name: "Full Season Package",
        description: "Complete all challenges for the entire season",
        price: 149.99
      }
    ],
    faqs: [
      {
        question: "How long does it take to complete the challenges?",
        answer: "Completion time varies depending on the number and difficulty of challenges. Weekly challenges typically take 24-48 hours, while a full season package may take 5-7 days."
      },
      {
        question: "Will you use my V-Bucks or make purchases?",
        answer: "No, we will never use your V-Bucks or make any purchases on your account without explicit permission."
      },
      {
        question: "Can I specify which challenges to prioritize?",
        answer: "Yes, you can specify which challenges or rewards you'd like us to focus on first."
      },
      {
        question: "Is this service against Fortnite's terms of service?",
        answer: "Our challenge completion methods are designed to comply with Epic Games' terms of service to ensure your account remains in good standing."
      }
    ]
  },
  
  // World of Warcraft Services
  {
    id: "wow-gold-1",
    title: "WoW Gold Package",
    description: "Safe and reliable World of Warcraft gold delivered to your character within hours.",
    fullDescription: "Our World of Warcraft gold service provides you with a reliable source of in-game currency at competitive rates. Whether you need gold for gear, consumables, mounts, or other purchases, our fast and secure delivery will have you funded quickly so you can focus on enjoying the game.",
    image: "https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&q=80&w=1504&ixlib=rb-4.0.3",
    gallery: [
      "https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&fit=crop&q=80&w=1504&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1499346488051-5aa3e40fcccb?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1594410473497-3d7ddb3d595d?auto=format&fit=crop&q=80&w=1374&ixlib=rb-4.0.3"
    ],
    rating: 4.8,
    reviews: 256,
    price: 24.99,
    category: "Currency",
    game: "World of Warcraft",
    timeEstimate: "Delivery within 1-3 hours",
    features: [
      "Safe and secure gold delivery",
      "Competitive rates",
      "Available for all realms and factions",
      "Fast delivery (usually within 1-3 hours)",
      "24/7 customer support"
    ],
    options: [
      {
        id: "small-gold",
        name: "10,000 Gold",
        description: "Small gold package",
        price: 24.99
      },
      {
        id: "medium-gold",
        name: "50,000 Gold",
        description: "Medium gold package",
        price: 99.99
      },
      {
        id: "large-gold",
        name: "200,000 Gold",
        description: "Large gold package",
        price: 349.99
      }
    ],
    faqs: [
      {
        question: "How is the gold delivered?",
        answer: "After purchase, we'll contact you to arrange a meeting in-game where our courier will trade you the gold directly."
      },
      {
        question: "How long does delivery take?",
        answer: "We typically deliver gold within 1-3 hours of purchase confirmation, depending on your realm and availability."
      },
      {
        question: "Is this service available for all realms?",
        answer: "Yes, we offer gold delivery on all US and EU realms, for both Retail and Classic WoW."
      },
      {
        question: "Is buying gold safe?",
        answer: "We use sophisticated delivery methods to minimize any risk to your account. Our methods have been refined over years to be as safe as possible."
      }
    ]
  },
  {
    id: "wow-leveling-1",
    title: "WoW Power Leveling",
    description: "Level your character from 1 to max level with our efficient boosting service.",
    fullDescription: "Our World of Warcraft power leveling service helps you bypass the grind and get straight to the endgame content. Our professional boosters will level your character efficiently while acquiring appropriate gear along the way, allowing you to enjoy the most exciting aspects of WoW without spending weeks leveling.",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
    gallery: [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&q=80&w=1547&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&q=80&w=1469&ixlib=rb-4.0.3"
    ],
    rating: 4.7,
    reviews: 189,
    price: 49.99,
    category: "Power Leveling",
    game: "World of Warcraft",
    timeEstimate: "3-7 days depending on level range",
    features: [
      "Fast and efficient leveling",
      "Experienced boosters who know optimal routes",
      "Basic gear acquisition during leveling",
      "Professional play that minimizes death and downtime",
      "Regular progress updates"
    ],
    options: [
      {
        id: "starter-level",
        name: "Starter Leveling (1-30)",
        description: "Level from 1 to 30",
        price: 49.99
      },
      {
        id: "mid-level",
        name: "Mid Leveling (30-50)",
        description: "Level from 30 to 50",
        price: 69.99
      },
      {
        id: "endgame-level",
        name: "Endgame Leveling (50-70)",
        description: "Level from 50 to 70",
        price: 99.99
      }
    ],
    faqs: [
      {
        question: "How long does power leveling take?",
        answer: "Leveling time varies depending on the level range, but typically takes 3-7 days for a full 1-70 leveling service. Specific level ranges may be completed more quickly."
      },
      {
        question: "Will I get gear while leveling?",
        answer: "Yes, our boosters will acquire appropriate gear from quests and dungeons during the leveling process to ensure your character is properly equipped."
      },
      {
        question: "Can I specify a leveling path or zones?",
        answer: "Yes, you can provide specific instructions about preferred zones, quest lines, or leveling methods and we'll try to accommodate your requests."
      },
      {
        question: "Is my account safe during power leveling?",
        answer: "Yes, we use secure VPN connections and have strict security protocols to ensure your account remains safe during the leveling process."
      }
    ]
  },
  {
    id: "wow-mythic-1",
    title: "Mythic+ Dungeon Runs",
    description: "Complete high-level Mythic+ dungeons for gear, achievements, and season rewards.",
    fullDescription: "Our Mythic+ dungeon boost service helps you complete challenging dungeons for valuable gear, achievements, and seasonal rewards. Our team of experienced players will carry you through dungeons of your choice at your desired key level, ensuring smooth runs and maximum rewards.",
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=1547&ixlib=rb-4.0.3",
    gallery: [
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=1547&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1574&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=1574&ixlib=rb-4.0.3"
    ],
    rating: 4.9,
    reviews: 210,
    price: 39.99,
    category: "Boosting",
    game: "World of Warcraft",
    timeEstimate: "30-60 minutes per dungeon",
    features: [
      "Guaranteed key completion",
      "Team of 4 experienced players",
      "Available for all current dungeons",
      "Timed runs for maximum rewards",
      "Loot trading for targeted gear acquisition"
    ],
    options: [
      {
        id: "mythic-5",
        name: "Mythic+5 Run",
        description: "Complete one Mythic+5 dungeon of your choice",
        price: 39.99
      },
      {
        id: "mythic-10",
        name: "Mythic+10 Run",
        description: "Complete one Mythic+10 dungeon of your choice",
        price: 69.99
      },
      {
        id: "mythic-15",
        name: "Mythic+15 Run",
        description: "Complete one Mythic+15 dungeon for maximum weekly rewards",
        price: 99.99
      }
    ],
    faqs: [
      {
        question: "How do Mythic+ runs work?",
        answer: "After purchase, we'll schedule a time for the run. You'll join our team of 4 professional players who will carry you through the dungeon of your choice at the selected key level."
      },
      {
        question: "Can I choose which dungeon to run?",
        answer: "Yes, you can select any dungeon that's currently available in the Mythic+ rotation."
      },
      {
        question: "Do I get to keep all the loot?",
        answer: "You'll receive all loot that drops directly for you, and our team will trade you any items they don't need that match your loot specialization."
      },
      {
        question: "What if we fail to complete the key in time?",
        answer: "We guarantee completion of the dungeon, even if not within the time limit. If we fail to complete the dungeon at all (extremely rare), we'll offer a free re-run or refund."
      }
    ]
  }
];

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<any>(undefined);
  const [selectedOption, setSelectedOption] = useState<any>(undefined);
  const [showReviews, setShowReviews] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [mainImage, setMainImage] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(!!session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const { data: svc, error } = await supabase
          .from('services')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        if (error) throw error;

        if (svc) {
          const [imagesRes, featuresRes, faqsRes, optionsRes] = await Promise.all([
            supabase.from('service_images').select('*').eq('service_id', id).order('sort_order', { ascending: true }),
            supabase.from('service_features').select('*').eq('service_id', id).order('sort_order', { ascending: true }),
            supabase.from('service_faqs').select('*').eq('service_id', id).order('sort_order', { ascending: true }),
            supabase.from('service_options').select('*').eq('service_id', id).order('sort_order', { ascending: true }),
          ]);

          const gallery = (imagesRes.data?.map((i: any) => i.image_url) ?? []);
          
          // Check if this is a custom gift card and get amount from URL
          const urlParams = new URLSearchParams(window.location.search);
          const customAmount = urlParams.get('amount');
          
          let options = (optionsRes.data ?? []).map((o: any) => ({
            id: o.option_id,
            name: o.name,
            description: o.delivery_time || '',
            price: Number(o.price),
            highlighted: o.highlighted,
            bestValue: o.best_value,
          }));
          
          // If it's a custom gift card and amount is provided, create a custom option
          if (id === 'custom-gift' && customAmount && parseFloat(customAmount) > 0) {
            const amount = parseFloat(customAmount);
            options = [{
              id: 'custom-amount',
              name: `Custom Amount - $${amount.toFixed(2)}`,
              description: 'Custom gift card amount',
              price: amount,
              highlighted: true,
              bestValue: false,
            }];
          }

          const composed: any = {
            id: svc.id,
            title: svc.title,
            description: svc.description,
            fullDescription: svc.description,
            image: svc.image,
            gallery: gallery.length ? gallery : [svc.image].filter(Boolean),
            rating: Number(svc.rating ?? 5),
            reviews: 0,
            price: Number(svc.base_price ?? 0),
            category: svc.category,
            game: svc.game,
            timeEstimate: 'Instant delivery',
            features: (featuresRes.data ?? []).map((f: any) => f.feature),
            options,
            faqs: (faqsRes.data ?? []).map((f: any) => ({ question: f.question, answer: f.answer })),
          };

          setService(composed);
        } else {
          const fb = (fallbackServices as any[]).find((s) => s.id === id);
          setService(fb);
        }
      } catch (err) {
        const fb = (fallbackServices as any[]).find((s) => s.id === id);
        setService(fb);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    if (service) {
      setSelectedOption(service.options[0]);
      setMainImage(service.image);
    }
  }, [service]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to add items to your cart.',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    if (service && selectedOption) {
      await addItem({
        service_id: service.id,
        service_title: service.title,
        option_id: selectedOption.id,
        option_name: selectedOption.name,
        price: selectedOption.price
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="mb-6">
            <nav className="flex text-sm">
              <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
              <span className="mx-2 text-gray-500">/</span>
              <Link to="/services" className="text-gray-500 hover:text-gray-700">Services</Link>
              <span className="mx-2 text-gray-500">/</span>
              <span className="text-gray-900">{service?.title || 'Service'}</span>
            </nav>
          </div>
          
          {!service ? (
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
              <p className="text-gray-600 mb-8">The service you're looking for doesn't exist or has been removed.</p>
              <Link to="/services">
                <Button>Browse All Services</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <div>
                  <div className="rounded-xl overflow-hidden mb-4 bg-gray-100 aspect-[16/9]">
                    <img 
                      src={mainImage} 
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {service.gallery.map((img, index) => (
                      <div 
                        key={index} 
                        className={`rounded-lg overflow-hidden cursor-pointer border-2 ${
                          mainImage === img ? 'border-nitro-500' : 'border-transparent'
                        }`}
                        onClick={() => setMainImage(img)}
                      >
                        <img 
                          src={img} 
                          alt={`${service.title} - image ${index + 1}`}
                          className="w-full h-full object-cover aspect-[16/9]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="bg-white p-6 rounded-xl shadow-glossy">
                    <div className="flex items-center mb-2">
                      <span className="inline-block bg-nitro-50 rounded-full px-2.5 py-0.5 text-xs font-medium text-nitro-700 mr-2">
                        {service.category}
                      </span>
                      <span className="inline-block bg-blue-50 rounded-full px-2.5 py-0.5 text-xs font-medium text-blue-700">
                        {service.game}
                      </span>
                    </div>
                    
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{service.title}</h1>
                    
                    <div className="flex items-center mb-6">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < service.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">
                        {service.rating.toFixed(1)} ({service.reviews} reviews)
                      </span>
                    </div>
                    
                    <p className="text-gray-700 mb-6">{service.fullDescription}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 text-nitro-500 mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-700">100% Secure & Safe</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-nitro-500 mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{service.timeEstimate}</span>
                      </div>
                      <div className="flex items-center">
                        <Trophy className="h-5 w-5 text-nitro-500 mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-700">Pro Boosters</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-nitro-500 mr-3 flex-shrink-0" />
                        <span className="text-sm text-gray-700">Premium Support</span>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Package</h3>
                      
                      <div className="space-y-3">
                        {service.options.map((option) => (
                          <div
                            key={option.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                              selectedOption?.id === option.id
                                ? 'border-nitro-500 bg-nitro-50'
                                : 'border-gray-200 hover:border-nitro-200'
                            }`}
                            onClick={() => setSelectedOption(option)}
                          >
                            <div className="flex items-start">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{option.name}</h4>
                                <p className="text-sm text-gray-600">{option.description}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-gray-900">${option.price.toFixed(2)}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button
                      className="w-full flex items-center justify-center text-base btn-primary"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="mb-12">
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-glossy">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Features</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <div className="bg-nitro-50 rounded-full p-1 mr-3 mt-0.5">
                          <Check className="h-4 w-4 text-nitro-600" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mb-12">
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-glossy">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                  
                  <div className="space-y-4">
                    {service.faqs.map((faq, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg">
                        <button
                          className="flex justify-between items-center w-full p-4 text-left"
                          onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        >
                          <span className="font-medium text-gray-900">{faq.question}</span>
                          {expandedFaq === index ? (
                            <ChevronUp className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          )}
                        </button>
                        
                        {expandedFaq === index && (
                          <div className="p-4 pt-0 text-gray-600 border-t border-gray-200">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <button
                  className="flex items-center text-nitro-600 font-medium"
                  onClick={() => setShowReviews(!showReviews)}
                >
                  {showReviews ? (
                    <>
                      <ChevronUp className="mr-2 h-5 w-5" />
                      Hide Customer Reviews
                    </>
                  ) : (
                    <>
                      <ChevronDown className="mr-2 h-5 w-5" />
                      Show Customer Reviews ({service.reviews})
                    </>
                  )}
                </button>
              </div>
              
              {showReviews && (
                <div className="mb-12">
                  <div className="bg-white p-6 md:p-8 rounded-xl shadow-glossy">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${i < service.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-lg font-medium">{service.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      {[
                        {
                          name: "John D.",
                          avatar: "https://ui-avatars.com/api/?name=John+D&background=0D8ABC&color=fff",
                          rating: 5,
                          date: "2 weeks ago",
                          text: "Excellent service! The boosting was completed much faster than expected, and the communication was great throughout the process."
                        },
                        {
                          name: "Sarah M.",
                          avatar: "https://ui-avatars.com/api/?name=Sarah+M&background=0D8ABC&color=fff",
                          rating: 4,
                          date: "1 month ago",
                          text: "Very satisfied with the boosting service. Professional and efficient. Would use again for sure."
                        },
                        {
                          name: "Alex K.",
                          avatar: "https://ui-avatars.com/api/?name=Alex+K&background=0D8ABC&color=fff",
                          rating: 5,
                          date: "2 months ago",
                          text: "The best boosting service I've used. They were very professional and completed the boost quickly. Highly recommended!"
                        }
                      ].map((review, index) => (
                        <div key={index} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                          <div className="flex items-start">
                            <img 
                              src={review.avatar} 
                              alt={review.name} 
                              className="h-10 w-10 rounded-full mr-4"
                            />
                            <div>
                              <div className="flex items-center">
                                <h4 className="font-medium text-gray-900 mr-2">{review.name}</h4>
                                <span className="text-xs text-gray-500">{review.date}</span>
                              </div>
                              <div className="flex mt-1 mb-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                              <p className="text-gray-600">{review.text}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ServiceDetail;

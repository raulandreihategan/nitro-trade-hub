-- Seed gaming services and related data adapted to current schema
-- Clean up existing entries to avoid duplicates
BEGIN;

DELETE FROM public.service_images WHERE service_id IN (
  'lol-boost-1','lol-coaching-1','lol-skins-1',
  'valorant-boost-1','valorant-coaching-1','valorant-skins-1',
  'fortnite-vbucks-1','fortnite-wins-1','fortnite-challenges-1',
  'wow-gold-1','wow-leveling-1','wow-mythic-1'
);
DELETE FROM public.service_features WHERE service_id IN (
  'lol-boost-1','lol-coaching-1','lol-skins-1',
  'valorant-boost-1','valorant-coaching-1','valorant-skins-1',
  'fortnite-vbucks-1','fortnite-wins-1','fortnite-challenges-1',
  'wow-gold-1','wow-leveling-1','wow-mythic-1'
);
DELETE FROM public.service_options WHERE service_id IN (
  'lol-boost-1','lol-coaching-1','lol-skins-1',
  'valorant-boost-1','valorant-coaching-1','valorant-skins-1',
  'fortnite-vbucks-1','fortnite-wins-1','fortnite-challenges-1',
  'wow-gold-1','wow-leveling-1','wow-mythic-1'
);
DELETE FROM public.service_faqs WHERE service_id IN (
  'lol-boost-1','lol-coaching-1','lol-skins-1',
  'valorant-boost-1','valorant-coaching-1','valorant-skins-1',
  'fortnite-vbucks-1','fortnite-wins-1','fortnite-challenges-1',
  'wow-gold-1','wow-leveling-1','wow-mythic-1'
);
DELETE FROM public.services WHERE id IN (
  'lol-boost-1','lol-coaching-1','lol-skins-1',
  'valorant-boost-1','valorant-coaching-1','valorant-skins-1',
  'fortnite-vbucks-1','fortnite-wins-1','fortnite-challenges-1',
  'wow-gold-1','wow-leveling-1','wow-mythic-1'
);

-- Insert services
INSERT INTO public.services (id, title, description, image, category, game, rating, base_price)
VALUES
('lol-boost-1', 'League of Legends Rank Boost', 'Fast rank boosting from Iron to Challenger by our professional LoL players.', 'https://lh3.googleusercontent.com/ZmxwVZZ8FghZgsAcdeX_m36JCa-t4vSt5f4QmU2HVNzld4H7hmpL9kOvrvdLO2YfT_SQUAjMxhFAEIi0NFSLraZkGQRQSRHRTW16IuDG3gLEqPmWWc9YBty6weGkHbfz1cb5NjWCMJganvbowZYMjrY', 'Boosting', 'League of Legends', 4.8, 49.99),
('lol-coaching-1', 'LoL Pro Coaching', 'One-on-one coaching sessions with Diamond+ players to improve your skills and gameplay.', 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3', 'Coaching', 'League of Legends', 4.9, 29.99),
('lol-skins-1', 'LoL Skins Package', 'Get access to premium and limited edition skins for your favorite champions.', 'https://cdn.turbosmurfs.gg/00_banner_f72769ea_3cbd_4efa_b893_70c14c1434dc_f8b291d6fc.jpg', 'Items & Skins', 'League of Legends', 4.7, 39.99),
('valorant-boost-1', 'Valorant Rank Boosting', 'Boost your Valorant rank from Iron to Radiant with our professional players.', 'https://sherpasboosting.com/app/uploads/2022/04/VALORANT_ICONS_2-e1650375333571.jpg', 'Boosting', 'Valorant', 4.9, 54.99),
('valorant-coaching-1', 'Valorant Aim Training', 'Improve your aim, game sense, and strategies with personalized coaching sessions.', 'https://i.ytimg.com/vi/BEnDSa8IQn4/maxresdefault.jpg', 'Coaching', 'Valorant', 4.8, 24.99),
('valorant-skins-1', 'Valorant Points Package', 'Get Valorant Points to purchase premium weapon skins and battle passes at a discount.', 'https://prosettings.net/cdn-cgi/image/dpr=1%2Cf=auto%2Cfit=cover%2Ch=900%2Cq=85%2Cw=1600/wp-content/uploads/best-valorant-skins.png', 'Currency', 'Valorant', 4.6, 19.99),
('fortnite-vbucks-1', 'Fortnite V-Bucks Bundle', 'Discounted V-Bucks packages to purchase skins, emotes, and Battle Passes.', 'https://cdn.dlcompare.com/game_tetiere/upload/gamecardimage/file/fortnite-v-bucks-file-8b9c0e56.jpg.webp', 'Currency', 'Fortnite', 4.6, 19.99),
('fortnite-wins-1', 'Fortnite Victory Package', 'Get guaranteed wins in Fortnite with our professional players carrying your account.', 'https://cdn-0001.qstv.on.epicgames.com/FaUTBTJENmOlaIjRqr/image/landscape_comp.jpeg', 'Boosting', 'Fortnite', 4.7, 29.99),
('fortnite-challenges-1', 'Battle Pass Challenges', 'Complete all your Battle Pass challenges to unlock exclusive skins and rewards.', 'https://www.gamespot.com/a/uploads/original/43/434805/3566304-road%20trip.jpg', 'Achievements', 'Fortnite', 4.5, 34.99),
('wow-gold-1', 'WoW Gold Package', 'Safe and reliable World of Warcraft gold delivered to your character within hours.', 'https://mmopilot.com/wp-content/uploads/2024/07/image-37-1400x728.png', 'Currency', 'World of Warcraft', 4.8, 24.99),
('wow-leveling-1', 'WoW Power Leveling', 'Level your character from 1 to max level with our efficient boosting service.', 'https://conquestcapped.com/image/cache/catalog/wow-classic/powerleveling/season-of-discovery-leveling-630x400.png', 'Power Leveling', 'World of Warcraft', 4.7, 49.99),
('wow-mythic-1', 'Mythic+ Dungeon Runs', 'Complete high-level Mythic+ dungeons for gear, achievements, and season rewards.', 'https://static.icy-veins.com/wp/wp-content/uploads/2024/09/Clipboard01-5.jpg', 'Boosting', 'World of Warcraft', 4.9, 39.99);

-- Insert service images (galleries)
INSERT INTO public.service_images (service_id, image_url, sort_order) VALUES
-- LoL Boost
('lol-boost-1', 'https://lh3.googleusercontent.com/ZmxwVZZ8FghZgsAcdeX_m36JCa-t4vSt5f4QmU2HVNzld4H7hmpL9kOvrvdLO2YfT_SQUAjMxhFAEIi0NFSLraZkGQRQSRHRTW16IuDG3gLEqPmWWc9YBty6weGkHbfz1cb5NjWCMJganvbowZYMjrY', 1),
('lol-boost-1', 'https://turbo-uploads.s3.eu-north-1.amazonaws.com/Screenshot_6_8b93ee7713.jpg', 2),
('lol-boost-1', 'https://i.pinimg.com/736x/96/2f/6e/962f6e5c3fe88f2fc50b2d4e87366321.jpg', 3),
-- LoL Coaching
('lol-coaching-1', 'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3', 1),
('lol-coaching-1', 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3', 2),
('lol-coaching-1', 'https://guiadeparche.com/wp-content/uploads/2020/12/Fondo-de-Mapa-LOL.png', 3),
-- LoL Skins
('lol-skins-1', 'https://cdn.turbosmurfs.gg/00_banner_f72769ea_3cbd_4efa_b893_70c14c1434dc_f8b291d6fc.jpg', 1),
('lol-skins-1', 'https://blog.ggboost.com/bl-content/uploads/pages/a249c19a8375a51984f6de285e5287c6/lol-worlds-2023-skins-release-date-2.webp', 2),
('lol-skins-1', 'https://esports.as.com/2022/11/15/league-of-legends/ultimas-skins-LoL-tematica-Invierno_1629447056_1076037_1440x810.jpg', 3),
-- Valorant Boost
('valorant-boost-1', 'https://sherpasboosting.com/app/uploads/2022/04/VALORANT_ICONS_2-e1650375333571.jpg', 1),
('valorant-boost-1', 'https://askboosters.com/wp-content/uploads/2022/01/%D0%A1%D0%BD%D0%B8%D0%BC%D0%BE%D0%BA-%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0-2024-07-09-064259-1024x258.png', 2),
('valorant-boost-1', 'https://boostcsgo.net/front/img/bg-valorant.webp', 3),
-- Valorant Coaching
('valorant-coaching-1', 'https://i.ytimg.com/vi/BEnDSa8IQn4/maxresdefault.jpg', 1),
('valorant-coaching-1', 'https://trackercdn.com/ghost/images/2023/9/17232_range.jpg', 2),
('valorant-coaching-1', 'https://aiming.pro/storage/posts/April2020/lxLdvE87skFBnadugNxN.jpg', 3),
-- Valorant Skins (Points)
('valorant-skins-1', 'https://prosettings.net/cdn-cgi/image/dpr=1%2Cf=auto%2Cfit=cover%2Ch=900%2Cq=85%2Cw=1600/wp-content/uploads/best-valorant-skins.png', 1),
('valorant-skins-1', 'https://cdn.sanity.io/images/ccckgjf9/production/0add220c161c00d3a867ee45a91613a874c73658-1250x696.png?max-h=1080&max-w=1920&q=50&fit=scale&auto=format', 2),
('valorant-skins-1', 'https://d2fryjlmubyuuh.cloudfront.net/wp-content/uploads/2024/08/28153027/valo-points-jpg.webp', 3),
-- Fortnite V-Bucks
('fortnite-vbucks-1', 'https://cdn.dlcompare.com/game_tetiere/upload/gamecardimage/file/fortnite-v-bucks-file-8b9c0e56.jpg.webp', 1),
('fortnite-vbucks-1', 'https://cdn1.epicgames.com/offer/fn/FNECO_32-00_VbuckStoreArtUpdate_5000_EGS_2560x1440_2560x1440-565163af171a0ebcb0047636b584ac4d', 2),
('fortnite-vbucks-1', 'https://store-images.s-microsoft.com/image/apps.30391.71999796408230842.3e86f9b2-2b2a-4f08-b968-a949de7ff3f5.ffd7e7f5-67ee-4643-96b8-421c4e2c3204?mode=scale&q=90&h=1080&w=1920&background=%23FFFFFF', 3),
-- Fortnite Wins
('fortnite-wins-1', 'https://cdn-0001.qstv.on.epicgames.com/FaUTBTJENmOlaIjRqr/image/landscape_comp.jpeg', 1),
('fortnite-wins-1', 'https://static1.srcdn.com/wordpress/wp-content/uploads/2020/06/Fortnite-Victory-Royale.jpg', 2),
('fortnite-wins-1', 'https://www.tigertimesonline.com/wp-content/uploads/2018/05/t.jpg', 3),
-- Fortnite Challenges
('fortnite-challenges-1', 'https://www.gamespot.com/a/uploads/original/43/434805/3566304-road%20trip.jpg', 1),
('fortnite-challenges-1', 'https://assetsio.gnwcdn.com/fortnite-season8-battle-pass-header.jpg?width=1600&height=900&fit=crop&quality=100&format=png&enable=upscale&auto=webp', 2),
('fortnite-challenges-1', 'https://thespike-strapi-cms.s3.us-east-1.amazonaws.com/How_much_is_fortnite_battle_pass_11_7fcd7c4ac4.jpg', 3),
-- WoW Gold
('wow-gold-1', 'https://mmopilot.com/wp-content/uploads/2024/07/image-37-1400x728.png', 1),
('wow-gold-1', 'https://wow.zamimg.com/uploads/screenshots/normal/1085061.jpg', 2),
('wow-gold-1', 'https://conquestcapped.com/image/cache/catalog/wow-classic/vanilla-gold-630x400.png', 3),
-- WoW Leveling
('wow-leveling-1', 'https://conquestcapped.com/image/cache/catalog/wow-classic/powerleveling/season-of-discovery-leveling-630x400.png', 1),
('wow-leveling-1', 'https://askboosters.com/wp-content/uploads/2023/11/1-1024x568.jpg', 2),
('wow-leveling-1', 'https://krakenboost.com/wp-content/uploads/2022/12/dragonflight-leveling-60-70-boost.jpg', 3),
-- WoW Mythic+
('wow-mythic-1', 'https://static.icy-veins.com/wp/wp-content/uploads/2024/09/Clipboard01-5.jpg', 1),
('wow-mythic-1', 'https://static0.gamerantimages.com/wordpress/wp-content/uploads/2023/06/wow-8.jpg', 2),
('wow-mythic-1', 'https://i.ytimg.com/vi/-4JWp-BRswc/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBhP8BWZu9OHlTgEl3FNaNhJm-KMw', 3);

-- Insert service features
INSERT INTO public.service_features (service_id, feature, sort_order) VALUES
-- LoL Boost features
('lol-boost-1', 'Professional boosters with 5+ years of experience', 1),
('lol-boost-1', 'Secure VPN protection for account safety', 2),
('lol-boost-1', 'Regular progress updates and communication', 3),
('lol-boost-1', 'Champion preference selection available', 4),
('lol-boost-1', 'Duo boost option available for safer boosting', 5),
-- LoL Coaching features
('lol-coaching-1', 'One-on-one sessions with Diamond+ players', 1),
('lol-coaching-1', 'Role-specific coaching for all positions', 2),
('lol-coaching-1', 'Champion mastery guidance', 3),
('lol-coaching-1', 'VOD review and analysis', 4),
('lol-coaching-1', 'Custom practice drills and exercises', 5),
-- LoL Skins features
('lol-skins-1', 'Access to premium and limited edition skins', 1),
('lol-skins-1', 'Safe and secure delivery methods', 2),
('lol-skins-1', 'Champion-specific skin bundles available', 3),
('lol-skins-1', 'Includes rare legacy skins', 4),
('lol-skins-1', 'Account safety guaranteed', 5),
-- Valorant Boost features
('valorant-boost-1', 'Boosting by Immortal and Radiant players', 1),
('valorant-boost-1', 'Secure VPN protection for account safety', 2),
('valorant-boost-1', 'Agent preference selection available', 3),
('valorant-boost-1', 'Regular progress updates via Discord or email', 4),
('valorant-boost-1', 'Stream option available for complete transparency', 5),
-- Valorant Coaching features
('valorant-coaching-1', 'Personalized aim training routines', 1),
('valorant-coaching-1', 'Crosshair and sensitivity optimization', 2),
('valorant-coaching-1', 'Agent-specific ability usage training', 3),
('valorant-coaching-1', 'VOD review and analysis', 4),
('valorant-coaching-1', 'Map-specific strategies and callouts', 5),
-- Valorant Points features
('valorant-skins-1', 'Discounted Valorant Points packages', 1),
('valorant-skins-1', 'Safe and secure delivery methods', 2),
('valorant-skins-1', 'Use for premium weapon skins', 3),
('valorant-skins-1', 'Purchase battle passes and agent contracts', 4),
('valorant-skins-1', 'Account safety guaranteed', 5),
-- Fortnite V-Bucks features
('fortnite-vbucks-1', 'Discounted V-Bucks packages', 1),
('fortnite-vbucks-1', 'Safe and secure delivery methods', 2),
('fortnite-vbucks-1', 'Use for skins, emotes, and battle passes', 3),
('fortnite-vbucks-1', 'Available for all platforms', 4),
('fortnite-vbucks-1', 'Account safety guaranteed', 5),
-- Fortnite Wins features
('fortnite-wins-1', 'Guaranteed Victory Royales', 1),
('fortnite-wins-1', 'Professional players with high K/D ratios', 2),
('fortnite-wins-1', 'Option to spectate and learn or take a break', 3),
('fortnite-wins-1', 'Unlock season victory umbrellas', 4),
('fortnite-wins-1', 'Complete win-based challenges', 5),
-- Fortnite Challenges features
('fortnite-challenges-1', 'Complete weekly challenges and quests', 1),
('fortnite-challenges-1', 'Unlock all Battle Pass cosmetics and rewards', 2),
('fortnite-challenges-1', 'Earn V-Bucks from Battle Pass progression', 3),
('fortnite-challenges-1', 'Complete special event challenges', 4),
('fortnite-challenges-1', 'Safe and efficient challenge completion', 5),
-- WoW Gold features
('wow-gold-1', 'Safe and secure gold delivery', 1),
('wow-gold-1', 'Competitive rates', 2),
('wow-gold-1', 'Available for all realms and factions', 3),
('wow-gold-1', 'Fast delivery (usually within 1-3 hours)', 4),
('wow-gold-1', '24/7 customer support', 5),
-- WoW Leveling features
('wow-leveling-1', 'Fast and efficient leveling', 1),
('wow-leveling-1', 'Experienced boosters who know optimal routes', 2),
('wow-leveling-1', 'Basic gear acquisition during leveling', 3),
('wow-leveling-1', 'Professional play that minimizes death and downtime', 4),
('wow-leveling-1', 'Regular progress updates', 5),
-- WoW Mythic+ features
('wow-mythic-1', 'Guaranteed key completion', 1),
('wow-mythic-1', 'Team of 4 experienced players', 2),
('wow-mythic-1', 'Available for all current dungeons', 3),
('wow-mythic-1', 'Timed runs for maximum rewards', 4),
('wow-mythic-1', 'Loot trading for targeted gear acquisition', 5);

-- Insert service options (mapped to current schema)
INSERT INTO public.service_options (service_id, option_id, name, price, highlighted, best_value, delivery_time, sort_order) VALUES
-- LoL Boost options
('lol-boost-1','bronze-to-silver','Bronze to Silver',49.99,false,false,'24-72 hours depending on ranks',1),
('lol-boost-1','silver-to-gold','Silver to Gold',79.99,true,false,'24-72 hours depending on ranks',2),
('lol-boost-1','gold-to-platinum','Gold to Platinum',119.99,false,true,'24-72 hours depending on ranks',3),
-- LoL Coaching options
('lol-coaching-1','single-session','Single Coaching Session',29.99,false,false,'1-2 hours per session',1), 
('lol-coaching-1','three-sessions','Three Session Package',79.99,true,false,'1-2 hours per session',2),
('lol-coaching-1','five-sessions','Five Session Package',119.99,false,true,'1-2 hours per session',3),
-- LoL Skins options
('lol-skins-1','basic-pack','Basic Skin Pack',39.99,false,false,'Delivery within 24 hours',1),
('lol-skins-1','premium-pack','Premium Skin Pack',69.99,true,false,'Delivery within 24 hours',2),
('lol-skins-1','ultimate-pack','Ultimate Skin Pack',119.99,false,true,'Delivery within 24 hours',3),
-- Valorant Boost options
('valorant-boost-1','iron-to-bronze','Iron to Bronze',54.99,false,false,'24-72 hours depending on ranks',1),
('valorant-boost-1','bronze-to-silver','Bronze to Silver',74.99,true,false,'24-72 hours depending on ranks',2),
('valorant-boost-1','silver-to-gold','Silver to Gold',99.99,false,true,'24-72 hours depending on ranks',3),
-- Valorant Coaching options
('valorant-coaching-1','aim-fundamentals','Aim Fundamentals',24.99,false,false,'1-2 hours per session',1),
('valorant-coaching-1','aim-and-positioning','Aim & Positioning Package',59.99,true,false,'1-2 hours per session',2),
('valorant-coaching-1','complete-training','Complete Player Package',89.99,false,true,'1-2 hours per session',3),
-- Valorant Points options
('valorant-skins-1','small-vp','1000 Valorant Points',19.99,false,false,'Delivery within 24 hours',1),
('valorant-skins-1','medium-vp','2800 Valorant Points',39.99,true,false,'Delivery within 24 hours',2),
('valorant-skins-1','large-vp','5350 Valorant Points',69.99,false,true,'Delivery within 24 hours',3),
-- Fortnite V-Bucks options
('fortnite-vbucks-1','small-vbucks','1000 V-Bucks',19.99,false,false,'Delivery within 24 hours',1),
('fortnite-vbucks-1','medium-vbucks','2800 V-Bucks',39.99,true,false,'Delivery within 24 hours',2),
('fortnite-vbucks-1','large-vbucks','5000 V-Bucks',69.99,false,true,'Delivery within 24 hours',3),
-- Fortnite Wins options
('fortnite-wins-1','single-win','Single Victory',29.99,false,false,'Typically 1-3 hours per win',1),
('fortnite-wins-1','triple-win','Triple Victory Pack',69.99,true,false,'Typically 1-3 hours per win',2),
('fortnite-wins-1','premium-win','Premium Victory Pack',99.99,false,true,'Typically 1-3 hours per win',3),
-- Fortnite Challenges options
('fortnite-challenges-1','weekly-challenges','Weekly Challenges',34.99,false,false,'24-72 hours depending on challenge volume',1),
('fortnite-challenges-1','monthly-challenges','Monthly Challenge Pack',89.99,true,false,'24-72 hours depending on challenge volume',2),
('fortnite-challenges-1','full-season','Full Season Package',149.99,false,true,'24-72 hours depending on challenge volume',3),
-- WoW Gold options
('wow-gold-1','small-gold','10,000 Gold',24.99,false,false,'Delivery within 1-3 hours',1),
('wow-gold-1','medium-gold','50,000 Gold',99.99,true,false,'Delivery within 1-3 hours',2),
('wow-gold-1','large-gold','200,000 Gold',349.99,false,true,'Delivery within 1-3 hours',3),
-- WoW Leveling options
('wow-leveling-1','starter-level','Starter Leveling (1-30)',49.99,false,false,'3-7 days depending on level range',1),
('wow-leveling-1','mid-level','Mid Leveling (30-50)',69.99,true,false,'3-7 days depending on level range',2),
('wow-leveling-1','endgame-level','Endgame Leveling (50-70)',99.99,false,true,'3-7 days depending on level range',3),
-- WoW Mythic+ options
('wow-mythic-1','mythic-5','Mythic+5 Run',39.99,false,false,'30-60 minutes per dungeon',1),
('wow-mythic-1','mythic-10','Mythic+10 Run',69.99,true,false,'30-60 minutes per dungeon',2),
('wow-mythic-1','mythic-15','Mythic+15 Run',99.99,false,true,'30-60 minutes per dungeon',3);

-- Insert FAQs
INSERT INTO public.service_faqs (service_id, question, answer, sort_order) VALUES
-- LoL Boost FAQs
('lol-boost-1','How long does the boosting process take?','The time varies depending on your current rank and your target rank. Generally, it takes 24-72 hours to complete a standard division boosting order.',1),
('lol-boost-1','Is my account safe?','Yes, we take security very seriously. Our boosters use VPN protection and follow strict security protocols to ensure your account\'s safety.',2),
('lol-boost-1','Can I play on my account during the boosting process?','We recommend not playing on your account during the boosting process to avoid any potential issues or delays.',3),
('lol-boost-1','What if I\'m not satisfied with the service?','We have a satisfaction guarantee. If you\'re not happy with our service, please contact our support team, and we\'ll make it right.',4),
-- LoL Coaching FAQs
('lol-coaching-1','How do I schedule a coaching session?','After purchasing, you\'ll receive a link to our scheduling system where you can choose a time that works for you and your coach.',1),
('lol-coaching-1','What do I need for a coaching session?','You\'ll need a stable internet connection, Discord for communication, and League of Legends installed on your device.',2),
('lol-coaching-1','Can I request a specific coach?','Yes, you can request a specific coach when scheduling your session, subject to availability.',3),
('lol-coaching-1','What if I need to reschedule?','You can reschedule your session up to 24 hours before the scheduled time. Please contact our support team if you need to reschedule with less notice.',4),
-- LoL Skins FAQs
('lol-skins-1','How do I receive the skins?','After purchase, we\'ll contact you to arrange the delivery of the skins to your account using our secure gifting method.',1),
('lol-skins-1','Can I choose specific skins?','Yes, with our Premium and Ultimate packages, you can select specific skins that you want (subject to availability).',2),
('lol-skins-1','What if a skin I want is not available?','If a specific skin you requested is not available, we\'ll offer you alternatives or provide a partial refund for that skin.',3),
('lol-skins-1','Is this service against League of Legends terms of service?','Our skin delivery methods are designed to comply with Riot Games\' terms of service to ensure your account remains in good standing.',4),
-- Valorant Boost FAQs
('valorant-boost-1','How long does the boosting process take?','The time varies depending on your current rank and your target rank. Generally, it takes 24-72 hours to complete a standard rank boosting order.',1),
('valorant-boost-1','Is my account safe?','Yes, we take security very seriously. Our boosters use VPN protection and follow strict security protocols to ensure your account\'s safety.',2),
('valorant-boost-1','Can I specify which agents to play?','Yes, you can specify which agents you prefer our boosters to play, which helps make the boosting less detectable.',3),
('valorant-boost-1','What if I get banned?','While our methods minimize the risk of bans, in the extremely rare case of a ban occurring as a direct result of our boosting service, we offer a full refund or a replacement account of similar value.',4),
-- Valorant Coaching FAQs
('valorant-coaching-1','How do the coaching sessions work?','Sessions are conducted over Discord with screen sharing. Your coach will watch you play, provide real-time feedback, and assign specific training exercises.',1),
('valorant-coaching-1','Do I need any special equipment?','A gaming mouse, headset with microphone, and Discord is required. We also recommend having the ability to record your gameplay for review.',2),
('valorant-coaching-1','Can coaching really improve my aim?','Yes, our structured approach to aim training has shown significant improvements for players at all skill levels, with most seeing results within 1-2 weeks of consistent practice.',3),
('valorant-coaching-1','Who are your coaches?','Our coaches are Immortal and Radiant rank players, many with competitive tournament experience and proven teaching abilities.',4),
-- Valorant Points FAQs
('valorant-skins-1','How do I receive the Valorant Points?','After purchase, we\'ll contact you to arrange the delivery of the VP to your account using our secure method.',1),
('valorant-skins-1','How long does delivery take?','We typically deliver Valorant Points within 24 hours of purchase confirmation.',2),
('valorant-skins-1','Is this service against Valorant\'s terms of service?','Our delivery methods are designed to comply with Riot Games\' terms of service to ensure your account remains in good standing.',3),
('valorant-skins-1','What payment methods do you accept?','We accept credit/debit cards, PayPal, and various cryptocurrency options for all purchases.',4),
-- Fortnite V-Bucks FAQs
('fortnite-vbucks-1','How do I receive the V-Bucks?','After purchase, we\'ll contact you to arrange the delivery of the V-Bucks to your Fortnite account using our secure method.',1),
('fortnite-vbucks-1','How long does delivery take?','We typically deliver V-Bucks within 24 hours of purchase confirmation.',2),
('fortnite-vbucks-1','Is this service available for all platforms?','Yes, our V-Bucks service is available for PC, PlayStation, Xbox, Nintendo Switch, and mobile platforms.',3),
('fortnite-vbucks-1','Is this service against Fortnite\'s terms of service?','Our delivery methods are designed to comply with Epic Games\' terms of service to ensure your account remains in good standing.',4),
-- Fortnite Wins FAQs
('fortnite-wins-1','How does the Victory Package work?','After purchase, we\'ll arrange a time for one of our professional players to log into your account and play matches until achieving the guaranteed number of wins.',1),
('fortnite-wins-1','Can I watch while the pro plays on my account?','Yes, we offer a streaming option where you can watch the games live, communicate with the player, and learn strategies.',2),
('fortnite-wins-1','How long does it take to get a win?','Our pros typically secure a Victory Royale within 1-3 hours, depending on game conditions and lobby difficulty.',3),
('fortnite-wins-1','Is my account safe?','Yes, we use secure methods to access your account and follow strict security protocols to ensure your account\'s safety.',4),
-- Fortnite Challenges FAQs
('fortnite-challenges-1','How long does it take to complete the challenges?','Completion time varies depending on the number and difficulty of challenges. Weekly challenges typically take 24-48 hours, while a full season package may take 5-7 days.',1),
('fortnite-challenges-1','Will you use my V-Bucks or make purchases?','No, we will never use your V-Bucks or make any purchases on your account without explicit permission.',2),
('fortnite-challenges-1','Can I specify which challenges to prioritize?','Yes, you can specify which challenges or rewards you\'d like us to focus on first.',3),
('fortnite-challenges-1','Is this service against Fortnite\'s terms of service?','Our challenge completion methods are designed to comply with Epic Games\' terms of service to ensure your account remains in good standing.',4),
-- WoW Gold FAQs
('wow-gold-1','How is the gold delivered?','After purchase, we\'ll contact you to arrange a meeting in-game where our courier will trade you the gold directly.',1),
('wow-gold-1','How long does delivery take?','We typically deliver gold within 1-3 hours of purchase confirmation, depending on your realm and availability.',2),
('wow-gold-1','Is this service available for all realms?','Yes, we offer gold delivery on all US and EU realms, for both Retail and Classic WoW.',3),
('wow-gold-1','Is buying gold safe?','We use sophisticated delivery methods to minimize any risk to your account. Our methods have been refined over years to be as safe as possible.',4),
-- WoW Leveling FAQs
('wow-leveling-1','How long does power leveling take?','Leveling time varies depending on the level range, but typically takes 3-7 days for a full 1-70 leveling service. Specific level ranges may be completed more quickly.',1),
('wow-leveling-1','Will I get gear while leveling?','Yes, our boosters will acquire appropriate gear from quests and dungeons during the leveling process to ensure your character is properly equipped.',2),
('wow-leveling-1','Can I specify a leveling path or zones?','Yes, you can provide specific instructions about preferred zones, quest lines, or leveling methods and we\'ll try to accommodate your requests.',3),
('wow-leveling-1','Is my account safe during power leveling?','Yes, we use secure VPN connections and have strict security protocols to ensure your account remains safe during the leveling process.',4),
-- WoW Mythic+ FAQs
('wow-mythic-1','How do Mythic+ runs work?','After purchase, we\'ll schedule a time for the run. You\'ll join our team of 4 professional players who will carry you through the dungeon of your choice at the selected key level.',1),
('wow-mythic-1','Can I choose which dungeon to run?','Yes, you can select any dungeon that\'s currently available in the Mythic+ rotation.',2),
('wow-mythic-1','Do I get to keep all the loot?','You\'ll receive all loot that drops directly for you, and our team will trade you any items they don\'t need that match your loot specialization.',3),
('wow-mythic-1','What if we fail to complete the key in time?','We guarantee completion of the dungeon, even if not within the time limit. If we fail to complete the dungeon at all (extremely rare), we\'ll offer a free re-run or refund.',4);

COMMIT;
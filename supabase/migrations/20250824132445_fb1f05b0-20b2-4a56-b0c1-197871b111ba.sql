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
('lol-coaching-1', 'https://guiadeparche.com/wp-content/uploads/2020/12/Fondo-de-Mapa-LOL.png', 3);

-- Insert service options (first batch)
INSERT INTO public.service_options (service_id, option_id, name, price, highlighted, best_value, delivery_time, sort_order) VALUES
-- LoL Boost options
('lol-boost-1','bronze-to-silver','Bronze to Silver',49.99,false,false,'24-72 hours depending on ranks',1),
('lol-boost-1','silver-to-gold','Silver to Gold',79.99,true,false,'24-72 hours depending on ranks',2),
('lol-boost-1','gold-to-platinum','Gold to Platinum',119.99,false,true,'24-72 hours depending on ranks',3),
-- LoL Coaching options
('lol-coaching-1','single-session','Single Coaching Session',29.99,false,false,'1-2 hours per session',1), 
('lol-coaching-1','three-sessions','Three Session Package',79.99,true,false,'1-2 hours per session',2),
('lol-coaching-1','five-sessions','Five Session Package',119.99,false,true,'1-2 hours per session',3);

-- Insert service features (first batch)
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
('lol-coaching-1', 'Custom practice drills and exercises', 5);

-- Insert FAQs (first batch)
INSERT INTO public.service_faqs (service_id, question, answer, sort_order) VALUES
-- LoL Boost FAQs
('lol-boost-1','How long does the boosting process take?','The time varies depending on your current rank and your target rank. Generally, it takes 24-72 hours to complete a standard division boosting order.',1),
('lol-boost-1','Is my account safe?','Yes, we take security very seriously. Our boosters use VPN protection and follow strict security protocols to ensure your account safety.',2),
('lol-boost-1','Can I play on my account during the boosting process?','We recommend not playing on your account during the boosting process to avoid any potential issues or delays.',3),
('lol-boost-1','What if I am not satisfied with the service?','We have a satisfaction guarantee. If you are not happy with our service, please contact our support team, and we will make it right.',4),
-- LoL Coaching FAQs
('lol-coaching-1','How do I schedule a coaching session?','After purchasing, you will receive a link to our scheduling system where you can choose a time that works for you and your coach.',1),
('lol-coaching-1','What do I need for a coaching session?','You will need a stable internet connection, Discord for communication, and League of Legends installed on your device.',2),
('lol-coaching-1','Can I request a specific coach?','Yes, you can request a specific coach when scheduling your session, subject to availability.',3),
('lol-coaching-1','What if I need to reschedule?','You can reschedule your session up to 24 hours before the scheduled time. Please contact our support team if you need to reschedule with less notice.',4);

COMMIT;
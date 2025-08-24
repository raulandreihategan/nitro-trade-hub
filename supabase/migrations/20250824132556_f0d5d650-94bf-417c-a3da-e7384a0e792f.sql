-- Continue seeding the remaining gaming services data
BEGIN;

-- Insert remaining service images
INSERT INTO public.service_images (service_id, image_url, sort_order) VALUES
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

-- Insert remaining service options
INSERT INTO public.service_options (service_id, option_id, name, price, highlighted, best_value, delivery_time, sort_order) VALUES
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

COMMIT;
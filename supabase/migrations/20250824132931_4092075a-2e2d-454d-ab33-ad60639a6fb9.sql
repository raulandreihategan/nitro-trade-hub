-- Add three gift cards to services table
BEGIN;

-- Remove if already exist to avoid conflicts
DELETE FROM public.services WHERE id IN ('arsmate-gift','turbobit-gift','centercoast-gift');

-- Insert gift cards
INSERT INTO public.services (id, title, description, image, category, game, rating, base_price)
VALUES
('arsmate-gift', 'Arsmate Gift Card', 'Digital voucher for Arsmate platform services and exclusive content access. Great for content creators.', 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3', 'Gift Cards', 'All Games', 4.7, 35.00),
('turbobit-gift', 'Turbobit Gift Card', 'Digital gift card for Turbobit premium services and downloads. Perfect for file sharing enthusiasts.', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3', 'Gift Cards', 'All Games', 4.8, 25.00),
('centercoast-gift', 'CenterCoast Gift Card', 'Redeemable gift card for CenterCoast gaming services and premium features. Ideal for gamers.', 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3', 'Gift Cards', 'All Games', 4.9, 50.00);

COMMIT;
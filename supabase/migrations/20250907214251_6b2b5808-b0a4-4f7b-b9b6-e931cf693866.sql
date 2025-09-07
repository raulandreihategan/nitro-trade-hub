-- Insert gift card services into the services table
INSERT INTO public.services (id, title, description, image, rating, base_price, category, game, created_at, updated_at) VALUES
('turbobit-gift', 'Turbobit Gift Card', 'Digital gift card for Turbobit premium services and downloads. Perfect for file sharing enthusiasts.', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTEpBYAl7w-4xn_IZAiVGDCdTxQM_5qNsbWA&s', 4.8, 25.00, 'Gift Cards', 'General', now(), now()),
('central-coast-gift', 'Central Coast Gift Card', 'Redeemable gift card for Central Coast gaming services and premium features. Ideal for gamers.', 'https://thedropstore.com/cdn/shop/products/GIFT_CARD_600_1024x.jpg?v=1582014610', 4.9, 50.00, 'Gift Cards', 'General', now(), now()),
('arsmate-gift', 'Arsmate Gift Card', 'Digital voucher for Arsmate platform services and exclusive content access. Great for content creators.', 'https://yt3.googleusercontent.com/bo9Qqa3WY6OQ8MQ4lbrz7PfGOBIjJgC_Ko1VwcOF1Mq8If9TtwspUwBVVqo6ytnkZMhM9Nc2244=s900-c-k-c0x00ffffff-no-rj', 4.7, 35.00, 'Gift Cards', 'General', now(), now()),
('custom-gift', 'Custom Amount Gift Card', 'Choose your own amount for the perfect gift. No minimum required - perfect for any occasion.', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=1470&ixlib=rb-4.0.3', 5.0, 0, 'Gift Cards', 'General', now(), now())
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  image = EXCLUDED.image,
  rating = EXCLUDED.rating,
  base_price = EXCLUDED.base_price,
  category = EXCLUDED.category,
  game = EXCLUDED.game,
  updated_at = now();
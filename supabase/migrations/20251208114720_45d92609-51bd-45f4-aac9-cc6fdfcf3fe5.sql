-- Insert Myproducts PRO Gift Card service
INSERT INTO public.services (id, title, description, full_description, image, base_price, rating, reviews, category, game, time_estimate)
VALUES (
  'myproducts-pro-gift',
  'Myproducts PRO Gift Card',
  'Gift card for Myproducts PRO subscription and services. Perfect for gifting premium access.',
  'Give the gift of Myproducts PRO! This gift card can be redeemed for Myproducts PRO subscriptions, premium features, and services. The recipient will receive a unique code via email that they can use to activate their benefits. Perfect for friends, family, or colleagues who want to unlock the full potential of Myproducts PRO.',
  'https://myproducts.pro/wp-content/uploads/2025/10/logomyproducts_transparente-300x108.png',
  10.00,
  5.0,
  0,
  'Gift Cards',
  'Myproducts PRO',
  'Instant email delivery'
);

-- Insert service options
INSERT INTO public.service_options (service_id, option_id, name, description, price, sort_order, highlighted, best_value)
VALUES
  ('myproducts-pro-gift', 'pro-10', '$10 Gift Card', 'Perfect for trying out premium features', 10.00, 1, false, false),
  ('myproducts-pro-gift', 'pro-25', '$25 Gift Card', 'Great value for regular users', 25.00, 2, false, false),
  ('myproducts-pro-gift', 'pro-50', '$50 Gift Card', 'Best for power users', 50.00, 3, true, true),
  ('myproducts-pro-gift', 'pro-100', '$100 Gift Card', 'Maximum savings and benefits', 100.00, 4, false, false);

-- Insert service features
INSERT INTO public.service_features (service_id, feature, sort_order)
VALUES
  ('myproducts-pro-gift', 'Instant delivery via email', 1),
  ('myproducts-pro-gift', 'Redeemable for any Myproducts PRO service', 2),
  ('myproducts-pro-gift', 'Never expires', 3),
  ('myproducts-pro-gift', 'Easy to redeem with unique code', 4),
  ('myproducts-pro-gift', 'Perfect gift for any occasion', 5);

-- Insert service FAQs
INSERT INTO public.service_faqs (service_id, question, answer, sort_order)
VALUES
  ('myproducts-pro-gift', 'How will the gift card be delivered?', 'The gift card code will be sent instantly to the email address provided during checkout.', 1),
  ('myproducts-pro-gift', 'How does the recipient redeem the gift card?', 'The recipient can redeem the gift card by entering the unique code on the Myproducts PRO website during checkout or in their account settings.', 2),
  ('myproducts-pro-gift', 'Does the gift card expire?', 'No, Myproducts PRO gift cards never expire and can be redeemed at any time.', 3),
  ('myproducts-pro-gift', 'Can I use multiple gift cards?', 'Yes, multiple gift cards can be combined and applied to a single account.', 4);
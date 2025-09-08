-- Add service options for custom gift card (if no amount specified)
INSERT INTO public.service_options (service_id, option_id, name, price, delivery_time, highlighted, best_value, sort_order) VALUES
('custom-gift', 'custom-10', '$10 Gift Card', 10.00, 'Instant delivery', false, false, 1),
('custom-gift', 'custom-25', '$25 Gift Card', 25.00, 'Instant delivery', true, false, 2),
('custom-gift', 'custom-50', '$50 Gift Card', 50.00, 'Instant delivery', false, true, 3),
('custom-gift', 'custom-100', '$100 Gift Card', 100.00, 'Instant delivery', false, false, 4);

-- Add features for custom gift card
INSERT INTO public.service_features (service_id, feature, sort_order) VALUES
('custom-gift', 'Choose any amount - no minimum or maximum', 1),
('custom-gift', 'Instant digital delivery via email', 2),
('custom-gift', 'Redeemable on any gaming service', 3),
('custom-gift', 'Never expires - use whenever you want', 4),
('custom-gift', 'Perfect for any gaming enthusiast', 5);

-- Add FAQs for custom gift card
INSERT INTO public.service_faqs (service_id, question, answer, sort_order) VALUES
('custom-gift', 'How do I choose a custom amount?', 'You can enter any amount you want when viewing the gift card. There is no minimum or maximum limit.', 1),
('custom-gift', 'How will I receive my gift card?', 'Your digital gift card will be delivered instantly to your email address after purchase completion.', 2),
('custom-gift', 'Does the gift card expire?', 'No, our gift cards never expire. You can use them whenever you want.', 3),
('custom-gift', 'What can I use the gift card for?', 'Gift cards can be redeemed for any gaming service, boosting, coaching, or in-game currency on our platform.', 4),
('custom-gift', 'Can I buy this as a gift for someone else?', 'Absolutely! Just enter the recipient''s email address during checkout and they''ll receive the gift card directly.', 5);
-- Complete gift cards with options and richer descriptions
BEGIN;

-- Ensure no duplicate options
DELETE FROM public.service_options WHERE service_id IN ('arsmate-gift','turbobit-gift','centercoast-gift');

-- Update descriptions for clarity
UPDATE public.services
SET description = 'Flexible Arsmate digital gift card. Instant email delivery. Redeemable across Arsmate services and content. No fees or expiry.'
WHERE id = 'arsmate-gift';

UPDATE public.services
SET description = 'Turbobit premium gift card for cloud storage and downloads. Instant email delivery. Easy redemption. No fees or expiry.'
WHERE id = 'turbobit-gift';

UPDATE public.services
SET description = 'CenterCoast gaming services gift card. Instant delivery via email. Use for boosts, coaching, and more. No fees or expiry.'
WHERE id = 'centercoast-gift';

-- Insert gift card denomination options
INSERT INTO public.service_options (service_id, option_id, name, price, highlighted, best_value, delivery_time, sort_order)
VALUES
-- Arsmate
('arsmate-gift','arsmate-25','$25 Arsmate Gift Card',25.00,true,false,'Instant email delivery',1),
('arsmate-gift','arsmate-50','$50 Arsmate Gift Card',50.00,false,false,'Instant email delivery',2),
('arsmate-gift','arsmate-100','$100 Arsmate Gift Card',100.00,false,true,'Instant email delivery',3),
-- Turbobit
('turbobit-gift','turbobit-25','$25 Turbobit Gift Card',25.00,true,false,'Instant email delivery',1),
('turbobit-gift','turbobit-50','$50 Turbobit Gift Card',50.00,false,false,'Instant email delivery',2),
('turbobit-gift','turbobit-100','$100 Turbobit Gift Card',100.00,false,true,'Instant email delivery',3),
-- CenterCoast
('centercoast-gift','centercoast-25','$25 CenterCoast Gift Card',25.00,true,false,'Instant email delivery',1),
('centercoast-gift','centercoast-50','$50 CenterCoast Gift Card',50.00,false,false,'Instant email delivery',2),
('centercoast-gift','centercoast-100','$100 CenterCoast Gift Card',100.00,false,true,'Instant email delivery',3);

COMMIT;
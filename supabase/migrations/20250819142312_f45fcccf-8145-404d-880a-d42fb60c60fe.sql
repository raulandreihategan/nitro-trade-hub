-- Add missing currency and original_amount columns to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS currency text,
ADD COLUMN IF NOT EXISTS original_amount numeric;
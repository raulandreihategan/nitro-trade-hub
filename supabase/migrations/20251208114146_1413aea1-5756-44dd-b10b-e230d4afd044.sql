-- Add missing columns to services table for complete service management
ALTER TABLE public.services 
ADD COLUMN IF NOT EXISTS full_description TEXT,
ADD COLUMN IF NOT EXISTS time_estimate TEXT,
ADD COLUMN IF NOT EXISTS reviews INTEGER DEFAULT 0;

-- Add description column to service_options table
ALTER TABLE public.service_options 
ADD COLUMN IF NOT EXISTS description TEXT;
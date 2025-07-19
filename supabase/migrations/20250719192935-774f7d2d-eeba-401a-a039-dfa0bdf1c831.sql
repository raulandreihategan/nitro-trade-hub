-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for HTTP requests if not already enabled  
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a cron job to run the create-test-order function every week
-- This runs every Sunday at 2 AM
SELECT cron.schedule(
  'create-weekly-test-order',
  '0 2 * * 0',
  $$
  SELECT
    net.http_post(
        url:='https://fmivcwetejazikuyfmqn.supabase.co/functions/v1/create-test-order',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtaXZjd2V0ZWphemlrdXlmbXFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0NjE5MTMsImV4cCI6MjA1NzAzNzkxM30.D4Z6QZfg4mXBuserzekG-prqcSsA81iDvudmFChlYYs"}'::jsonb,
        body:='{"scheduled": true}'::jsonb
    ) as request_id;
  $$
);
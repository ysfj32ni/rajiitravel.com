-- Create trip_departures table for multiple departure dates per trip
-- This allows the same trip itinerary to be offered on different dates

CREATE TABLE IF NOT EXISTS trip_departures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  departure_date DATE NOT NULL,
  available_seats INTEGER,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure no duplicate dates for the same trip
  UNIQUE(trip_id, departure_date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_trip_departures_trip_id ON trip_departures(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_departures_date ON trip_departures(departure_date);
CREATE INDEX IF NOT EXISTS idx_trip_departures_available ON trip_departures(is_available);

-- Enable Row Level Security (RLS)
ALTER TABLE trip_departures ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (everyone can see available dates)
CREATE POLICY "Allow public read access to trip departures"
  ON trip_departures
  FOR SELECT
  USING (true);

-- Create policy to allow authenticated users (admin) to manage departures
CREATE POLICY "Allow authenticated users to manage trip departures"
  ON trip_departures
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Add a helpful view to get trips with their next available departure
CREATE OR REPLACE VIEW trips_with_next_departure AS
SELECT 
  t.*,
  (
    SELECT td.departure_date 
    FROM trip_departures td 
    WHERE td.trip_id = t.id 
      AND td.is_available = true 
      AND td.departure_date >= CURRENT_DATE 
    ORDER BY td.departure_date ASC 
    LIMIT 1
  ) as next_departure,
  (
    SELECT COUNT(*) 
    FROM trip_departures td 
    WHERE td.trip_id = t.id 
      AND td.is_available = true 
      AND td.departure_date >= CURRENT_DATE
  ) as available_dates_count
FROM trips t;

-- Optional: Add sample departure dates for testing
-- Uncomment and modify trip_id to match actual trip IDs in your database

-- INSERT INTO trip_departures (trip_id, departure_date, available_seats, is_available) VALUES
--   ((SELECT id FROM trips LIMIT 1 OFFSET 0), '2026-02-15', 45, true),
--   ((SELECT id FROM trips LIMIT 1 OFFSET 0), '2026-03-01', 45, true),
--   ((SELECT id FROM trips LIMIT 1 OFFSET 0), '2026-03-15', 45, true),
--   ((SELECT id FROM trips LIMIT 1 OFFSET 1), '2026-02-20', 40, true),
--   ((SELECT id FROM trips LIMIT 1 OFFSET 1), '2026-03-10', 40, true);

COMMENT ON TABLE trip_departures IS 'Multiple departure dates for each trip itinerary';
COMMENT ON COLUMN trip_departures.trip_id IS 'Reference to the main trip/itinerary';
COMMENT ON COLUMN trip_departures.departure_date IS 'Specific departure date for this trip instance';
COMMENT ON COLUMN trip_departures.available_seats IS 'Number of seats available for this departure (optional)';
COMMENT ON COLUMN trip_departures.is_available IS 'Whether this departure is still available for booking';

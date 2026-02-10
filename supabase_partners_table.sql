-- Create partners table for managing client/partner logos
CREATE TABLE IF NOT EXISTS partners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on display_order for faster sorting
CREATE INDEX IF NOT EXISTS idx_partners_display_order ON partners(display_order);

-- Add some sample partners (optional - you can delete these after testing)
INSERT INTO partners (name, logo_url, display_order) VALUES
  ('Royal Air Maroc', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Royal_Air_Maroc_Logo.svg/320px-Royal_Air_Maroc_Logo.svg.png', 1),
  ('Turkish Airlines', 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Turkish_Airlines_logo_2019_compact.svg/320px-Turkish_Airlines_logo_2019_compact.svg.png', 2),
  ('Emirates', 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/320px-Emirates_logo.svg.png', 3),
  ('Hilton Hotels', 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Hilton_Hotels_%26_Resorts_logo.svg/320px-Hilton_Hotels_%26_Resorts_logo.svg.png', 4),
  ('Marriott', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Marriott_Logo.svg/320px-Marriott_Logo.svg.png', 5),
  ('Booking.com', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Booking.com_logo.svg/320px-Booking.com_logo.svg.png', 6)
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (for the website)
CREATE POLICY "Allow public read access to partners"
  ON partners
  FOR SELECT
  USING (true);

-- Create policy to allow authenticated users to insert/update/delete
-- NOTE: You may want to restrict this further based on your authentication setup
CREATE POLICY "Allow authenticated users to manage partners"
  ON partners
  FOR ALL
  USING (auth.role() = 'authenticated');

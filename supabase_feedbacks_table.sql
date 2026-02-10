-- Create feedbacks table for user reviews and ratings
CREATE TABLE IF NOT EXISTS feedbacks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  likes INTEGER DEFAULT 0 CHECK (likes >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_feedbacks_trip_id ON feedbacks(trip_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_created_at ON feedbacks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedbacks_rating ON feedbacks(rating);

-- Enable Row Level Security (RLS)
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (everyone can see feedbacks)
CREATE POLICY "Allow public read access to feedbacks"
  ON feedbacks
  FOR SELECT
  USING (true);

-- Create policy to allow anyone to insert feedbacks (no auth required for reviews)
CREATE POLICY "Allow public insert access to feedbacks"
  ON feedbacks
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow public update for likes only
CREATE POLICY "Allow public update for likes"
  ON feedbacks
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create policy to allow authenticated users (admin) to delete feedbacks
CREATE POLICY "Allow authenticated users to delete feedbacks"
  ON feedbacks
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Optional: Add some sample feedbacks for testing
-- Uncomment and modify trip_id to match actual trip IDs in your database

-- INSERT INTO feedbacks (trip_id, user_name, user_email, rating, comment, likes) VALUES
--   ((SELECT id FROM trips LIMIT 1), 'محمد أحمد', 'mohamed@example.com', 5, 'رحلة رائعة جداً! التنظيم ممتاز والأماكن المختارة كانت مذهلة. أنصح بها بشدة!', 12),
--   ((SELECT id FROM trips LIMIT 1), 'فاطمة الزهراء', 'fatima@example.com', 5, 'تجربة لا تنسى! الفريق محترف والبرنامج كان متكاملاً. شكراً لكم على هذه الرحلة الجميلة.', 8),
--   ((SELECT id FROM trips LIMIT 1), 'عمر خالد', NULL, 4, 'رحلة جميلة ومنظمة. الوحيد الذي كان يمكن تحسينه هو وقت الإنطلاق. بشكل عام تجربة رائعة!', 5),
--   ((SELECT id FROM trips LIMIT 1), 'سارة محمود', 'sara@example.com', 5, 'أفضل رحلة في حياتي! كل شيء كان مثالياً من البداية للنهاية. سأحجز معكم مجدداً بالتأكيد!', 15),
--   ((SELECT id FROM trips LIMIT 1), 'حسن علي', NULL, 5, 'ممتاز جداً! التنظيم والاحترافية والاهتمام بالتفاصيل كان رائعاً. شكراً للفريق المحترف.', 6);

COMMENT ON TABLE feedbacks IS 'User reviews and ratings for trips';
COMMENT ON COLUMN feedbacks.trip_id IS 'Reference to the trip being reviewed';
COMMENT ON COLUMN feedbacks.user_name IS 'Name of the reviewer';
COMMENT ON COLUMN feedbacks.user_email IS 'Optional email of the reviewer';
COMMENT ON COLUMN feedbacks.rating IS 'Rating from 1 to 5 stars';
COMMENT ON COLUMN feedbacks.comment IS 'Review text';
COMMENT ON COLUMN feedbacks.likes IS 'Number of likes/helpful votes for this review';

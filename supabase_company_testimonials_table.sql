-- Create company_testimonials table for general company reviews/testimonials
CREATE TABLE IF NOT EXISTS company_testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_location VARCHAR(255),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  testimonial TEXT NOT NULL,
  avatar_url TEXT,
  is_featured BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_company_testimonials_featured ON company_testimonials(is_featured);
CREATE INDEX IF NOT EXISTS idx_company_testimonials_rating ON company_testimonials(rating);
CREATE INDEX IF NOT EXISTS idx_company_testimonials_created_at ON company_testimonials(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE company_testimonials ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (everyone can see testimonials)
CREATE POLICY "Allow public read access to company testimonials"
  ON company_testimonials
  FOR SELECT
  USING (true);

-- Create policy to allow authenticated users (admin) to insert testimonials
CREATE POLICY "Allow authenticated users to insert company testimonials"
  ON company_testimonials
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow authenticated users (admin) to update testimonials
CREATE POLICY "Allow authenticated users to update company testimonials"
  ON company_testimonials
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users (admin) to delete testimonials
CREATE POLICY "Allow authenticated users to delete company testimonials"
  ON company_testimonials
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Insert sample testimonials
INSERT INTO company_testimonials (customer_name, customer_location, rating, testimonial, is_featured) VALUES
  ('محمد الأمين', 'الرباط', 5, 'تجربة رائعة مع RJ TRAVEL! التنظيم ممتاز، الفريق محترف جداً، والرحلات مصممة بعناية فائقة. أنصح الجميع بالتعامل معهم.', true),
  ('فاطمة الزهراء', 'الدار البيضاء', 5, 'أفضل وكالة سفريات تعاملت معها! كل التفاصيل كانت مدروسة والأسعار معقولة جداً. شكراً لفريق RJ TRAVEL على هذه التجربة الرائعة.', true),
  ('عمر بنعلي', 'مراكش', 5, 'سافرت مع عائلتي في رحلة منظمة من RJ TRAVEL وكانت تجربة لا تنسى. كل شيء كان مثالياً من البداية للنهاية. سنحجز معهم مجدداً بالتأكيد!', true),
  ('سارة المهدي', 'فاس', 5, 'احترافية عالية في التعامل، برامج سياحية متنوعة، وأسعار تنافسية. RJ TRAVEL هي الخيار الأمثل لكل من يبحث عن رحلة مميزة.', true),
  ('حسن القاسمي', 'طنجة', 5, 'تنظيم رائع، مرشدين محترفين، ووجهات مذهلة. كل رحلة مع RJ TRAVEL هي مغامرة جديدة مليئة بالذكريات الجميلة.', true),
  ('أمينة الحسني', 'الدار البيضاء', 5, 'خدمة عملاء ممتازة ومتابعة دقيقة في كل مرحلة من الرحلة. فريق RJ TRAVEL يجعلك تشعر بالراحة والأمان طوال الوقت.', true),
  ('يوسف بن عمر', 'الرباط', 5, 'أسعار معقولة، خدمات راقية، ووجهات متنوعة. RJ TRAVEL تقدم قيمة حقيقية مقابل المال. تجربة رائعة من البداية للنهاية!', true),
  ('نادية المرابط', 'أكادير', 5, 'سافرت معهم ثلاث مرات وكل مرة أكثر من رائعة! الاهتمام بالتفاصيل والاحترافية في التعامل يجعلهم الأفضل في المجال.', true)
ON CONFLICT DO NOTHING;

COMMENT ON TABLE company_testimonials IS 'General company testimonials and reviews displayed on homepage';
COMMENT ON COLUMN company_testimonials.customer_name IS 'Name of the customer';
COMMENT ON COLUMN company_testimonials.customer_location IS 'City or location of the customer';
COMMENT ON COLUMN company_testimonials.rating IS 'Rating from 1 to 5 stars';
COMMENT ON COLUMN company_testimonials.testimonial IS 'Testimonial text';
COMMENT ON COLUMN company_testimonials.avatar_url IS 'Optional URL to customer avatar image';
COMMENT ON COLUMN company_testimonials.is_featured IS 'Whether to display this testimonial on homepage';

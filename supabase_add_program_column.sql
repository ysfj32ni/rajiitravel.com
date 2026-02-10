-- Add program column to trips table for day-by-day itinerary
-- Run this in Supabase SQL Editor

ALTER TABLE trips 
ADD COLUMN IF NOT EXISTS program TEXT;

COMMENT ON COLUMN trips.program IS 'Detailed day-by-day travel program/itinerary';

-- Optional: Update existing trips with a sample program (you can remove this if not needed)
-- UPDATE trips 
-- SET program = '⬅️ اليوم الأول
-- 
-- -- الإنطلاق من نقطة التجمع
-- -- الوصول إلى الوجهة
-- -- تسجيل الدخول إلى الفندق
-- 
-- ⬅️ اليوم الثاني
-- 
-- -- الإستيقاظ و تناول وجبة الفطور
-- -- بداية الجولة السياحية
-- -- العودة إلى الفندق'
-- WHERE program IS NULL OR program = '';

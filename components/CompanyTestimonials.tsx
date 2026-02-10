import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { CompanyTestimonial } from '../types';
import { Star, Quote, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';

const CompanyTestimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<CompanyTestimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('company_testimonials')
          .select('*')
          .eq('is_featured', true)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        setTestimonials(data || []);
      } catch (err: any) {
        console.error('Error fetching testimonials:', err);
        // Don't show testimonials section if database error
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Auto-rotate testimonials every 5 seconds
  useEffect(() => {
    if (testimonials.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1 justify-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={20}
            className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'}
          />
        ))}
      </div>
    );
  };

  if (loading || testimonials.length === 0) {
    return null; // Don't show section if no testimonials
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-24 px-4 bg-gradient-to-br from-orange-50 via-white to-red-50 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="max-w-6xl mx-auto relative z-10" dir="rtl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4">
            <Quote className="text-white" size={32} />
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4 font-['Cairo']">
            ماذا يقول عملاؤنا
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto font-['Cairo']">
            آراء حقيقية من عملائنا حول تجربتهم مع RJ TRAVEL
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="relative">
          <div
            key={currentIndex}
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100 animate-fade-in"
          >
            {/* Quote Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-orange-100 to-red-100 p-4 rounded-full">
                <Quote className="text-orange-600" size={40} />
              </div>
            </div>

            {/* Stars */}
            <div className="mb-6">
              {renderStars(currentTestimonial.rating)}
            </div>

            {/* Testimonial Text */}
            <blockquote className="text-center mb-8">
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-['Cairo'] italic">
                "{currentTestimonial.testimonial}"
              </p>
            </blockquote>

            {/* Customer Info */}
            <div className="flex flex-col items-center gap-4">
              {/* Avatar */}
              <div className="relative">
                {currentTestimonial.avatar_url ? (
                  <img
                    src={currentTestimonial.avatar_url}
                    alt={currentTestimonial.customer_name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-orange-200"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white text-3xl font-bold border-4 border-orange-200">
                    {currentTestimonial.customer_name.charAt(0)}
                  </div>
                )}
                {/* Verified Badge */}
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Name and Location */}
              <div className="text-center">
                <h4 className="text-xl font-bold text-gray-900 font-['Cairo']">
                  {currentTestimonial.customer_name}
                </h4>
                {currentTestimonial.customer_location && (
                  <div className="flex items-center justify-center gap-1 text-gray-500 font-['Cairo'] mt-1">
                    <MapPin size={14} />
                    <span>{currentTestimonial.customer_location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          {testimonials.length > 1 && (
            <>
              <button
                onClick={prevTestimonial}
                className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1/2 md:-translate-x-full md:right-4 bg-white hover:bg-orange-50 p-3 rounded-full shadow-lg transition-all group"
                aria-label="السابق"
              >
                <ChevronRight className="text-orange-600 group-hover:scale-110 transition-transform" size={24} />
              </button>
              <button
                onClick={nextTestimonial}
                className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-full md:left-4 bg-white hover:bg-orange-50 p-3 rounded-full shadow-lg transition-all group"
                aria-label="التالي"
              >
                <ChevronLeft className="text-orange-600 group-hover:scale-110 transition-transform" size={24} />
              </button>
            </>
          )}
        </div>

        {/* Dots Indicator */}
        {testimonials.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-gradient-to-r from-orange-500 to-red-500'
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`انتقل إلى التقييم ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-1 font-['Cairo']">
              {testimonials.length}+
            </div>
            <div className="text-sm text-gray-600 font-['Cairo']">تقييم إيجابي</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-1 font-['Cairo']">
              {(testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600 font-['Cairo']">متوسط التقييم</div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-1 font-['Cairo']">
              98%
            </div>
            <div className="text-sm text-gray-600 font-['Cairo']">رضا العملاء</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyTestimonials;

import React, { useEffect, useState } from 'react';
import { MapPin, ArrowLeft, Loader2, Sparkles, History } from 'lucide-react';
import { supabase } from '../supabase';
import { Trip, TripWithDepartures, TripDeparture } from '../types';
import TripCard from '../components/TripCard';
import ClientsSlider from '../components/ClientsSlider';
import CompanyTestimonials from '../components/CompanyTestimonials';

const HomePage: React.FC = () => {
  const [upcomingTrips, setUpcomingTrips] = useState<TripWithDepartures[]>([]);
  const [completedTrips, setCompletedTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        // Fetch all trips
        const { data: tripsData, error: tripsError } = await supabase
          .from('trips')
          .select('*')
          .order('date', { ascending: true });
        
        if (tripsError) throw tripsError;
        
        if (tripsData) {
          const upcoming = tripsData.filter(t => !t.is_completed);
          const completed = tripsData.filter(t => t.is_completed);
          
          // Fetch departures for upcoming trips
          const upcomingWithDepartures = await Promise.all(
            upcoming.map(async (trip) => {
              const { data: departuresData } = await supabase
                .from('trip_departures')
                .select('*')
                .eq('trip_id', trip.id)
                .eq('is_available', true)
                .gte('departure_date', new Date().toISOString().split('T')[0])
                .order('departure_date', { ascending: true });
              
              const departures = departuresData || [];
              return {
                ...trip,
                departures,
                next_departure: departures.length > 0 ? departures[0].departure_date : undefined,
                available_dates_count: departures.length
              } as TripWithDepartures;
            })
          );
          
          setUpcomingTrips(upcomingWithDepartures);
          setCompletedTrips(completed);
        }
      } catch (err) {
        console.error('Error fetching trips:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  return (
    <div className="bg-white" dir="rtl">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/90 to-red-500/90 px-4 py-2 rounded-full mb-6 text-sm font-semibold backdrop-blur-sm">
            <Sparkles size={16} />
            <span>اكتشف وجهاتنا الجديدة لموسم 2026</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            سافر مع <span className="text-orange-400">RJ TRAVEL</span> <br /> 
            وعِش التجربة الحقيقية
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-100 max-w-2xl mx-auto leading-relaxed">
            نحن ننسج ذكرياتك بأيدي خبيرة، رحلات استثنائية حول العالم صُممت خصيصاً لتناسب تطلعاتك.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#trips" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-full text-lg font-bold transition-all shadow-xl shadow-orange-600/30">
              تصفح الرحلات المتاحة
            </a>
            <a href="#history" className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md px-8 py-4 rounded-full text-lg font-bold transition-all">
              أرشيف رحلاتنا
            </a>
          </div>
        </div>
      </section>

      {/* Featured Stats */}
      <section className="py-12 bg-gradient-to-br from-orange-50 to-red-50 border-y border-orange-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-black text-orange-600 mb-1">+5000</div>
            <div className="text-orange-800 font-medium">مسافر سعيد</div>
          </div>
          <div>
            <div className="text-4xl font-black text-orange-600 mb-1">+120</div>
            <div className="text-orange-800 font-medium">وجهة سياحية</div>
          </div>
          <div>
            <div className="text-4xl font-black text-orange-600 mb-1">+15</div>
            <div className="text-orange-800 font-medium">عام من الخبرة</div>
          </div>
          <div>
            <div className="text-4xl font-black text-orange-600 mb-1">24/7</div>
            <div className="text-orange-800 font-medium">دعم فني</div>
          </div>
        </div>
      </section>

      {/* Clients Slider */}
      <ClientsSlider />

      {/* Company Testimonials */}
      <CompanyTestimonials />

      {/* Upcoming Trips Grid */}
      <section id="trips" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="text-right">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2 flex items-center gap-2">
                <MapPin className="text-orange-600" />
                الرحلات القادمة
              </h2>
              <p className="text-gray-600">احجز مكانك الآن في إحدى رحلاتنا المميزة حول العالم.</p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin h-12 w-12 text-orange-600 mb-4" />
              <p className="text-gray-500">جاري تحميل الرحلات...</p>
            </div>
          ) : upcomingTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingTrips.map(trip => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
              <p className="text-xl text-gray-400">لا توجد رحلات متاحة حالياً. تابعنا للمزيد قريباً!</p>
            </div>
          )}
        </div>
      </section>

      {/* History Section */}
      <section id="history" className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4 flex items-center justify-center gap-2">
              <History className="text-gray-500" />
              أين كنّا؟
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">نظرة سريعة على بعض من رحلاتنا السابقة واللحظات التي لا تُنسى التي شاركناها مع عملائنا.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 opacity-80">
            {completedTrips.map(trip => (
              <TripCard key={trip.id} trip={trip} isHistory={true} />
            ))}
          </div>
          
          {completedTrips.length === 0 && !loading && (
            <div className="text-center text-gray-400 py-10">سجل الرحلات فارغ حالياً.</div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              ماذا يقول عملاؤنا؟
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">آراء بعض من عملائنا الكرام الذين وثقوا بنا لخلق ذكرياتهم السياحية.</p>
          </div>

          <CompanyTestimonials />

        </div>
      </section>
    </div>
  );
};

export default HomePage;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { Trip, TripDeparture } from '../types';
import { Calendar, Banknote, ArrowRight, Loader2, FileText, CheckCircle } from 'lucide-react';
import FeedbackSection from '../components/FeedbackSection';

const TripDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [departures, setDepartures] = useState<TripDeparture[]>([]);
  const [selectedDeparture, setSelectedDeparture] = useState<TripDeparture | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTripAndDepartures = async () => {
      if (!id) {
        navigate('/');
        return;
      }

      setLoading(true);
      try {
        // Fetch trip
        const { data: tripData, error: tripError } = await supabase
          .from('trips')
          .select('*')
          .eq('id', id)
          .single();

        if (tripError) throw tripError;
        setTrip(tripData);

        // Fetch departures
        const { data: departuresData, error: departuresError } = await supabase
          .from('trip_departures')
          .select('*')
          .eq('trip_id', id)
          .eq('is_available', true)
          .gte('departure_date', new Date().toISOString().split('T')[0])
          .order('departure_date', { ascending: true });

        if (departuresError) throw departuresError;
        setDepartures(departuresData || []);
        
        // Auto-select first available departure
        if (departuresData && departuresData.length > 0) {
          setSelectedDeparture(departuresData[0]);
        }
      } catch (err: any) {
        console.error('Error fetching trip:', err);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchTripAndDepartures();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-orange-600" size={48} />
      </div>
    );
  }

  if (!trip) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={trip.image_url || 'https://picsum.photos/seed/travel/1920/1080'}
          alt={trip.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 flex items-end">
          <div className="w-full max-w-7xl mx-auto px-6 pb-12">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-white mb-6 hover:text-orange-400 transition-colors font-['Cairo']"
            >
              <ArrowRight size={20} />
              <span>العودة للرحلات</span>
            </button>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-['Cairo']">
              {trip.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white">
              <div className="flex items-center gap-2 text-orange-400 font-bold">
                <Banknote size={20} />
                <span className="text-2xl font-['Cairo']">{trip.price} درهم</span>
              </div>
              {trip.is_completed && (
                <span className="bg-gray-900/80 px-4 py-1 rounded-full text-sm backdrop-blur-md font-['Cairo']">
                  رحلة منتهية
                </span>
              )}
              {!trip.is_completed && departures.length > 0 && (
                <span className="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-1 rounded-full text-sm font-bold shadow-lg font-['Cairo']">
                  {departures.length} {departures.length === 1 ? 'موعد متاح' : 'مواعيد متاحة'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Description */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 font-['Cairo']">عن الرحلة</h2>
          <p className="text-gray-700 leading-relaxed text-lg font-['Cairo']">
            {trip.description}
          </p>
        </div>

        {/* Available Departure Dates */}
        {!trip.is_completed && departures.length > 0 && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 font-['Cairo']">
              <Calendar className="text-orange-500" />
              <span>تواريخ الانطلاق المتاحة</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departures.map((departure) => (
                <button
                  key={departure.id}
                  onClick={() => setSelectedDeparture(departure)}
                  className={`p-4 rounded-xl border-2 transition-all text-right ${
                    selectedDeparture?.id === departure.id
                      ? 'border-orange-500 bg-orange-50 shadow-lg'
                      : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar size={18} className="text-orange-500" />
                      <span className="font-bold text-gray-900 font-['Cairo']">
                        {new Date(departure.departure_date).toLocaleDateString('ar-EG-u-nu-latn', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          weekday: 'long'
                        })}
                      </span>
                    </div>
                    {selectedDeparture?.id === departure.id && (
                      <CheckCircle size={20} className="text-orange-500" />
                    )}
                  </div>
                  {departure.available_seats !== null && departure.available_seats !== undefined && (
                    <p className="text-sm text-gray-600 font-['Cairo']">
                      {departure.available_seats > 0 
                        ? `${departure.available_seats} ${departure.available_seats === 1 ? 'مقعد متبقي' : 'مقاعد متبقية'}`
                        : 'مقاعد محدودة'}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Program */}
        {trip.program && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2 font-['Cairo']">
              <FileText className="text-orange-500" />
              <span>برنامج الرحلة</span>
            </h2>
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed font-['Cairo']">
              {trip.program}
            </div>
          </div>
        )}

        {/* Booking Section */}
        {!trip.is_completed && departures.length > 0 && selectedDeparture && (
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl shadow-lg p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-2 font-['Cairo']">جاهز للمغامرة؟</h2>
            <p className="text-lg mb-2 font-['Cairo']">
              التاريخ المحدد: {new Date(selectedDeparture.departure_date).toLocaleDateString('ar-EG-u-nu-latn', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long'
              })}
            </p>
            <p className="text-sm mb-6 opacity-90 font-['Cairo']">
              احجز مكانك الآن وانضم إلينا في هذه الرحلة الرائعة
            </p>
            <a
              href={`https://wa.me/212660500351?text=${encodeURIComponent(
                `السلام عليكم، أود الحجز في رحلة: ${trip.title}\nتاريخ الانطلاق: ${new Date(selectedDeparture.departure_date).toLocaleDateString('ar-EG-u-nu-latn', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long'
                })}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl font-['Cairo']"
            >
              احجز عبر واتساب الآن
            </a>
          </div>
        )}

        {/* No dates available message */}
        {!trip.is_completed && departures.length === 0 && (
          <div className="bg-gray-100 rounded-3xl shadow-sm p-8 text-center">
            <Calendar className="mx-auto mb-4 text-gray-400" size={48} />
            <h2 className="text-2xl font-bold text-gray-900 mb-2 font-['Cairo']">لا توجد مواعيد متاحة حالياً</h2>
            <p className="text-gray-600 mb-6 font-['Cairo']">
              تواصل معنا عبر واتساب للحصول على مواعيد الانطلاق القادمة
            </p>
            <a
              href={`https://wa.me/212660500351?text=${encodeURIComponent(
                `السلام عليكم، أود الاستفسار عن مواعيد رحلة: ${trip.title}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-lg font-['Cairo']"
            >
              تواصل معنا عبر واتساب
            </a>
          </div>
        )}

        {/* Feedback Section */}
        <FeedbackSection tripId={trip.id} tripTitle={trip.title} />
      </div>
    </div>
  );
};

export default TripDetailsPage;

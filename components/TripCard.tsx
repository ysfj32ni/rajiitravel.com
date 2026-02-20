
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Banknote, FileText } from 'lucide-react';
import { Trip, TripWithDepartures } from '../types';

interface TripCardProps {
  trip: Trip | TripWithDepartures;
  isHistory?: boolean;
}

const TripCard: React.FC<TripCardProps> = ({ trip, isHistory }) => {
  const navigate = useNavigate();
  const tripWithDepartures = trip as TripWithDepartures;
  const hasMultipleDates = tripWithDepartures.departures && tripWithDepartures.departures.length > 0;
  const nextDeparture = tripWithDepartures.next_departure;
  const availableDatesCount = tripWithDepartures.available_dates_count || 0;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col group">
      <div className="relative h-56 overflow-hidden">
        <img 
          src={trip.image_url || 'https://picsum.photos/seed/travel/800/600'} 
          alt={trip.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {isHistory && (
          <div className="absolute top-4 right-4 bg-gray-900/80 text-white px-3 py-1 rounded-full text-sm backdrop-blur-md">
            رحلة منتهية
          </div>
        )}
        {!isHistory && hasMultipleDates && availableDatesCount > 1 && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
            {availableDatesCount} مواعيد متاحة
          </div>
        )}
        {!isHistory && (!hasMultipleDates || availableDatesCount === 1) && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
            متاحة الآن
          </div>
        )}
      </div>
      
      <div className="p-6 flex-grow flex flex-col text-right" dir="rtl">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{trip.title}</h3>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4 flex-wrap justify-end">
          <div className="flex items-center gap-1">
            <Calendar size={16} className="text-orange-500" />
            {/* Using ar-EG-u-nu-latn to force Western numerals (1, 2, 3) while keeping Arabic text */}
            <span>
              {hasMultipleDates && nextDeparture
                ? `${new Date(nextDeparture).toLocaleDateString('ar-EG-u-nu-latn', { year: 'numeric', month: 'short', day: 'numeric' })}${availableDatesCount > 1 ? ' +' : ''}`
                : new Date(trip.date).toLocaleDateString('ar-EG-u-nu-latn', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-orange-600">
            <Banknote size={16} />
            <span>{trip.price} درهم</span>
          </div>
        </div>
        
        <p className="text-gray-600 line-clamp-3 mb-6 flex-grow leading-relaxed">
          {trip.description}
        </p>
        
        {!isHistory ? (
          <button 
            onClick={() => {
              navigate(`/trip/${trip.id}#about-trip`);
            }}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:from-orange-600 hover:to-red-600 transition-all shadow-lg shadow-orange-200"
          >
            <span>التفاصيل والتقييمات</span>
            <FileText size={18} />
          </button>
        ) : (
          <button 
            onClick={() => navigate(`/trip/${trip.id}`)}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
          >
            <span>عرض التفاصيل</span>
            <FileText size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TripCard;

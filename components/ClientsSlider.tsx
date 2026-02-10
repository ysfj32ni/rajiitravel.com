
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Partner } from '../types';

const ClientsSlider: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      setPartners(data || []);
    } catch (err) {
      console.error('Error fetching partners:', err);
      // Fallback to default logos if database fails
      setPartners([
        { id: '1', name: 'Royal Air Maroc', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Royal_Air_Maroc_Logo.svg/320px-Royal_Air_Maroc_Logo.svg.png', display_order: 1 },
        { id: '2', name: 'ONCF', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Logo_ONCF.svg/320px-Logo_ONCF.svg.png', display_order: 2 },
        { id: '3', name: 'Marriott', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Marriott_Logo.svg/320px-Marriott_Logo.svg.png', display_order: 3 },
        { id: '4', name: 'Emirates', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Emirates_logo.svg/320px-Emirates_logo.svg.png', display_order: 4 },
        { id: '5', name: 'Hilton', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Hilton_Hotels_logo.svg/320px-Hilton_Hotels_logo.svg.png', display_order: 5 },
        { id: '6', name: 'Turkish Airlines', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Turkish_Airlines_logo_2019_compact.svg/320px-Turkish_Airlines_logo_2019_compact.svg.png', display_order: 6 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600 mx-auto"></div>
        </div>
      </section>
    );
  }

  if (partners.length === 0) {
    return null;
  }

  // Duplicate the array multiple times for seamless infinite scroll
  const duplicatedPartners = [...partners, ...partners, ...partners];

  return (
    <section className="py-16 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            شركاؤنا في النجاح
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            نفخر بالعمل مع أفضل الشركات والمؤسسات العالمية لتقديم خدمات متميزة لعملائنا
          </p>
        </div>

        {/* Sliding container */}
        <div className="relative overflow-hidden">
          {/* Gradient overlays for smooth edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          {/* Sliding track */}
          <div className="flex animate-scroll-continuous">
            {duplicatedPartners.map((partner, index) => (
              <div
                key={`${partner.id}-${index}`}
                className="flex-shrink-0 mx-6 w-36 h-20 flex items-center justify-center hover:scale-110 transition-transform duration-300"
              >
                <img
                  src={partner.logo_url}
                  alt={partner.name}
                  className="max-w-full max-h-full object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.innerHTML = `<div class="text-gray-400 font-bold text-sm text-center">${partner.name}</div>`;
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes scroll-continuous {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(calc(-100% / 3));
            }
          }

          .animate-scroll-continuous {
            animation: scroll-continuous 40s linear infinite;
            width: max-content;
          }

          .animate-scroll-continuous:hover {
            animation-play-state: paused;
          }
        `}</style>
      </div>
    </section>
  );
};

export default ClientsSlider;

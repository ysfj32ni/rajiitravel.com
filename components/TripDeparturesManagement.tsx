import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { TripDeparture, TripDepartureFormData } from '../types';
import { toast } from 'sonner';
import { Plus, Trash2, Calendar, Users, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface TripDeparturesManagementProps {
  tripId: string;
  tripTitle: string;
}

const TripDeparturesManagement: React.FC<TripDeparturesManagementProps> = ({ tripId, tripTitle }) => {
  const [departures, setDepartures] = useState<TripDeparture[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<TripDepartureFormData>({
    trip_id: tripId,
    departure_date: '',
    available_seats: undefined,
    is_available: true
  });

  const fetchDepartures = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('trip_departures')
        .select('*')
        .eq('trip_id', tripId)
        .order('departure_date', { ascending: true });
      
      if (error) throw error;
      setDepartures(data || []);
    } catch (err: any) {
      console.error('Error fetching departures:', err);
      toast.error('فشل تحميل تواريخ الانطلاق');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartures();
  }, [tripId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.departure_date) {
      toast.error('الرجاء تحديد تاريخ الانطلاق');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('trip_departures')
        .insert([formData]);
      
      if (error) throw error;
      
      toast.success('تم إضافة تاريخ الانطلاق بنجاح');
      setFormData({
        trip_id: tripId,
        departure_date: '',
        available_seats: undefined,
        is_available: true
      });
      setIsFormOpen(false);
      fetchDepartures();
    } catch (err: any) {
      if (err.code === '23505') {
        toast.error('هذا التاريخ موجود بالفعل لهذه الرحلة');
      } else {
        toast.error('حدث خطأ أثناء إضافة التاريخ');
      }
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, date: string) => {
    if (!confirm(`هل أنت متأكد من حذف تاريخ الانطلاق ${new Date(date).toLocaleDateString('ar-EG-u-nu-latn')}؟`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('trip_departures')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('تم حذف تاريخ الانطلاق');
      fetchDepartures();
    } catch (err: any) {
      toast.error('فشل حذف التاريخ');
      console.error(err);
    }
  };

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('trip_departures')
        .update({ is_available: !currentStatus })
        .eq('id', id);
      
      if (error) throw error;
      toast.success(`تم ${!currentStatus ? 'تفعيل' : 'إيقاف'} التاريخ`);
      fetchDepartures();
    } catch (err: any) {
      toast.error('فشل تحديث الحالة');
      console.error(err);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const upcomingDepartures = departures.filter(d => d.departure_date >= today);
  const pastDepartures = departures.filter(d => d.departure_date < today);

  return (
    <div className="bg-gray-50 rounded-2xl p-6" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 font-['Cairo']">
            تواريخ الانطلاق - {tripTitle}
          </h3>
          <p className="text-sm text-gray-500 font-['Cairo']">
            {upcomingDepartures.length} تاريخ قادم • {pastDepartures.length} تاريخ منتهي
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-lg shadow-orange-200 flex items-center gap-2 font-['Cairo']"
        >
          <Plus size={18} />
          <span>إضافة تاريخ</span>
        </button>
      </div>

      {/* Add Form */}
      {isFormOpen && (
        <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
          <h4 className="text-lg font-bold text-gray-900 mb-4 font-['Cairo']">
            إضافة تاريخ انطلاق جديد
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 font-['Cairo']">
                  تاريخ الانطلاق *
                </label>
                <input
                  type="date"
                  required
                  min={today}
                  value={formData.departure_date}
                  onChange={(e) => setFormData({ ...formData, departure_date: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-100 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 font-['Cairo']">
                  عدد المقاعد المتاحة (اختياري)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.available_seats || ''}
                  onChange={(e) => setFormData({ ...formData, available_seats: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-100 outline-none"
                  placeholder="45"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_available"
                checked={formData.is_available}
                onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                className="w-5 h-5 rounded text-orange-600 focus:ring-orange-500"
              />
              <label htmlFor="is_available" className="text-sm font-semibold text-gray-700 font-['Cairo']">
                متاح للحجز
              </label>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-['Cairo']"
              >
                {submitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>جاري الإضافة...</span>
                  </>
                ) : (
                  <span>إضافة التاريخ</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-all font-['Cairo']"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Departures List */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="animate-spin text-orange-600 mb-4 mx-auto" size={40} />
          <p className="text-gray-500 font-['Cairo']">جاري التحميل...</p>
        </div>
      ) : departures.length > 0 ? (
        <div className="space-y-6">
          {/* Upcoming Departures */}
          {upcomingDepartures.length > 0 && (
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-3 font-['Cairo']">
                التواريخ القادمة ({upcomingDepartures.length})
              </h4>
              <div className="space-y-3">
                {upcomingDepartures.map((departure) => (
                  <div
                    key={departure.id}
                    className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-xl">
                          <Calendar size={24} className="text-white" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-900 font-['Cairo']">
                            {new Date(departure.departure_date).toLocaleDateString('ar-EG-u-nu-latn', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                          {departure.available_seats !== null && (
                            <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                              <Users size={16} className="text-orange-500" />
                              <span className="font-['Cairo']">{departure.available_seats} مقعد متاح</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleAvailability(departure.id, departure.is_available)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all font-['Cairo'] ${
                            departure.is_available
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {departure.is_available ? (
                            <>
                              <CheckCircle size={16} />
                              <span>متاح</span>
                            </>
                          ) : (
                            <>
                              <XCircle size={16} />
                              <span>غير متاح</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(departure.id, departure.departure_date)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="حذف"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Past Departures */}
          {pastDepartures.length > 0 && (
            <div>
              <h4 className="text-lg font-bold text-gray-500 mb-3 font-['Cairo']">
                التواريخ المنتهية ({pastDepartures.length})
              </h4>
              <div className="space-y-2">
                {pastDepartures.map((departure) => (
                  <div
                    key={departure.id}
                    className="bg-gray-50 rounded-xl p-3 border border-gray-200 opacity-60"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar size={20} className="text-gray-400" />
                        <span className="text-sm text-gray-600 font-['Cairo']">
                          {new Date(departure.departure_date).toLocaleDateString('ar-EG-u-nu-latn')}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDelete(departure.id, departure.departure_date)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-all"
                        title="حذف"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Calendar className="mx-auto mb-4 text-gray-300" size={64} />
          <h4 className="text-xl font-bold text-gray-900 mb-2 font-['Cairo']">
            لا توجد تواريخ انطلاق بعد
          </h4>
          <p className="text-gray-500 font-['Cairo'] mb-4">
            أضف تواريخ انطلاق متعددة لهذه الرحلة
          </p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-200 font-['Cairo']"
          >
            إضافة تاريخ الآن
          </button>
        </div>
      )}
    </div>
  );
};

export default TripDeparturesManagement;

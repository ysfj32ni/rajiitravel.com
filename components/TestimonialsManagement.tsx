import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { CompanyTestimonial, CompanyTestimonialFormData } from '../types';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, Star, Loader2, XCircle, MapPin, Image as ImageIcon, FileText, CheckCircle } from 'lucide-react';

const TestimonialsManagement: React.FC = () => {
  const [testimonials, setTestimonials] = useState<CompanyTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<CompanyTestimonial | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<CompanyTestimonialFormData>({
    customer_name: '',
    customer_location: '',
    rating: 5,
    testimonial: '',
    avatar_url: '',
    is_featured: true
  });

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('company_testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setTestimonials(data || []);
    } catch (err: any) {
      console.error('Error fetching testimonials:', err);
      toast.error('فشل تحميل التقييمات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingTestimonial) {
        const { error } = await supabase
          .from('company_testimonials')
          .update(formData)
          .eq('id', editingTestimonial.id);
        
        if (error) throw error;
        toast.success('تم تحديث التقييم بنجاح');
      } else {
        const { error } = await supabase
          .from('company_testimonials')
          .insert([formData]);
        
        if (error) throw error;
        toast.success('تم إضافة التقييم بنجاح');
      }

      setIsFormOpen(false);
      setEditingTestimonial(null);
      resetForm();
      fetchTestimonials();
    } catch (err: any) {
      console.error('Error saving testimonial:', err);
      toast.error('حدث خطأ أثناء الحفظ: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (testimonial: CompanyTestimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      customer_name: testimonial.customer_name,
      customer_location: testimonial.customer_location || '',
      rating: testimonial.rating,
      testimonial: testimonial.testimonial,
      avatar_url: testimonial.avatar_url || '',
      is_featured: testimonial.is_featured
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا التقييم؟')) return;

    try {
      const { error } = await supabase
        .from('company_testimonials')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast.success('تم حذف التقييم بنجاح');
      fetchTestimonials();
    } catch (err: any) {
      console.error('Error deleting testimonial:', err);
      toast.error('فشل حذف التقييم');
    }
  };

  const toggleFeatured = async (testimonial: CompanyTestimonial) => {
    try {
      const { error } = await supabase
        .from('company_testimonials')
        .update({ is_featured: !testimonial.is_featured })
        .eq('id', testimonial.id);
      
      if (error) throw error;
      toast.success(testimonial.is_featured ? 'تم إلغاء التمييز' : 'تم التمييز بنجاح');
      fetchTestimonials();
    } catch (err: any) {
      console.error('Error toggling featured:', err);
      toast.error('حدث خطأ');
    }
  };

  const resetForm = () => {
    setFormData({
      customer_name: '',
      customer_location: '',
      rating: 5,
      testimonial: '',
      avatar_url: '',
      is_featured: true
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Testimonials Management</h2>
          <p className="text-gray-500">Manage customer reviews and testimonials displayed on the homepage.</p>
        </div>
        <button
          onClick={() => {
            setEditingTestimonial(null);
            resetForm();
            setIsFormOpen(true);
          }}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-orange-200 transition-all"
        >
          <Plus size={20} />
          Add New Testimonial
        </button>
      </div>

      {/* Modal for Add/Edit */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                </h2>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-100 outline-none"
                      placeholder="e.g., محمد الأمين"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                      <MapPin size={14} /> Location
                    </label>
                    <input
                      type="text"
                      value={formData.customer_location}
                      onChange={(e) => setFormData({ ...formData, customer_location: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-100 outline-none"
                      placeholder="e.g., الرباط"
                    />
                  </div>

                  <div className="col-span-full">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Rating *
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            size={32}
                            className={star <= formData.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                      <FileText size={14} /> Testimonial Text *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.testimonial}
                      onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-100 outline-none resize-none"
                      placeholder="Share the customer's experience..."
                      dir="rtl"
                    />
                  </div>

                  <div className="col-span-full">
                    <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                      <ImageIcon size={14} /> Avatar URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={formData.avatar_url}
                      onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-100 outline-none"
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>

                  <div className="col-span-full flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="w-5 h-5 rounded text-orange-600 focus:ring-orange-500"
                    />
                    <label htmlFor="is_featured" className="text-sm font-semibold text-gray-700">
                      Feature on Homepage
                    </label>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-grow bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Saving...' : editingTestimonial ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="flex-grow bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Testimonials List */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-orange-600 mb-4" size={40} />
            <p className="text-gray-500">Loading testimonials...</p>
          </div>
        ) : testimonials.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm uppercase">
                  <th className="px-6 py-4 font-bold">Customer</th>
                  <th className="px-6 py-4 font-bold">Rating</th>
                  <th className="px-6 py-4 font-bold">Testimonial</th>
                  <th className="px-6 py-4 font-bold">Featured</th>
                  <th className="px-6 py-4 font-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {testimonials.map((testimonial) => (
                  <tr key={testimonial.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {testimonial.avatar_url ? (
                          <img
                            src={testimonial.avatar_url}
                            alt={testimonial.customer_name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
                            {testimonial.customer_name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-gray-900">{testimonial.customer_name}</div>
                          {testimonial.customer_location && (
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <MapPin size={12} />
                              {testimonial.customer_location}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {renderStars(testimonial.rating)}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600 line-clamp-2 max-w-xs" dir="rtl">
                        {testimonial.testimonial}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleFeatured(testimonial)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          testimonial.is_featured
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {testimonial.is_featured ? <CheckCircle size={14} /> : <XCircle size={14} />}
                        {testimonial.is_featured ? 'Featured' : 'Not Featured'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(testimonial)}
                          className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(testimonial.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 text-center">
            <div className="bg-gray-100 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">No testimonials yet</h3>
            <p className="text-gray-500">Create your first testimonial to see it listed here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsManagement;

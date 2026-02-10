import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Feedback } from '../types';
import { toast } from 'sonner';
import { Star, ThumbsUp, User, Loader2, MessageCircle } from 'lucide-react';

interface FeedbackSectionProps {
  tripId: string;
  tripTitle: string;
}

const FeedbackSection: React.FC<FeedbackSectionProps> = ({ tripId, tripTitle }) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [likedFeedbacks, setLikedFeedbacks] = useState<Set<string>>(new Set());
  
  // Form state
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    rating: 5,
    comment: ''
  });

  // Load liked feedbacks from localStorage
  useEffect(() => {
    const liked = localStorage.getItem(`liked_feedbacks_${tripId}`);
    if (liked) {
      setLikedFeedbacks(new Set(JSON.parse(liked)));
    }
  }, [tripId]);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('feedbacks')
        .select('*')
        .eq('trip_id', tripId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setFeedbacks(data || []);
    } catch (err: any) {
      console.error('Error fetching feedbacks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [tripId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.user_name.trim() || !formData.comment.trim()) {
      toast.error('الرجاء ملء جميع الحقول المطلوبة');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('feedbacks')
        .insert([{
          trip_id: tripId,
          user_name: formData.user_name.trim(),
          user_email: formData.user_email.trim() || null,
          rating: formData.rating,
          comment: formData.comment.trim(),
          likes: 0
        }]);
      
      if (error) throw error;
      
      toast.success('شكراً لك! تم إضافة تقييمك بنجاح');
      setFormData({ user_name: '', user_email: '', rating: 5, comment: '' });
      setShowForm(false);
      fetchFeedbacks();
    } catch (err: any) {
      toast.error('حدث خطأ أثناء إضافة التقييم');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (feedbackId: string, currentLikes: number) => {
    if (likedFeedbacks.has(feedbackId)) {
      toast.info('لقد قمت بالإعجاب بهذا التقييم مسبقاً');
      return;
    }

    try {
      const { error } = await supabase
        .from('feedbacks')
        .update({ likes: currentLikes + 1 })
        .eq('id', feedbackId);
      
      if (error) throw error;
      
      // Update local state
      const newLiked = new Set(likedFeedbacks);
      newLiked.add(feedbackId);
      setLikedFeedbacks(newLiked);
      localStorage.setItem(`liked_feedbacks_${tripId}`, JSON.stringify([...newLiked]));
      
      // Update feedbacks list
      setFeedbacks(feedbacks.map(f => 
        f.id === feedbackId ? { ...f, likes: f.likes + 1 } : f
      ));
      
      toast.success('شكراً لإعجابك!');
    } catch (err: any) {
      toast.error('حدث خطأ');
      console.error(err);
    }
  };

  const calculateAverageRating = () => {
    if (feedbacks.length === 0) return 0;
    const sum = feedbacks.reduce((acc, f) => acc + f.rating, 0);
    return (sum / feedbacks.length).toFixed(1);
  };

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={interactive ? 28 : 20}
            className={`${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={() => interactive && onRate && onRate(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6 md:p-8" dir="rtl">
      {/* Header with Stats */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2 font-['Cairo']">
            تقييمات العملاء
          </h3>
          {feedbacks.length > 0 && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-orange-600">{calculateAverageRating()}</span>
                {renderStars(Math.round(Number(calculateAverageRating())))}
              </div>
              <span className="text-gray-500 font-['Cairo']">
                ({feedbacks.length} {feedbacks.length === 1 ? 'تقييم' : 'تقييمات'})
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-200 font-['Cairo']"
        >
          {showForm ? 'إلغاء' : 'أضف تقييمك'}
        </button>
      </div>

      {/* Add Feedback Form */}
      {showForm && (
        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <h4 className="text-lg font-bold text-gray-900 mb-4 font-['Cairo']">
            شاركنا تجربتك في رحلة {tripTitle}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 font-['Cairo']">
                  الاسم الكامل *
                </label>
                <input
                  type="text"
                  required
                  value={formData.user_name}
                  onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-100 outline-none font-['Cairo']"
                  placeholder="محمد أحمد"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1 font-['Cairo']">
                  البريد الإلكتروني (اختياري)
                </label>
                <input
                  type="email"
                  value={formData.user_email}
                  onChange={(e) => setFormData({ ...formData, user_email: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-100 outline-none font-['Cairo']"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 font-['Cairo']">
                التقييم *
              </label>
              {renderStars(formData.rating, true, (rating) => setFormData({ ...formData, rating }))}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1 font-['Cairo']">
                تعليقك *
              </label>
              <textarea
                required
                rows={4}
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-100 outline-none resize-none font-['Cairo']"
                placeholder="شاركنا تجربتك في هذه الرحلة..."
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-['Cairo']"
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>جاري الإرسال...</span>
                </>
              ) : (
                <span>إرسال التقييم</span>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Feedbacks List */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="animate-spin text-orange-600 mb-4 mx-auto" size={40} />
          <p className="text-gray-500 font-['Cairo']">جاري تحميل التقييمات...</p>
        </div>
      ) : feedbacks.length > 0 ? (
        <div className="space-y-6">
          {feedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-full">
                    <User size={20} className="text-white" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 font-['Cairo']">{feedback.user_name}</h5>
                    <div className="flex items-center gap-2 mt-1">
                      {renderStars(feedback.rating)}
                      <span className="text-xs text-gray-400 font-['Cairo']">
                        {new Date(feedback.created_at!).toLocaleDateString('ar-EG-u-nu-latn', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mb-4 font-['Cairo']">
                {feedback.comment}
              </p>

              <button
                onClick={() => handleLike(feedback.id, feedback.likes)}
                disabled={likedFeedbacks.has(feedback.id)}
                className={`flex items-center gap-2 text-sm font-semibold transition-all font-['Cairo'] ${
                  likedFeedbacks.has(feedback.id)
                    ? 'text-orange-600 cursor-not-allowed'
                    : 'text-gray-500 hover:text-orange-600'
                }`}
              >
                <ThumbsUp
                  size={18}
                  className={likedFeedbacks.has(feedback.id) ? 'fill-orange-600' : ''}
                />
                <span>مفيد ({feedback.likes})</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MessageCircle className="mx-auto mb-4 text-gray-300" size={64} />
          <h4 className="text-xl font-bold text-gray-900 mb-2 font-['Cairo']">
            لا توجد تقييمات بعد
          </h4>
          <p className="text-gray-500 font-['Cairo'] mb-4">
            كن أول من يشارك تجربته في هذه الرحلة
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-orange-200 font-['Cairo']"
          >
            أضف تقييمك الآن
          </button>
        </div>
      )}
    </div>
  );
};

export default FeedbackSection;

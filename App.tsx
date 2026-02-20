
import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { supabase, checkConfig } from './supabase';
import HomePage from './pages/HomePage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AboutPage from './pages/AboutPage';
import TripDetailsPage from './pages/TripDetailsPage';
import Navbar from './components/Navbar';
import { WifiOff, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!checkConfig()) {
      setError('Supabase is not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
      setLoading(false);
      return;
    }

    const initSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        setSession(session);
      } catch (err: any) {
        console.error('Session initialization error:', err);
        // "Failed to fetch" is a common error string for network/CORS issues
        if (err.message?.includes('fetch') || err.name === 'TypeError') {
          setError('Could not connect to the database. Please check your internet connection and Supabase configuration.');
        } else {
          setError(err.message || 'An unexpected error occurred during initialization.');
        }
      } finally {
        setLoading(false);
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center" dir="rtl">
        <div className="bg-red-50 p-8 rounded-3xl border border-red-100 max-w-md shadow-2xl shadow-red-100">
          <div className="bg-red-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <WifiOff className="text-red-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4 font-['Cairo']">خطأ في الاتصال</h1>
          <p className="text-gray-600 mb-8 leading-relaxed font-['Cairo']">
            {error.includes('configured') 
              ? 'لم يتم إعداد قاعدة البيانات بشكل صحيح. يرجى التأكد من إضافة مفاتيح Supabase في المتغيرات البيئية.'
              : 'فشل الاتصال بخادم البيانات. يرجى التأكد من اتصالك بالإنترنت ومحاولة تحديث الصفحة.'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-xl transition-all font-['Cairo'] shadow-lg shadow-orange-100"
          >
            تحديث الصفحة
          </button>
        </div>
        <p className="mt-8 text-[10px] text-gray-300 uppercase tracking-widest selection:bg-red-100">{error}</p>
      </div>
    );
  }

  return (
    <Router>
      <Toaster position="top-center" expand={false} richColors />
      <div className="min-h-screen flex flex-col">
        <Navbar session={session} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/trip/:id" element={<TripDetailsPage />} />
            <Route 
              path="/admin" 
              element={session ? <AdminDashboard /> : <Navigate to="/admin/login" />} 
            />
            <Route 
              path="/admin/login" 
              element={!session ? <AdminLogin /> : <Navigate to="/admin" />} 
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <footer className="bg-gray-900 text-white py-12 px-6" dir="rtl">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-right">
            <div>
              <h3 className="text-xl font-bold mb-4 font-['Cairo'] bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">RJ TRAVEL</h3>
              <p className="text-gray-400 font-['Cairo'] leading-relaxed">وجهتك الأولى لاستكشاف العالم بلمسة من الرفاهية والأصالة.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 font-['Cairo']">روابط سريعة</h4>
              <ul className="space-y-2 text-gray-400 font-['Cairo']">
                <li><a href="/" className="hover:text-orange-500 transition-colors">الرئيسية</a></li>
                <li><a href="/about" className="hover:text-orange-500 transition-colors">من نحن</a></li>
                <li><a href="/#trips" className="hover:text-orange-500 transition-colors">الرحلات القادمة</a></li>
                <li><a href="/#history" className="hover:text-orange-500 transition-colors">أرشيف الرحلات</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 font-['Cairo']">تواصل معنا</h4>
              <ul className="space-y-3 text-gray-400 font-['Cairo']">
                <li className="flex items-center gap-2">
                  <Phone size={16} className="text-orange-500" />
                  <a href="tel:+212669337019" className="hover:text-orange-500 transition-colors" dir="ltr">+212 669-337019</a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={16} className="text-orange-500" />
                  <a href="mailto:rj.vip.travel@gmail.com" className="hover:text-orange-500 transition-colors">rj.vip.travel@gmail.com</a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin size={16} className="text-orange-500" />
                  <span>الدار البيضاء، المغرب</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 font-['Cairo']">تابعنا</h4>
              <p className="text-gray-400 font-['Cairo'] mb-4">ابقَ على اطلاع بأحدث العروض والرحلات</p>
              <div className="flex gap-3">
                <a 
                  href="https://web.facebook.com/profile.php?id=61566130067614" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </a>
                <a 
                  href="https://www.instagram.com/rajii_travel" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
                {/* <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                  aria-label="Twitter"
                >
                  <Twitter size={20} />
                </a> */}
                <a 
                  href="https://wa.me/212669337019" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-gray-800 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 p-3 rounded-full transition-all duration-300 transform hover:scale-110"
                  aria-label="WhatsApp"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm font-['Cairo']">
            © {new Date().getFullYear()}  RJ TRAVEL. جميع الحقوق محفوظة.
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;

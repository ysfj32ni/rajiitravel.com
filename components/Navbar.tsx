
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, LogOut, Home } from 'lucide-react';
import { supabase } from '../supabase';

interface NavbarProps {
  session: any;
}

const Navbar: React.FC<NavbarProps> = ({ session }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminPath = location.pathname.startsWith('/admin');

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const scrollToSection = (sectionId: string) => {
    // If not on homepage, navigate to homepage first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      // Already on homepage, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <nav className={`bg-white shadow-sm sticky top-0 z-50 transition-all ${isAdminPath ? 'ltr' : 'rtl'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-3 text-2xl font-bold">
            <img 
              src="/logo.png" 
              alt="RJ Travel Logo" 
              className="h-10 w-10 object-contain"
              onError={(e) => {
                // Fallback to a gradient box with text if image fails to load
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden h-10 w-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              RJ
            </div>
            <span className="hidden sm:block">
              RJ <span className="text-orange-600">TRAVEL</span>
            </span>
          </Link>

          <div className="flex items-center space-x-4 space-x-reverse">
            {!isAdminPath ? (
              <>
                <Link 
                  to="/" 
                  className={`text-gray-700 hover:text-orange-600 font-medium px-3 py-2 transition-colors ${location.pathname === '/' ? 'text-orange-600 font-bold' : ''}`}
                >
                  الرئيسية
                </Link>
                <Link 
                  to="/about" 
                  className={`text-gray-700 hover:text-orange-600 font-medium px-3 py-2 transition-colors ${location.pathname === '/about' ? 'text-orange-600 font-bold' : ''}`}
                >
                  من نحن
                </Link>
                <button 
                  onClick={() => scrollToSection('trips')}
                  className="text-gray-700 hover:text-orange-600 font-medium px-3 py-2 transition-colors"
                >
                  الرحلات
                </button>
                <button 
                  onClick={() => scrollToSection('history')}
                  className="text-gray-700 hover:text-orange-600 font-medium px-3 py-2 transition-colors"
                >
                  الأرشيف
                </button>
                <Link 
                  to="/admin" 
                  className="text-gray-500 hover:text-orange-600 p-2 rounded-full bg-gray-100 hover:bg-orange-50 transition-colors"
                  title="لوحة الإدارة"
                >
                  <User size={20} />
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/" 
                  className="text-gray-600 hover:text-orange-600 flex items-center gap-1 transition-colors"
                >
                  <Home size={18} /> الموقع
                </Link>
                {session && (
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700 font-medium transition-colors"
                  >
                    <LogOut size={18} /> خروج
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

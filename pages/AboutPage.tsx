
import React from 'react';
import { Award, Users, Globe, Heart, Target, Sparkles, MapPin, Clock } from 'lucide-react';
import ClientsSlider from '../components/ClientsSlider';

const AboutPage: React.FC = () => {
  return (
    <div className="bg-white" dir="rtl">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=2000" 
            alt="About Us" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600/80 to-red-600/80"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg">
            من نحن؟
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-gray-100 max-w-3xl mx-auto leading-relaxed">
            رحلتك تبدأ معنا - نحن أكثر من مجرد وكالة سفر
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-right">
              <h2 className="text-4xl font-bold text-gray-900 mb-6 flex items-center gap-3 justify-end">
                <span>قصتنا</span>
                <Heart className="text-orange-600" size={40} />
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                <strong className="text-orange-600">RJ TRAVEL</strong> هي وكالة سفر مغربية متخصصة في تنظيم الرحلات السياحية الفاخرة حول العالم. منذ تأسيسنا، كان هدفنا الأساسي هو تحويل أحلام السفر إلى تجارب لا تُنسى.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-4">
                نؤمن بأن السفر ليس مجرد الانتقال من مكان لآخر، بل هو استكشاف ثقافات جديدة، وخلق ذكريات خالدة، وبناء علاقات عميقة مع الأماكن والناس.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                نحن نقدم خدمات سياحية متكاملة تشمل الحجوزات، التنظيم، والمرافقة لضمان تجربة سلسة ومريحة لجميع عملائنا.
              </p>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1000" 
                alt="Travel" 
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-2xl shadow-xl">
                <div className="text-4xl font-black mb-1">+15</div>
                <div className="text-sm">عاماً من الخبرة</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">قيمنا</h2>
          <p className="text-gray-600 text-lg mb-16 max-w-3xl mx-auto">
            نلتزم بأعلى معايير الجودة والاحترافية في كل ما نقوم به
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-orange-100 to-red-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="text-orange-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">الاحترافية</h3>
              <p className="text-gray-600 leading-relaxed">
                نحرص على تقديم خدمات بأعلى مستويات الاحترافية والدقة في التنظيم والتنفيذ.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-orange-100 to-red-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="text-orange-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">الشغف</h3>
              <p className="text-gray-600 leading-relaxed">
                نحب ما نفعله ونعمل بشغف لجعل كل رحلة تجربة استثنائية ومميزة.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-orange-100 to-red-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="text-orange-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">الجودة</h3>
              <p className="text-gray-600 leading-relaxed">
                نختار بعناية شركاءنا وخدماتنا لضمان تقديم أفضل تجربة سفر ممكنة.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">لماذا تختارنا؟</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              نقدم لك تجربة سفر متكاملة تجمع بين الجودة والراحة والأسعار المناسبة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">+5000 مسافر</h3>
              <p className="text-gray-600">عميل راضٍ عن خدماتنا</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">+120 وجهة</h3>
              <p className="text-gray-600">حول العالم</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">دعم 24/7</h3>
              <p className="text-gray-600">خدمة عملاء متواصلة</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">أفضل الأسعار</h3>
              <p className="text-gray-600">جودة عالية بأسعار تنافسية</p>
            </div>
          </div>
        </div>
      </section>

      {/* Clients Slider */}
      <ClientsSlider />

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">هل أنت مستعد لمغامرتك القادمة؟</h2>
          <p className="text-xl mb-8 opacity-90">
            انضم إلى آلاف المسافرين الذين اختاروا RJ TRAVEL لتحقيق أحلام سفرهم
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/#trips" 
              className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-bold transition-all shadow-xl"
            >
              تصفح الرحلات
            </a>
            <a 
              href="https://wa.me/212123456789" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 text-white border-2 border-white backdrop-blur-md px-8 py-4 rounded-full text-lg font-bold transition-all"
            >
              تواصل معنا
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

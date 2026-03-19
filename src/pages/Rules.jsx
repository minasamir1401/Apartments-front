import React from 'react';
import { motion } from 'framer-motion';
import { Shield, HelpCircle, FileText, Activity, CheckCircle } from 'lucide-react';

const Rules = () => {
  return (
    <div className="container mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">القواعد والدليل للمستأجر</h1>
        <p className="text-neutral-500">كل ما تحتاج لمعرفته لضمان إقامة مريحة وسلسة.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="p-8 bg-white rounded-[2.5rem] shadow-sm border border-neutral-100">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-4">قواعد السلوك العامة</h3>
            <ul className="space-y-4 text-neutral-500 font-light">
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-xs text-black font-bold">1</span>
                احترام الجيران وعدم إصدار أصوات مزعجة بعد الساعة 11 مساءً.
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-xs text-black font-bold">2</span>
                الحفاظ على نظافة الشقة والمرافق العامة.
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-xs text-black font-bold">3</span>
                التدخين مسموح به فقط في الشرفات (البلكونات).
              </li>
            </ul>
          </div>

          <div className="p-8 bg-neutral-900 text-white rounded-[2.5rem] shadow-xl">
            <div className="w-12 h-12 bg-white/10 text-primary rounded-2xl flex items-center justify-center mb-6">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">سياسة الإلغاء</h3>
            <p className="text-neutral-400 font-light leading-relaxed">
              يمكن إلغاء الحجز مجاناً حتى قبل موعد الوصول بـ 48 ساعة. في حالة الإلغاء خلال أقل من 48 ساعة يتم خصم تكلفة ليلة واحدة كرسوم إلغاء.
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="p-8 bg-white rounded-[2.5rem] shadow-sm border border-neutral-100">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-4">الأوراق المطلوبة</h3>
            <p className="text-neutral-500 mb-6 font-light">يجب تقديم الأوراق التالية عند تسجيل الدخول:</p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-neutral-600">
                <CheckCircle className="w-5 h-5 text-green-500" /> صورة البطاقة الشخصية (أو جواز السفر للأجانب)
              </li>
              <li className="flex items-center gap-3 text-neutral-600">
                <CheckCircle className="w-5 h-5 text-green-500" /> وثيقة الزواج (للمصريين)
              </li>
            </ul>
          </div>

          <div className="p-8 bg-primary text-black rounded-[2.5rem] shadow-sm">
            <div className="w-12 h-12 bg-black/10 text-black rounded-2xl flex items-center justify-center mb-6">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold mb-4">هل لديك سؤال؟</h3>
            <p className="font-medium mb-6">فريقنا جاهز للرد على استفساراتك في أي وقت.</p>
            <a href="tel:0123456789" className="bg-black text-white px-8 py-3 rounded-full font-bold inline-block">تواصل معنا</a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Rules;

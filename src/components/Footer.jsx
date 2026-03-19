import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white py-12 px-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-2">
          <h2 className="text-3xl font-black text-primary mb-6">أثــــر Athar</h2>
          <p className="text-neutral-400 max-w-sm font-light leading-relaxed">
            نحن نقدم تجربة إقامة فريدة تجمع بين الفخامة والخصوصية. جميع شققنا مجهزة بأعلى المعايير لضمان راحتك وسلامتك.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-6">روابط سريعة</h4>
          <ul className="space-y-4 text-neutral-400">
            <li><a href="/" className="hover:text-primary transition-colors">الرئيسية</a></li>
            <li><a href="/book" className="hover:text-primary transition-colors">احجز الآن</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">شروط الاستخدام</a></li>
            <li><a href="#" className="hover:text-primary transition-colors">سياسة الخصوصية</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">تواصل معنا</h4>
          <p className="text-neutral-400 mb-4">+20 123 456 7890</p>
          <p className="text-neutral-400">info@luxrental.com</p>
        </div>
      </div>
      <div className="container mx-auto mt-12 pt-8 border-t border-white/5 text-center text-neutral-500 text-sm">
        جميع الحقوق محفوظة © 2026 أثـــر Athar - تصميم وتطوير فريق أثر
      </div>
    </footer>
  );
};

export default Footer;

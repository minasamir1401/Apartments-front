import React from 'react';
import { motion } from 'framer-motion';
import { Shield, HelpCircle, FileText, Activity, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Rules = () => {
  const { t } = useTranslation();
  return (
    <div className="container mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black mb-4 italic text-on-surface">{t('rules_title')}</h1>
        <p className="text-on-surface-variant font-bold text-lg">{t('rules_subtitle')}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="p-8 bg-surface rounded-[2.5rem] shadow-sm border border-outline-variant/10">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black mb-4 text-on-surface italic">{t('rules_general_title')}</h3>
            <ul className="space-y-4 text-on-surface-variant font-bold">
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-xs text-primary font-black flex-shrink-0">1</span>
                {t('rules_general_1')}
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-xs text-primary font-black flex-shrink-0">2</span>
                {t('rules_general_2')}
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center text-xs text-primary font-black flex-shrink-0">3</span>
                {t('rules_general_3')}
              </li>
            </ul>
          </div>

          <div className="p-8 bg-surface-container-highest text-on-surface rounded-[2.5rem] shadow-xl border border-outline-variant/10">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-primary/20 text-primary">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black mb-4 text-on-surface italic">{t('rules_cancel_title')}</h3>
            <p className="text-on-surface-variant font-bold leading-relaxed">
              {t('rules_cancel_text')}
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div className="p-8 bg-surface rounded-[2.5rem] shadow-sm border border-outline-variant/10">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black mb-4 text-on-surface italic">{t('rules_docs_title')}</h3>
            <p className="text-on-surface-variant mb-6 font-bold">{t('rules_docs_subtitle')}</p>
            <ul className="space-y-3 font-black">
              <li className="flex items-center gap-3 text-on-surface">
                <CheckCircle className="w-5 h-5 text-primary" /> {t('rules_doc_1')}
              </li>
              <li className="flex items-center gap-3 text-on-surface">
                <CheckCircle className="w-5 h-5 text-primary" /> {t('rules_doc_2')}
              </li>
            </ul>
          </div>

          <div className="p-8 text-on-primary rounded-[2.5rem] shadow-sm bg-primary origin-center">
            <div className="w-12 h-12 bg-on-primary/20 text-on-primary rounded-2xl flex items-center justify-center mb-6">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black mb-4 italic">{t('rules_q_title')}</h3>
            <p className="font-bold mb-6 opacity-90">{t('rules_q_text')}</p>
            <a href="tel:01234567890" className="bg-on-primary text-primary px-8 py-3 rounded-full font-black inline-block hover:bg-surface transition-colors shadow-lg uppercase tracking-widest text-sm">{t('rules_btn_contact')}</a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Rules;

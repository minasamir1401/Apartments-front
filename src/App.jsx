import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { HelmetProvider } from 'react-helmet-async';

// Eagerly load only what's needed for the first paint
import Home from './pages/Home';

// Lazy load all other pages — they only load when visited
const Booking = lazy(() => import('./pages/Booking'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Apartments = lazy(() => import('./pages/Apartments'));
const ApartmentDetails = lazy(() => import('./pages/ApartmentDetails'));
const BookingStatus = lazy(() => import('./pages/BookingStatus'));
const Rules = lazy(() => import('./pages/Rules'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'));
const Chatbot = lazy(() => import('./components/Chatbot'));

// Minimal loading spinner shown during lazy page load
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface">
    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function AppContent() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const canonicalUrl = `https://red-gate.tech${location.pathname}`;

  return (
    <div className={`min-h-screen flex flex-col ${i18n.language === 'ar' ? 'font-cairo' : 'font-sans'}`}>
      <Helmet>
        <html lang={i18n.language} dir={i18n.language === 'ar' ? 'rtl' : 'ltr'} />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      <Navbar />
      <main className="flex-grow pt-20">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/apartments" element={<Apartments />} />
            <Route path="/apartments/:id" element={<ApartmentDetails />} />
            <Route path="/book" element={<Booking />} />
            <Route path="/status" element={<BookingStatus />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <Suspense fallback={null}>
        <Chatbot />
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AppContent />
      </Router>
    </HelmetProvider>
  );
}

export default App;

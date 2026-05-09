import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import SplashScreen from './components/SplashScreen';
import { FlyProvider } from './context/FlyContext';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ImportantBankPage from './pages/ImportantBankPage';

function Layout({ children, showFooter = true }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      {showFooter && <Footer />}
    </>
  );
}

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15, filter: 'blur(10px)' }}
    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    exit={{ opacity: 0, y: -15, filter: 'blur(10px)' }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Layout><LandingPage /></Layout></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
        <Route path="/signup" element={<PageWrapper><SignupPage /></PageWrapper>} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <PageWrapper><Layout showFooter={false}><DashboardPage /></Layout></PageWrapper>
          </ProtectedRoute>
        } />
        <Route path="/bank" element={
          <ProtectedRoute>
            <PageWrapper><Layout showFooter={false}><ImportantBankPage /></Layout></PageWrapper>
          </ProtectedRoute>
        } />
        <Route path="*" element={
          <PageWrapper>
            <Layout>
              <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, paddingTop: 80 }}>
                <div style={{ fontSize: '6rem', fontWeight: 900, fontFamily: 'Space Grotesk', background: 'linear-gradient(135deg, var(--primary), var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>404</div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Page not found</h2>
                <p style={{ color: 'var(--text-300)' }}>The page you're looking for doesn't exist.</p>
                <a href="/" className="btn btn-primary">Go Home</a>
              </div>
            </Layout>
          </PageWrapper>
        } />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <ThemeProvider>
    <FlyProvider>
    <AuthProvider>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </AuthProvider>
    </FlyProvider>
    </ThemeProvider>
  );
}

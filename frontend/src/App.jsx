import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <ThemeProvider>
    <FlyProvider>
    <AuthProvider>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><LandingPage /></Layout>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout showFooter={false}><DashboardPage /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/bank" element={
            <ProtectedRoute>
              <Layout showFooter={false}><ImportantBankPage /></Layout>
            </ProtectedRoute>
          } />
          <Route path="*" element={
            <Layout>
              <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, paddingTop: 80 }}>
                <div style={{ fontSize: '6rem', fontWeight: 900, fontFamily: 'Space Grotesk', background: 'linear-gradient(135deg, #a78bfa, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>404</div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Page not found</h2>
                <p style={{ color: 'var(--text-300)' }}>The page you're looking for doesn't exist.</p>
                <a href="/" className="btn btn-primary">Go Home</a>
              </div>
            </Layout>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </FlyProvider>
    </ThemeProvider>
  );
}

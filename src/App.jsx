import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import WizardApp from './pages/WizardApp';
import AuthModal from './components/AuthModal';

export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'wizard'
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('savjal_user'));
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('savjal_token') || null);

  const handleOpenAuth = () => {
    setIsAuthOpen(true);
  };

  const handleCloseAuth = () => {
    setIsAuthOpen(false);
  };

  const handleLoginSuccess = ({ user: userData, token: tokenData }) => {
    setUser(userData);
    setToken(tokenData);
    if (userData) localStorage.setItem('savjal_user', JSON.stringify(userData));
    if (tokenData) localStorage.setItem('savjal_token', tokenData);
    setIsAuthOpen(false);
    setView('wizard');
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('savjal_user');
    localStorage.removeItem('savjal_token');
    setView('landing');
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-white selection:bg-sky-500 selection:text-slate-950 font-sans">
      {view === 'landing' ? (
        <LandingPage
          onOpenAuth={handleOpenAuth}
          onStartWizard={(target) => {
            if (target === 'wizard' && !token) {
              setIsAuthOpen(true);
            } else {
              setView(target);
            }
          }}
          user={user}
          onLogout={handleLogout}
        />
      ) : (
        <WizardApp
          onOpenAuth={handleOpenAuth}
          onGoLanding={() => setView('landing')}
          user={user}
          token={token}
          onLogout={handleLogout}
        />
      )}

      {/* Auth Modal Screen */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={handleCloseAuth}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}


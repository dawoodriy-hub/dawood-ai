import { useState } from 'react';
import HomePage from './components/HomePage.jsx';
import ChatPage from './components/ChatPage.jsx';
import AuthModal from './components/AuthModal.jsx';
import ProfileModal from './components/ProfileModal.jsx';

export default function App() {
  const [session, setSession]     = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  function handleSignIn() {
    setShowModal(true);
  }

  function handleConfirm(creds) {
    setSession(creds);
    setShowModal(false);
    setShowProfileModal(true);
  }

  function handleProfileConfirm(profile) {
    setSession((prev) => ({ ...prev, ...profile, profileComplete: true }));
    setShowProfileModal(false);
  }

  function handleSignOut() {
    setSession(null);
    setShowProfileModal(false);
  }

  if (session?.profileComplete) {
    return <ChatPage session={session} onSignOut={handleSignOut} />;
  }

  return (
    <>
      <HomePage onSignIn={handleSignIn} />
      {showModal && (
        <AuthModal
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirm}
        />
      )}
      {showProfileModal && (
        <ProfileModal
          onClose={() => setShowProfileModal(false)}
          onConfirm={handleProfileConfirm}
        />
      )}
    </>
  );
}

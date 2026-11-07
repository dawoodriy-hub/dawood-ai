import { useState } from 'react';
import HomePage from './components/HomePage.jsx';
import ChatPage from './components/ChatPage.jsx';
import AuthModal from './components/AuthModal.jsx';
import ProfileModal from './components/ProfileModal.jsx';
import { loadSession, saveSession, clearSession } from './lib/storage.js';
import { upsertUser, getUser } from './lib/authStorage.js';

export default function App() {
  const [session, setSession] = useState(() => loadSession());
  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  function persist(next) {
    saveSession(next);
    setSession(next);
  }

  function handleSignIn() {
    setShowModal(true);
  }

  function handleConfirm(creds) {
    const email = (creds.email || '').toLowerCase();
    const existing = getUser(email);
    persist({ 
      ...creds, 
      email,
      displayName: existing?.displayName || '',
      dob: existing?.dob || null,
      profileComplete: !!existing?.displayName
    });
    setShowModal(false);
    if (existing?.displayName) {
      setShowProfileModal(false);
    } else {
      setShowProfileModal(true);
    }
  }

  function handleProfileConfirm(profile) {
    const email = session?.email?.toLowerCase();
    const updated = upsertUser(email, profile);
    setSession((prev) => {
      const next = { ...prev, ...profile, profileComplete: true };
      saveSession(next);
      return next;
    });
    setShowProfileModal(false);
  }

  function handleSignOut() {
    clearSession();
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

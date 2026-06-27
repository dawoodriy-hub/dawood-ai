import { useState } from 'react';
import HomePage from './components/HomePage.jsx';
import ChatPage from './components/ChatPage.jsx';
import ApiKeyModal from './components/ApiKeyModal.jsx';

export default function App() {
  const [session, setSession]     = useState(null);
  const [showModal, setShowModal] = useState(false);

  function handleSignIn() {
    setShowModal(true);
  }

  function handleConfirm(creds) {
    setSession(creds);
    setShowModal(false);
  }

  function handleSignOut() {
    setSession(null);
  }

  if (session) {
    return <ChatPage session={session} onSignOut={handleSignOut} />;
  }

  return (
    <>
      <HomePage onSignIn={handleSignIn} />
      {showModal && (
        <ApiKeyModal
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}

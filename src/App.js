import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Home, ChatRoom, Profile, Error404, Login } from './pages';
import { Navbar } from './components';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';
import SyncLoader from 'react-spinners/SyncLoader';

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="loaderContainer">
        <h1>Nukkad</h1>
        <SyncLoader color={`#7abb27`} loading={loading} size={15} margin={10} />
      </div>
    );
  }

  return (
    <>
      {!user ? (
        <Login />
      ) : (
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:roomID" element={<ChatRoom />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Error404 />} />
          </Routes>
        </>
      )}
    </>
  );
}

export default App;

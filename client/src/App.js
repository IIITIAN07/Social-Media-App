import { useSelector } from 'react-redux';
import './App.css';
import Auth from './Pages/auth/Auth';
import Home from './Pages/home/Home';
import Profile from './Pages/profile/Profile';
import Chat from './Pages/chat/Chat';
import Notifications from './Pages/notifications/Notifications';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';

function App() {

  const user = useSelector((state) => state.authReducer.authData);
  //Reads the logged-in user from Redux.
// If not logged in → user = null.

  return (
    <SocketProvider user={user?.user}>
      <div className="App">
        <div className="blur" style={{ top: '-18%', right: '0' }}></div>
        <div className="blur" style={{ top: '36%', left: '-8rem' }}></div>


        <Routes>//React checks the current URL.
          <Route path='/' element={user ? <Navigate to='home' /> : <Navigate to='auth' />} />
          <Route path='/home' element={user ? <Home /> : <Navigate to='../auth' />} />
          <Route path='/auth' element={user ? <Navigate to='../home' /> : <Auth />} />
          <Route path='/profile/:id' element={user ? <Profile /> : <Navigate to='../auth' />} />
          <Route path='/notifications' element={user ? <Notifications /> : <Navigate to='../auth' />} />
          <Route path='/chat' element={user ? <Chat /> : <Navigate to='../auth' />} />
        </Routes>

      </div>
    </SocketProvider>
  );
}

export default App;

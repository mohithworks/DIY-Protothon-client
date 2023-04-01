import { useEffect, useState  } from 'react';
import './App.css';
import Auth from './pages/Auth';
import Login from './components/Login';
import Signup from './components/Signup';
import Contribute from './pages/Contribute';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useSelector } from 'react-redux';
import { AuthContextProvider } from './utils/context/AuthContext';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Auth />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/contribute",
    element: <Contribute />,
  },
]);

function App() {
  const user = useSelector(state => state.auth.user)

  useEffect(() => {
    console.log(window.env.SUPABASE_KEY)
  }, [])

  return (
    <div className='flex-1 justify-center items-center text-center h-full'>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </div>
  );
}

export default App;

import { useEffect, useState  } from 'react';
import './index.css';
import Login from './components/Login';
import { useSelector, useDispatch } from 'react-redux';

function App() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user)

  useEffect(() => {
    console.log(user)
  }, [])

  return (
    <div className="flex-1 bg-white justify-center items-center text-center">
      <Login />
    </div>
  );
}

export default App;

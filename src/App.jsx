import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Game from './pages/Game';
import Home from './pages/Home';

import './App.css'

function App() {
  const [count, setCount] = useState(0)


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
 
  },
  {
    path:"/home",
    element: <Home/>
  },

  { path:"/game/:id",
    element : <Game/>
  },
  
]);
  
  return (
    <>
    <RouterProvider router={router}/>
    </>
  )
}

export default App

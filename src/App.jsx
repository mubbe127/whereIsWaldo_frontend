import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Game from './pages/Game';

import './App.css'

function App() {
  const [count, setCount] = useState(0)


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
    ]
  },
]);
  
  return (
    <>

    <Game/>
    
    </>
  )
}

export default App

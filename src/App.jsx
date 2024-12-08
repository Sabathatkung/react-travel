import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Review from './review'
import Navbar from './Navbar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Navbar/>
      <Review/>
    </div>
  )
}

export default App

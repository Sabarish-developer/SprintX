import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navbar/>
    <div className='max-w-7xl mx-auto px-6 pt-17'>
      <HeroSection/>
    </div>
    </>
  )
}

export default App

import { useRef } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import SliderSection from './components/SliderSection';
import { navItems } from './constants/objects';
import AboutSection from './components/AboutSection';

function App() {
  const featuresRef = useRef(null);

  const sectionRefs = {
    features: featuresRef,
  };

  const handleScroll = (sectionKey) => {
    sectionRefs[sectionKey]?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Navbar navItems={navItems} handleScroll={handleScroll} />
      <div className='max-w-7xl mx-auto px-6 pt-17'>
        <HeroSection />
        <SliderSection ref={featuresRef} />
        <AboutSection/>
      </div>
    </>
  );
}

export default App;

import { useRef } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import SliderSection from './components/SliderSection';
import { navItems } from './constants/objects';
import AboutSection from './components/AboutSection';
import ContactUs from './components/ContactUs';
import Faq from './components/Faq';
import Footer from './components/Footer';
import bgImage from './assets/back.png';

function App() {
  const featuresRef = useRef(null);
  const aboutRef = useRef(null);
  const contactusRef = useRef(null);
  const faqRef = useRef(null);

  const sectionRefs = {
    features: featuresRef,
    about: aboutRef,
    contactus: contactusRef,
    faq: faqRef,
  };

  const handleScroll = (sectionKey) => {
    sectionRefs[sectionKey]?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen min-w-100 bg-cover bg-fixed bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
      <Navbar navItems={navItems} handleScroll={handleScroll} />
      <div className="max-w-7xl mx-auto px-6 pt-17">
        <HeroSection />
        <SliderSection ref={featuresRef} />
        <AboutSection ref={aboutRef} />
        <ContactUs ref={contactusRef} />
        <Faq ref={faqRef} />
      </div>
      <Footer />
    </div>
  );
}

export default App;
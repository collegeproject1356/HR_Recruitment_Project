import React from 'react';
import Hero from '../components/home/Hero';
import InfoSection from '../components/home/InfoSection';
import FeaturedJobs from '../components/home/FeaturedJobs';
import Footer from '../components/home/Footer';


const Home = () => {
  return (
    <div className="bg-[#fcf9f6] selection:bg-[var(--dark-green)] selection:text-white">
      
      <Hero />
      
      <InfoSection />

      <FeaturedJobs />
      <Footer />
    </div>
  );
};

export default Home;
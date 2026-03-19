import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-900">
      
      <img 
        src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2500&auto=format&fit=crop" 
        alt="Premium Career Path"
        className="absolute inset-0 w-full h-full object-cover opacity-70"
      />
      
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>

      <div className="absolute inset-0 max-w-7xl mx-auto px-6 md:px-12 flex flex-col justify-center text-white z-10 pt-28">
        
        <motion.div
          initial={{ opacity: 0, x: -100 }} 
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-xl" 
        >
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.5 }}
            className="text-[10px] md:text-xs tracking-[0.3em] uppercase mb-4 text-[#d4af37] font-semibold"
          >
            New Opportunities Await
          </motion.p>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif-garamond font-light leading-[1.1] tracking-tight mb-6">
            Pure <br /> <span className="font-semibold">Professionalism</span>
          </h1>
          
          <p className="text-gray-200 mb-8 text-xs md:text-sm font-light max-w-md leading-relaxed tracking-wide">
            Experience the brilliance of perfectly matched careers. Step into a world of exclusive corporate opportunities.
          </p>

          <Link to="/jobs">
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "#fff", color: "var(--dark-green)" }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 border border-white text-white font-semibold text-xs tracking-[0.2em] uppercase transition-all duration-300"
            >
              Explore Roles
            </motion.button>
          </Link>
        </motion.div>
      </div>

    </div>
  );
};

export default Hero;
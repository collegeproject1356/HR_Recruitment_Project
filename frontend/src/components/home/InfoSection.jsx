import React from 'react';
import { motion } from 'framer-motion';

const InfoSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 flex flex-col md:flex-row items-center gap-16 overflow-hidden">
      
      <motion.div 
        initial={{ opacity: 0, x: -80 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex-1 text-center md:text-left"
      >
        <p className="text-[var(--dark-green)] text-xs tracking-[0.3em] font-semibold uppercase mb-4">
          The Art of Recruitment
        </p>
        <h2 className="text-4xl md:text-6xl font-serif-garamond text-gray-900 leading-tight mb-8">
          Crafting Futures, <br /> Defining Success.
        </h2>
        <p className="text-gray-600 font-light leading-relaxed mb-8 max-w-lg mx-auto md:mx-0 text-sm">
          We believe that a career is more than just a job; it is a masterpiece in the making. Our platform meticulously curates the most prestigious opportunities from industry-leading corporations.
        </p>
        <button className="border-b border-[var(--dark-green)] text-[var(--dark-green)] pb-1 uppercase tracking-widest text-xs font-semibold hover:text-black hover:border-black transition-colors">
          Read Our Story
        </button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 80 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex-1 relative"
      >
        <div className="aspect-[4/5] overflow-hidden rounded-t-full">
          <img 
            src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop" 
            alt="Corporate Excellence" 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
          />
        </div>
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#f1e8d9] rounded-full -z-10"></div>
      </motion.div>

    </div>
  );
};

export default InfoSection;
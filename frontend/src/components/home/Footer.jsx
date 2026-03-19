import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Award, 
  UserPlus, 
  Headphones, 
  ShieldCheck, 
  FileText, 
  Linkedin, 
  Instagram, 
  Twitter, 
  Send,
  Mail,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[var(--dark-green)] to-[#0a1811] text-white pt-10 pb-6 border-t border-white/20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="text-white w-5 h-5 animate-pulse" />
              <h2 className="text-2xl font-serif-garamond font-bold tracking-[0.15em] text-white">
                HIREME
              </h2>
            </div>
            <p className="text-xs font-light text-gray-300 leading-relaxed mb-3">
              Curating exceptional talent for the world's most prestigious organizations. Elevate your career with unmatched exclusivity.
            </p>
          </div>

          <div>
            <h4 className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold mb-4 text-white">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs font-light text-gray-300">
              {[
                { name: "Featured Vacancies", icon: <Briefcase size={14} />, link: "/jobs" },
                { name: "Our Philosophy", icon: <Award size={14} />, link: "/" },
                { name: "Join Elite Network", icon: <UserPlus size={14} />, link: "/register" }
              ].map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.link} 
                    className="group flex items-center gap-2 hover:text-white transition-all duration-300"
                  >
                    <span className="opacity-70 group-hover:opacity-100 transition-opacity">
                      {item.icon}
                    </span>
                    <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                      {item.name}
                    </span>
                    <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 ml-auto" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold mb-4 text-white">
              Support
            </h4>
            <ul className="space-y-2.5 text-xs font-light text-gray-300">
              {[
                { name: "Client Care", icon: <Headphones size={14} /> },
                { name: "Privacy Policy", icon: <ShieldCheck size={14} /> },
                { name: "Terms of Service", icon: <FileText size={14} /> }
              ].map((item, index) => (
                <li key={index}>
                  <span className="group flex items-center gap-2 cursor-pointer hover:text-white transition-all duration-300">
                    <span className="opacity-70 group-hover:opacity-100 transition-opacity">
                      {item.icon}
                    </span>
                    <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                      {item.name}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold mb-4 text-white">
              Insider
            </h4>
            <p className="text-xs font-light text-gray-300 mb-3">
              Subscribe to receive updates and access to exclusive opportunities.
            </p>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400 group-focus-within:text-white transition-colors" />
              </div>
              <input 
                type="email" 
                placeholder="Enter email" 
                className="w-full bg-white/5 border border-white/20 text-white placeholder-gray-500 rounded-lg py-2 pl-9 pr-10 focus:outline-none focus:border-white focus:bg-white/10 transition-all text-xs"
              />
              <button className="absolute inset-y-0 right-1 flex items-center px-2 text-gray-400 hover:text-white transition-colors">
                <Send className="h-4 w-4 hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

        </div>

        <div className="pt-5 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] md:text-xs text-gray-400 font-light text-center md:text-left">
            &copy; {new Date().getFullYear()} <span className="text-white font-semibold">HireMe</span> Luxury Career Portal. All rights reserved.
          </p>
          
          <div className="flex gap-3">
            {[
              { icon: <Linkedin size={16} />, label: "LinkedIn" },
              { icon: <Instagram size={16} />, label: "Instagram" },
              { icon: <Twitter size={16} />, label: "Twitter" }
            ].map((social, index) => (
              <a 
                key={index}
                href="#" 
                aria-label={social.label}
                className="bg-white/5 border border-white/10 p-2 rounded-full text-gray-300 hover:text-[var(--dark-green)] hover:bg-white hover:-translate-y-1 transition-all duration-300 shadow-md"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
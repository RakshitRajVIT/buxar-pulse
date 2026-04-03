import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Paperclip, Sparkles, MapPin, Star, Settings, User, Crown, UtensilsCrossed, Stethoscope, GraduationCap, Hotel } from 'lucide-react';
import ParticleCanvas from './ParticleCanvas';
import StatsBanner from './StatsBanner';

const searchTabs = [
  { id: 'restaurants', label: 'Restaurants', icon: UtensilsCrossed, color: '#F97316' },
  { id: 'hospitals', label: 'Hospitals', icon: Stethoscope, color: '#EC4899' },
  { id: 'education', label: 'Education', icon: GraduationCap, color: '#06B6D4' },
  { id: 'hotels', label: 'Hotels', icon: Hotel, color: '#A78BFA' },
];

const trending = [
  { title: 'Top Rated Schools', emoji: '🎓', color: '#06B6D4' },
  { title: 'Emergency Services', emoji: '🚨', color: '#EC4899' },
  { title: 'Local Eateries', emoji: '🍜', color: '#F97316' },
  { title: 'Sacred Temples', emoji: '🛕', color: '#FBBF24' },
  { title: 'Ganges Ghats', emoji: '🌊', color: '#4F46E5' },
];

export default function HeroSection() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('restaurants');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="relative min-h-screen flex flex-col bg-[#07071A]">
      {/* Background Video Container */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.99 }}
        >
          <source src="/Buxar.mp4" type="video/mp4" />
        </video>
        {/* Dark Overlay for Readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>


      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-8 pb-16">
        {/* Badge */}

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl md:text-6xl lg:text-7xl font-black text-center leading-tight mb-4 mt-6"
        >
          Welcome To {' '}
          <span className="gradient-text">Buxar</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-base md:text-lg max-w-lg text-center mb-10"
          style={{ color: '#94A3B8' }}
        >
        </motion.p>

        {/* Central Search Hub */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: 'spring', damping: 20 }}
          className="glass w-full max-w-2xl mx-auto overflow-hidden rounded-2xl border border-white/20 backdrop-blur-xl"
          style={{
            boxShadow: '0 0 40px rgba(139, 92, 246, 0.4), 0 0 80px rgba(139, 92, 246, 0.2), 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
          }}
        >
          {/* Tab selector */}
          <div className="flex border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            {searchTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-bold transition-all cursor-pointer select-none relative"
                  style={{
                    color: isActive ? tab.color : '#ffffff',
                    background: isActive ? `${tab.color}11` : 'transparent',
                  }}
                >
                  <Icon size={15} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="searchTabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ background: tab.color }}
                      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Search input */}
          <div className="p-4">
            <textarea
              rows={2}
              placeholder={`Find me the best ${activeTab === 'restaurants' ? 'restaurant' : activeTab === 'hospitals' ? 'hospital' : activeTab === 'education' ? 'school' : 'hotel'} near the station...`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-white font-bold placeholder:text-white/70 placeholder:font-bold outline-none resize-none"
            />
            <div className="flex items-center justify-between mt-3">
              <button className="flex items-center gap-1.5 text-xs text-white font-bold hover:text-white/80 transition-colors cursor-pointer">
                <Paperclip size={14} /> Attach
              </button>
              <div className="flex items-center gap-2">
                <button
                  className="bg-primary/20 hover:bg-primary/30 text-primary p-2 rounded-lg transition-colors cursor-pointer"
                  onClick={() => navigate('/chat')}
                >
                  <Search size={16} />
                </button>
                <button
                  onClick={() => navigate('/map')}
                  className="btn-neon px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
                >
                  <MapPin size={14} /> Plan my trip
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      Stats Banner at bottom */
       <div className="relative z-10">
        <StatsBanner />
      </div>

      {/* Floating AI Chatbot Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2, type: 'spring', damping: 15 }}
        onClick={() => navigate('/chat')}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, #4F46E5, #A78BFA)',
          boxShadow: '0 0 30px rgba(79,70,229,0.5), 0 8px 24px rgba(0,0,0,0.4)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Sparkles size={22} className="text-foreground" />
      </motion.button>

      {/* Footer */}
      <footer
        className="relative z-10 mx-auto flex items-center justify-between px-6 py-4 text-xs text-muted-foreground"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span>© 2025 MyBuxar. All rights reserved.</span>
        
      </footer>
    </div>
  );
}

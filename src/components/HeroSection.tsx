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
    <div className="relative min-h-screen flex flex-col" style={{ background: '#07071A' }}>
      {/* Particle Background - covers entire section */}
      <div className="absolute inset-0 z-0">
        <ParticleCanvas />
      </div>
      <div className="absolute inset-0 z-[1] grid-overlay pointer-events-none" />
      <div className="absolute inset-0 z-[2] pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, #07071A 100%)' }} />

      {/* Sticky Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4" style={{ background: 'rgba(7,7,26,0.6)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2">
          <span className="text-xl font-black gradient-text">MY BUXAR</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          {['Inspiration', 'Features', 'FAQ'].map(link => (
            <a key={link} className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">{link}</a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <button className="text-muted-foreground hover:text-foreground cursor-pointer p-2"><Settings size={18} /></button>
          <button className="text-muted-foreground hover:text-foreground cursor-pointer p-2"><User size={18} /></button>
          <button
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #FBBF24, #A78BFA)', color: '#07071A' }}
          >
            <Crown size={12} /> Premium
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-8 pb-16">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-pill px-5 py-1.5 mb-6"
          style={{ border: '1px solid rgba(79,70,229,0.4)', background: 'rgba(79,70,229,0.1)', color: '#A78BFA', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' }}
        >
          🌊&nbsp; BUXAR, BIHAR &nbsp;·&nbsp; EST. 1539
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl md:text-6xl lg:text-7xl font-black text-center leading-tight mb-4"
        >
          Explore the Essence of{' '}
          <span className="gradient-text">Buxar</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-base md:text-lg max-w-lg text-center mb-10"
          style={{ color: '#94A3B8' }}
        >
          Discover sacred ghats, historic battlefields, and vibrant local life — all in one place.
        </motion.p>

        {/* Central Search Hub */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: 'spring', damping: 20 }}
          className="glass w-full max-w-2xl mx-auto overflow-hidden"
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
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-medium transition-all cursor-pointer select-none relative"
                  style={{
                    color: isActive ? tab.color : '#6B7280',
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
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none resize-none"
            />
            <div className="flex items-center justify-between mt-3">
              <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                <Paperclip size={14} /> Attach
              </button>
              <button
                onClick={() => navigate('/map')}
                className="btn-neon px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2"
              >
                <MapPin size={14} /> Plan my trip
              </button>
            </div>
          </div>
        </motion.div>

        {/* Trending Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="w-full max-w-2xl mt-8"
        >
          <h3 className="text-micro text-muted-foreground mb-3 px-1">🔥 Trending in Buxar</h3>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
            {trending.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.08, type: 'spring', damping: 20 }}
                className="glass card-hover flex-shrink-0 px-4 py-3 flex items-center gap-2.5 cursor-pointer"
                style={{ borderRadius: 14 }}
              >
                <span className="text-lg">{t.emoji}</span>
                <span className="text-xs font-medium text-foreground whitespace-nowrap">{t.title}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Stats Banner at bottom */}
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
        className="relative z-10 flex items-center justify-between px-6 py-4 text-xs text-muted-foreground"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span>© 2025 MyBuxar. All rights reserved.</span>
        <div className="flex gap-4">
          {['Twitter', 'Instagram', 'GitHub'].map(s => (
            <a key={s} className="hover:text-foreground transition-colors cursor-pointer">{s}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}

import { Map, Compass, Wrench, Calendar, User, Menu, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const tabs = [
  { id: 'map', label: 'Map', icon: Map, path: '/map' },
  { id: 'explore', label: 'Explore', icon: Compass, path: '/' },
  { id: 'services', label: 'Services', icon: Wrench, path: '/services' },
  // { id: 'events', label: 'Events', icon: Calendar, path: '/events' },
  // { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
];

export default function TopNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const activeId = tabs.find(t => t.path === location.pathname)?.id || 'explore';

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };
    // Keep map explorer immersive by hiding the floating nav on this route.
  if (location.pathname === '/map') {
    return null;
  }


  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300, delay: 0.2 }}
      className="fixed top-0 left-0 right-0 z-50 glass-pill mx-3 my-2"
      style={{ border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(6px)' }}
    >
      <div className="flex items-center justify-between px-3 py-2">
        {/* Logo */}
        <div className="text-white font-bold text-base">
          <span className="gradient-text">My Buxar</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 relative">
          {tabs.map(tab => {
            const isActive = tab.id === activeId;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className="relative flex flex-col items-center px-4 py-2 cursor-pointer select-none"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'rgba(79,70,229,0.2)',
                      border: '1px solid rgba(79,70,229,0.3)',
                    }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  />
                )}
                <Icon
                  size={18}
                  className="relative z-10"
                  style={{ color: isActive ? '#4F46E5' : '#6B7280' }}
                />
                <span
                  className="relative z-10 text-[9px] font-medium mt-0.5"
                  style={{ color: isActive ? '#4F46E5' : '#6B7280' }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-1 text-foreground hover:text-primary transition-colors"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t"
            style={{ borderColor: 'rgba(255,255,255,0.07)' }}
          >
            <div className="flex flex-col py-2">
              {tabs.map(tab => {
                const isActive = tab.id === activeId;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleNavigate(tab.path)}
                    className="flex items-center gap-3 px-3 py-2 transition-colors"
                    style={{
                      color: isActive ? '#4F46E5' : '#6B7280',
                      background: isActive ? 'rgba(79,70,229,0.1)' : 'transparent',
                    }}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

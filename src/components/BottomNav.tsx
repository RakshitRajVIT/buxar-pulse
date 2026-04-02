import { Map, Compass, Wrench, Calendar, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const tabs = [
  { id: 'map', label: 'Map', icon: Map, path: '/map' },
  { id: 'explore', label: 'Explore', icon: Compass, path: '/' },
  { id: 'services', label: 'Services', icon: Wrench, path: '/services' },
  { id: 'events', label: 'Events', icon: Calendar, path: '/events' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const activeId = tabs.find(t => t.path === location.pathname)?.id || 'explore';

  return (
    <motion.nav
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300, delay: 0.8 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 glass-pill px-3 py-2"
      style={{ border: '1px solid rgba(255,255,255,0.1)' }}
    >
      <div className="flex items-center gap-1 relative">
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
                size={20}
                className="relative z-10"
                style={{ color: isActive ? '#4F46E5' : '#6B7280' }}
              />
              <span
                className="relative z-10 text-[10px] font-medium mt-0.5"
                style={{ color: isActive ? '#4F46E5' : '#6B7280' }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </motion.nav>
  );
}

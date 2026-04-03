import { useState, useMemo } from 'react';
import { Search, X, Crosshair } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { places, categories, type Place } from '@/data/places';
import PlaceCard from '@/components/PlaceCard';
import BottomSheet from '@/components/BottomSheet';

function MapPin({ place, color, onClick }: { place: Place; color: string; onClick: () => void }) {
  const cat = categories.find(c => c.id === place.category);
  const emoji = cat?.label.split(' ')[0] || '📍';
  return (
    <div
      className="absolute cursor-pointer group"
      style={{
        left: `${((place.lng - 83.970) / 0.02) * 100}%`,
        top: `${((25.570 - place.lat) / 0.015) * 100}%`,
      }}
      onClick={onClick}
    >
      <div className="relative">
        <div
          className="absolute -inset-4 rounded-full animate-map-pulse"
          style={{ background: `${color}40` }}
        />
        <div
          className="w-9 h-9 flex items-center justify-center transition-transform group-hover:-translate-y-1"
          style={{
            background: color,
            border: '2px solid white',
            borderRadius: '50% 50% 50% 0',
            transform: 'rotate(-45deg)',
            boxShadow: `0 0 12px ${color}, 0 4px 12px rgba(0,0,0,0.4)`,
          }}
        >
          <span style={{ transform: 'rotate(45deg)', fontSize: 14 }}>{emoji}</span>
        </div>
      </div>
    </div>
  );
}

export default function MapExplorer() {
  const [activeCategory, setActiveCategory] = useState('tourism');
  const [search, setSearch] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);

  const filtered = useMemo(() =>
    places.filter(p =>
      p.category === activeCategory &&
      (search === '' || p.name.toLowerCase().includes(search.toLowerCase()))
    ), [activeCategory, search]);

  const activeCat = categories.find(c => c.id === activeCategory);
  const activeColor = activeCat?.color || '#4F46E5';

  return (
    <div className="relative w-full h-screen overflow-hidden" style={{ background: '#0D1035' }}>
      {/* Map background with grid */}
      <div className="absolute inset-0 grid-overlay opacity-30" />
      
      {/* Map pins */}
      <div className="absolute inset-0">
        {filtered.map(p => (
          <MapPin key={p.id} place={p} color={activeColor} onClick={() => setSelectedPlace(p)} />
        ))}
      </div>

      {/* Search bar */}
      <div className="absolute top-4 left-4 right-16 z-30">
        <div
          className="glass-pill flex items-center h-[52px] px-4 gap-3 transition-all duration-300"
          style={{
            border: searchFocused ? '1px solid #4F46E5' : '1px solid rgba(79,70,229,0.3)',
            boxShadow: searchFocused ? '0 0 0 3px rgba(79,70,229,0.2), 0 0 30px rgba(79,70,229,0.3)' : 'none',
          }}
        >
          <Search size={18} className="text-primary flex-shrink-0" />
          <input
            type="text"
            placeholder="Search places, services in Buxar..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <AnimatePresence>
            {search && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                onClick={() => setSearch('')}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Near me button */}
      <button
        className="absolute top-4 right-4 z-30 w-[52px] h-[52px] rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #4F46E5, #06B6D4)',
          boxShadow: '0 0 20px rgba(79,70,229,0.5)',
        }}
      >
        <Crosshair size={20} className="text-foreground" />
      </button>

      {/* Category pills */}
      <div className="absolute top-[72px] left-0 right-0 z-25 px-4">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar py-2">
          {categories.map(cat => {
            const isActive = cat.id === activeCategory;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="relative flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-medium transition-all duration-250 cursor-pointer select-none"
                style={{
                  background: isActive ? `${cat.color}33` : 'rgba(15,15,46,0.8)',
                  border: isActive ? `1px solid ${cat.color}99` : '1px solid rgba(255,255,255,0.1)',
                  color: isActive ? cat.color : '#94A3B8',
                  fontWeight: isActive ? 600 : 500,
                  boxShadow: isActive ? `0 0 16px ${cat.color}4D` : 'none',
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                  backdropFilter: 'blur(12px)',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Place cards row */}
      <div className="absolute bottom-24 left-0 right-0 z-20 px-4">
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2" style={{ scrollSnapType: 'x mandatory' }}>
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <PlaceCard key={p.id} place={p} index={i} onClick={setSelectedPlace} />
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <div className="glass flex items-center justify-center w-full py-8 text-muted-foreground text-sm">
              No places found
            </div>
          )}
        </div>
      </div>

      <BottomSheet place={selectedPlace} onClose={() => setSelectedPlace(null)} />
    </div>
  );
}

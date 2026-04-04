import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, MapPin, Star, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { categories, type Place } from '@/data/places';
import { fetchServices } from '@/data/services';
import BottomSheet from '@/components/BottomSheet';

const filters = [
  { id: 'all', label: 'All', color: '#4F46E5' },
  ...categories,
];

function SkeletonCard() {
  return (
    <div className="glass overflow-hidden" style={{ minHeight: 300 }}>
      <div className="h-[140px] bg-foreground/5 animate-shimmer" />
      <div className="p-3.5 space-y-3">
        <div className="h-4 w-3/4 rounded bg-foreground/5 animate-shimmer" />
        <div className="h-3 w-1/2 rounded bg-foreground/5 animate-shimmer" />
        <div className="h-3 w-1/3 rounded bg-foreground/5 animate-shimmer" />
        <div className="h-10 rounded-xl bg-foreground/5 animate-shimmer" />
      </div>
    </div>
  );
}

function ServiceCard({ place, index, onClick }: { place: Place; index: number; onClick: (p: Place) => void }) {
  const cat = categories.find(c => c.id === place.category);
  const color = cat?.color || '#4F46E5';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5, type: 'spring', damping: 20, stiffness: 300 }}
      className="glass card-hover overflow-hidden cursor-pointer"
      style={{ minHeight: 300 }}
      onClick={() => onClick(place)}
    >
      {/* Photo */}
      <div className="relative h-[140px] overflow-hidden" style={{ background: `linear-gradient(135deg, ${color}33, #0F0F2E)` }}>
        {place.image ? (
          <img
            src={place.image}
            alt={place.name}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F2E] to-transparent" />
        <div
          className="absolute top-3 left-3 w-9 h-9 rounded-full flex items-center justify-center text-sm"
          style={{ background: color }}
        >
          {cat?.label.split(' ')[0]}
        </div>
      </div>

      {/* Info */}
      <div className="p-3.5">
        <h3 className="text-[15px] font-semibold text-foreground line-clamp-2">{place.name}</h3>
        <span className="text-micro mt-1 block" style={{ color, letterSpacing: '0.08em' }}>
          {cat?.label.split(' ').slice(1).join(' ') || place.category}
        </span>
        <div className="flex items-center gap-1 mt-2">
          <Star size={13} fill="#FBBF24" color="#FBBF24" />
          <span className="text-[13px] font-bold text-gold">{place.rating}</span>
          <span className="text-xs text-muted-foreground">({place.reviews})</span>
        </div>
        <div className="flex items-center gap-1 mt-1 text-muted-foreground">
          <MapPin size={12} />
          <span className="text-[13px]">2.3 km away</span>
        </div>
        <div className="h-[1px] bg-foreground/[0.07] my-3" />
        <button
          className="w-full h-10 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all hover:-translate-y-0.5"
          style={{
            background: `${color}26`,
            border: `1px solid ${color}66`,
            color,
          }}
        >
          <Phone size={14} /> Contact
        </button>
      </div>
    </motion.div>
  );
}

export default function Services() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsFetching(true);
      const data = await fetchServices();
      if (isMounted) {
        setPlaces(data);
        setIsFetching(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return places;
    return places.filter(p => p.category === activeFilter);
  }, [activeFilter, places]);

  const handleFilterChange = (id: string) => {
    setActiveFilter(id);
    setIsFiltering(true);
    setTimeout(() => setIsFiltering(false), 300);
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: '#07071A' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-30 flex items-center gap-3 h-[72px] px-4"
        style={{
          background: 'rgba(7,7,26,0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <button onClick={() => navigate(-1)} className="text-foreground cursor-pointer">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-[22px] font-bold text-foreground">Local Services</h1>
          <p className="text-[13px] text-muted-foreground">Buxar, Bihar</p>
        </div>
      </div>

      {/* Filter chips */}
      <div className="sticky top-[72px] z-20 px-4 py-3" style={{ background: 'rgba(7,7,26,0.85)', backdropFilter: 'blur(20px)' }}>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {filters.map(f => {
            const isActive = f.id === activeFilter;
            return (
              <button
                key={f.id}
                onClick={() => handleFilterChange(f.id)}
                className="flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-medium cursor-pointer select-none transition-all"
                style={{
                  background: isActive
                    ? f.id === 'all' ? 'linear-gradient(135deg, #4F46E5, #A78BFA)' : `${f.color}33`
                    : 'rgba(15,15,46,0.8)',
                  border: isActive ? `1px solid ${f.color}99` : '1px solid rgba(255,255,255,0.1)',
                  color: isActive ? (f.id === 'all' ? 'white' : f.color) : '#94A3B8',
                  backdropFilter: 'blur(12px)',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="px-4 mt-2">
        {isFetching || isFiltering ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass rounded-2xl p-6 text-center text-muted-foreground">
            No services found for this filter yet.
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <motion.div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
              {filtered.map((p, i) => (
                <ServiceCard key={p.id} place={p} index={i} onClick={setSelectedPlace} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <BottomSheet place={selectedPlace} onClose={() => setSelectedPlace(null)} />
    </div>
  );
}

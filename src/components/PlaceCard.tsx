import { Star, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Place } from '@/data/places';
import { categories } from '@/data/places';

interface Props {
  place: Place;
  index: number;
  onClick: (place: Place) => void;
}

export default function PlaceCard({ place, index, onClick }: Props) {
  const cat = categories.find(c => c.id === place.category);
  const color = cat?.color || '#4F46E5';

  return (
    <motion.div
      custom={index}
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.07, duration: 0.5, type: 'spring', damping: 20, stiffness: 300 }}
      onClick={() => onClick(place)}
      className="glass card-hover cursor-pointer flex-shrink-0 w-[200px] overflow-hidden"
      style={{ height: 260 }}
    >
      {/* Photo area */}
      <div className="relative h-[120px] overflow-hidden" style={{ background: `linear-gradient(135deg, ${color}33, #0F0F2E)` }}>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F2E] to-transparent" />
        <span
          className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold"
          style={{ background: color, color: 'white' }}
        >
          {cat?.label.split(' ')[0]}
        </span>
        <span
          className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-medium"
          style={{ background: place.isOpen ? '#22c55e33' : '#ef444433', color: place.isOpen ? '#22c55e' : '#ef4444' }}
        >
          {place.isOpen ? 'Open' : 'Closed'}
        </span>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5">
        <h3 className="text-sm font-semibold text-foreground truncate">{place.name}</h3>
        <div className="flex items-center gap-1 text-muted-foreground">
          <MapPin size={10} style={{ color }} />
          <span className="text-xs truncate">{place.address}</span>
        </div>
        <div className="h-[1px] bg-foreground/[0.07] my-1" />
        <div className="flex items-center gap-1">
          <Star size={12} fill="#FBBF24" color="#FBBF24" />
          <span className="text-xs font-bold text-gold">{place.rating}</span>
          <span className="text-xs text-muted-foreground">({place.reviews})</span>
        </div>
        <button
          className="mt-1 w-full text-[11px] font-semibold py-1.5 rounded-lg transition-all"
          style={{ background: `${color}22`, border: `1px solid ${color}55`, color }}
        >
          → View on Map
        </button>
      </div>
    </motion.div>
  );
}

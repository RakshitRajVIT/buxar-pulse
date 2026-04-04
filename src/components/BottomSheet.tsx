import { X, Navigation, Phone, Share2, Star, MapPin, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Place } from '@/data/places';
import { categories } from '@/data/places';

interface Props {
  place: Place | null;
  onClose: () => void;
}

export default function BottomSheet({ place, onClose }: Props) {
  if (!place) return null;
  const cat = categories.find(c => c.id === place.category);
  const color = cat?.color || '#4F46E5';

  return (
    <AnimatePresence>
      {place && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.1}
            onDragEnd={(_, info) => { if (info.offset.y > 80) onClose(); }}
            className="fixed bottom-0 left-0 right-0 z-50 overflow-y-auto"
            style={{
              maxHeight: '82vh',
              borderRadius: '28px 28px 0 0',
              background: 'rgba(10,10,30,0.95)',
              backdropFilter: 'blur(20px) saturate(180%)',
              borderTop: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }} />
            </div>

            {/* Hero photo area */}
            <div
              className="relative mx-4 h-[200px] rounded-2xl overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${color}44, #0F0F2E)` }}
            >
              {place.image ? (
                <img
                  src={place.image}
                  alt={place.name}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1e] to-transparent" />
              <button
                onClick={onClose}
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(0,0,0,0.6)' }}
              >
                <X size={16} className="text-foreground" />
              </button>
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ background: color, boxShadow: `0 0 8px ${color}` }}
              />
            </div>

            {/* Place info */}
            <div className="px-4 pt-4">
              <h2 className="text-[22px] font-bold text-foreground">{place.name}</h2>
              <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
                <MapPin size={12} style={{ color }} />
                <span className="text-sm">{place.address}</span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={14} fill={s <= Math.floor(place.rating) ? '#FBBF24' : 'none'} color="#FBBF24" />
                ))}
                <span className="text-sm font-bold text-gold">{place.rating}</span>
                <span className="text-xs text-muted-foreground">({place.reviews} reviews)</span>
                <span className="text-muted-foreground">·</span>
                <Clock size={12} className="text-muted-foreground" />
                <span className={`text-xs ${place.isOpen ? 'text-green-400' : 'text-red-400'}`}>
                  {place.isOpen ? 'Open Now' : 'Closed'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-3 gap-2.5 px-4 mt-4">
              {[
                { icon: Navigation, label: 'Directions', c: '#4F46E5' },
                { icon: Phone, label: 'Call', c: '#06B6D4' },
                { icon: Share2, label: 'Share', c: '#EC4899' },
              ].map(a => (
                <button
                  key={a.label}
                  className="glass flex flex-col items-center gap-1.5 py-3 transition-colors hover:bg-foreground/[0.06]"
                  style={{ borderRadius: 14 }}
                >
                  <a.icon size={18} style={{ color: a.c }} />
                  <span className="text-xs text-muted-foreground">{a.label}</span>
                </button>
              ))}
            </div>

            {/* Google Maps button */}
            <div className="px-4 pb-8 mt-4">
              <a
                href={place.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-neon flex items-center justify-center w-full h-[52px] rounded-[14px] text-[15px] font-bold"
              >
                Open in Google Maps
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

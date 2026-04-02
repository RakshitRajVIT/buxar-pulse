import { useEffect, useRef, useState } from 'react';

const stats = [
  { target: 24, suffix: '+', label: 'Tourist Spots', color: '#4F46E5' },
  { target: 200, suffix: '+', label: 'Local Services', color: '#06B6D4' },
  { target: 8, suffix: 'km', label: 'Along the Ganges', color: '#A78BFA' },
  { target: 300, suffix: '+', label: 'Years of History', color: '#EC4899' },
];

function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function Counter({ target, suffix, color, animate }: { target: number; suffix: string; color: string; animate: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!animate) return;
    const duration = 2000;
    const start = performance.now();
    
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(easeOutExpo(progress) * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    
    requestAnimationFrame(tick);
  }, [animate, target]);

  return (
    <span className="text-4xl font-black" style={{ color, textShadow: `0 0 20px ${color}99` }}>
      {count}{suffix}
    </span>
  );
}

export default function StatsBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute bottom-0 left-0 right-0 z-10 glass" style={{ borderRadius: '20px 20px 0 0' }}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="flex flex-col items-center justify-center py-6 px-4"
            style={{ borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
          >
            <Counter target={s.target} suffix={s.suffix} color={s.color} animate={visible} />
            <span className="text-micro text-muted-foreground mt-2">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

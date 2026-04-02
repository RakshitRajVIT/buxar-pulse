import { useNavigate } from 'react-router-dom';
import ParticleCanvas from './ParticleCanvas';
import StatsBanner from './StatsBanner';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      <ParticleCanvas />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 z-[1] grid-overlay pointer-events-none" />
      
      {/* Vignette */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 30%, #07071A 100%)' }}
      />

      {/* Hero content */}
      <div className="relative z-[5] flex flex-col items-center text-center px-4">
        {/* Badge */}
        <div
          className="glass-pill px-5 py-1.5 mb-8"
          style={{
            border: '1px solid rgba(79,70,229,0.4)',
            background: 'rgba(79,70,229,0.1)',
            color: '#A78BFA',
            fontSize: 11,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            animation: 'fadeInDown 0.6s ease both 0.5s',
          }}
        >
          🌊&nbsp; BUXAR, BIHAR &nbsp;·&nbsp; EST. 1539
        </div>

        {/* Title */}
        <div style={{ animation: 'fadeInUp 0.8s ease 0.2s both' }}>
          <h1 className="text-7xl md:text-[96px] font-black leading-[0.85] tracking-tighter text-foreground">
            MY
          </h1>
          <h1 className="text-7xl md:text-[96px] font-black leading-[0.85] tracking-[-4px] gradient-text">
            BUXAR
          </h1>
        </div>

        {/* Tagline */}
        <p
          className="mt-6 text-lg md:text-xl max-w-[480px]"
          style={{ color: '#94A3B8', animation: 'fadeInUp 0.8s ease 0.4s both' }}
        >
          Explore. Discover. Connect — in real time.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 mt-10"
          style={{ animation: 'fadeInUp 0.8s ease 0.6s both' }}
        >
          <button
            onClick={() => navigate('/map')}
            className="btn-neon px-9 py-4 rounded-[14px] text-base font-bold"
          >
            Open Live Map
          </button>
          <button
            onClick={() => navigate('/services')}
            className="btn-ghost px-9 py-4 rounded-[14px] text-base font-bold"
          >
            Find Services
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-32 md:bottom-28 left-1/2 -translate-x-1/2 z-[5] flex flex-col items-center animate-gentle-bounce"
        style={{ animation: 'fadeInUp 0.5s ease 1.5s both, gentleBounce 2s ease-in-out infinite 2s' }}
      >
        <span className="text-[10px] uppercase tracking-[0.15em] text-primary mb-2">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-primary to-transparent animate-draw-line" />
      </div>

      <StatsBanner />
    </section>
  );
}

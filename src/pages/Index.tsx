import HeroSection from '@/components/HeroSection';
import BottomNav from '@/components/BottomNav';

export default function Index() {
  return (
    <div className="min-h-screen" style={{ background: '#07071A' }}>
      <HeroSection />
      <BottomNav />
    </div>
  );
}

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 1500;

function Particles() {
  const meshRef = useRef<THREE.Points>(null);
  
  const { positions, colors, velocities } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 2);
    
    const cyan = new THREE.Color('#06B6D4');
    const indigo = new THREE.Color('#4F46E5');
    const purple = new THREE.Color('#A78BFA');
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      
      const r = Math.random();
      const color = r < 0.7 ? cyan : r < 0.9 ? indigo : purple;
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      velocities[i * 2] = (Math.random() - 0.6) * 0.003;
      velocities[i * 2 + 1] = -(Math.random() * 0.004 + 0.004);
    }
    
    return { positions, colors, velocities };
  }, []);
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const pos = meshRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3] += velocities[i * 2];
      pos[i * 3 + 1] += velocities[i * 2 + 1];
      
      if (pos[i * 3 + 1] < -5) {
        pos[i * 3 + 1] = 5;
        pos[i * 3] = (Math.random() - 0.5) * 10;
      }
    }
    
    meshRef.current.geometry.attributes.position.needsUpdate = true;
    
    const t = clock.getElapsedTime();
    meshRef.current.rotation.y = Math.sin(t * 0.05) * 0.1;
  });
  
  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={PARTICLE_COUNT} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={1.5}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

export default function ParticleCanvas() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }} dpr={[1, 1.5]}>
        <Particles />
      </Canvas>
    </div>
  );
}

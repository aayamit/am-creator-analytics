/**
 * 3D Creator Scene (AR/VR)
 * React Three Fiber scene for creator portfolio
 * Bloomberg × McKinsey design
 */

'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Box } from '@react-three/drei';
import { Suspense } from 'react';

interface CreatorSceneProps {
  creator: {
    name: string;
    followerCount: number;
    engagementRate: number;
    niche: string;
  };
}

function SceneContent({ creator }: CreatorSceneProps) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      {/* Creator's 3D Avatar (sphere) */}
      <Sphere args={[1, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#92400e" />
      </Sphere>
      
      {/* Stats floating around */}
      <Text
        position={[-2, 1.5, 0]}
        fontSize={0.3}
        color="#1a1a2e"
      >
        {`Followers: ${creator.followerCount?.toLocaleString() || '0'}`}
      </Text>
      
      <Text
        position={[-2, 1, 0]}
        fontSize={0.3}
        color="#92400e"
      >
        {`Engagement: ${(creator.engagementRate * 100).toFixed(1)}%`}
      </Text>
      
      <Text
        position={[-2, 0.5, 0]}
        fontSize={0.3}
        color="#16a34a"
      >
        {`Niche: ${creator.niche || 'General'}`}
      </Text>
      
      {/* Decorative boxes around */}
      <Box position={[2, 0.5, 0]} args={[0.5, 0.5, 0.5]}>
        <meshStandardMaterial color="#F8F7F4" />
      </Box>
      
      <OrbitControls enableZoom enablePan enableRotate />
    </>
  );
}

export default function CreatorScene(props: CreatorSceneProps) {
  return (
    <Canvas
      style={{
        width: '100%',
        height: '500px',
        backgroundColor: '#F8F7F4',
        borderRadius: '8px',
      }}
      camera={{ position: [0, 0, 5], fov: 50 }}
    >
      <Suspense fallback={null}>
        <SceneContent {...props} />
      </Suspense>
    </Canvas>
  );
}

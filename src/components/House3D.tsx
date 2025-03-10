
import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const HouseModel = ({ mousePosition }) => {
  // Properly type the refs
  const house = useRef<THREE.Group>(null);
  const roof = useRef<THREE.Group>(null);
  
  // Follow mouse with gentle easing
  useFrame(() => {
    if (house.current && mousePosition) {
      house.current.rotation.y = THREE.MathUtils.lerp(
        house.current.rotation.y,
        (mousePosition.x * Math.PI) / 8,
        0.05
      );
      house.current.rotation.x = THREE.MathUtils.lerp(
        house.current.rotation.x,
        (-mousePosition.y * Math.PI) / 8,
        0.05
      );
      
      if (roof.current) {
        roof.current.rotation.y = THREE.MathUtils.lerp(
          roof.current.rotation.y,
          (mousePosition.x * Math.PI) / 16,
          0.02
        );
      }
    }
  });

  return (
    <group ref={house} position={[0, -0.5, 0]} rotation={[0, 0, 0]}>
      {/* Main house structure */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 2, 2]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      
      {/* Roof structure */}
      <group ref={roof} position={[0, 1.5, 0]}>
        <mesh castShadow>
          <coneGeometry args={[2.25, 1.5, 4]} />
          <meshStandardMaterial color="#9b87f5" />
        </mesh>
        
        {/* Roof details */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <coneGeometry args={[1.9, 0.5, 4]} />
          <meshStandardMaterial color="#7E69AB" />
        </mesh>
      </group>
      
      {/* Front facade with texture */}
      <mesh position={[0, 0, 1.01]} castShadow>
        <planeGeometry args={[3, 2]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      
      {/* Door with wood texture */}
      <mesh position={[0, -0.5, 1.02]} castShadow>
        <boxGeometry args={[0.8, 1, 0.05]} />
        <meshStandardMaterial color="#a67c52" />
      </mesh>
      
      {/* Door details */}
      <mesh position={[0, -0.5, 1.03]} castShadow>
        <boxGeometry args={[0.7, 0.9, 0.01]} />
        <meshStandardMaterial color="#8B5A2B" />
      </mesh>
      
      {/* Door handle */}
      <mesh position={[0.3, -0.5, 1.08]} castShadow>
        <sphereGeometry args={[0.06]} />
        <meshStandardMaterial color="#ffd700" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Windows */}
      <mesh position={[-1, 0, 1.02]} castShadow>
        <boxGeometry args={[0.6, 0.6, 0.05]} />
        <meshStandardMaterial color="#a8d5ff" transparent opacity={0.9} />
      </mesh>
      <mesh position={[1, 0, 1.02]} castShadow>
        <boxGeometry args={[0.6, 0.6, 0.05]} />
        <meshStandardMaterial color="#a8d5ff" transparent opacity={0.9} />
      </mesh>
      
      {/* Window frames */}
      <mesh position={[-1, 0, 1.03]}>
        <boxGeometry args={[0.7, 0.7, 0.01]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[1, 0, 1.03]}>
        <boxGeometry args={[0.7, 0.7, 0.01]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Window crossbars */}
      <mesh position={[-1, 0, 1.04]}>
        <boxGeometry args={[0.04, 0.7, 0.01]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-1, 0, 1.04]}>
        <boxGeometry args={[0.7, 0.04, 0.01]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[1, 0, 1.04]}>
        <boxGeometry args={[0.04, 0.7, 0.01]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[1, 0, 1.04]}>
        <boxGeometry args={[0.7, 0.04, 0.01]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Chimney */}
      <mesh position={[-0.8, 1.5, -0.5]} castShadow>
        <boxGeometry args={[0.4, 1, 0.4]} />
        <meshStandardMaterial color="#d4d4d8" />
      </mesh>
      
      {/* Smoke particles */}
      <group position={[-0.8, 2.1, -0.5]}>
        <mesh position={[0, 0, 0]} castShadow>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color="#f5f5f5" transparent opacity={0.6} />
        </mesh>
        <mesh position={[0, 0.25, 0]} castShadow>
          <sphereGeometry args={[0.12, 8, 8]} />
          <meshStandardMaterial color="#f5f5f5" transparent opacity={0.5} />
        </mesh>
        <mesh position={[0, 0.45, 0]} castShadow>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#f5f5f5" transparent opacity={0.4} />
        </mesh>
      </group>
      
      {/* Garden base */}
      <mesh position={[0, -1.05, 0]} receiveShadow>
        <boxGeometry args={[6, 0.1, 4]} />
        <meshStandardMaterial color="#4ade80" />
      </mesh>
      
      {/* Path to house */}
      <mesh position={[0, -1, 1.5]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1, 1.5]} />
        <meshStandardMaterial color="#e5e7eb" />
      </mesh>
      
      {/* Decorative elements - Bushes */}
      <mesh position={[-1.5, -0.6, 0.8]} castShadow>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial color="#16a34a" />
      </mesh>
      <mesh position={[1.5, -0.6, 0.8]} castShadow>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshStandardMaterial color="#16a34a" />
      </mesh>
      
      {/* Flower bed */}
      <mesh position={[-1.8, -0.95, -0.2]} castShadow>
        <boxGeometry args={[1, 0.1, 0.8]} />
        <meshStandardMaterial color="#854d0e" />
      </mesh>
      
      {/* Flowers */}
      <group position={[-1.8, -0.8, -0.2]}>
        <mesh position={[-0.2, 0, 0]} castShadow>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#f472b6" />
        </mesh>
        <mesh position={[0, 0, 0.2]} castShadow>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#fb923c" />
        </mesh>
        <mesh position={[0.2, 0, -0.1]} castShadow>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#60a5fa" />
        </mesh>
      </group>
      
      {/* Fence */}
      <group position={[0, -0.7, 2]}>
        {/* Left fence */}
        <mesh position={[-1.2, -0.3, 0]} castShadow>
          <boxGeometry args={[1.5, 0.5, 0.05]} />
          <meshStandardMaterial color="#f5f5f4" />
        </mesh>
        
        {/* Right fence */}
        <mesh position={[1.2, -0.3, 0]} castShadow>
          <boxGeometry args={[1.5, 0.5, 0.05]} />
          <meshStandardMaterial color="#f5f5f4" />
        </mesh>
        
        {/* Fence posts */}
        <mesh position={[-2, -0.3, 0]} castShadow>
          <boxGeometry args={[0.1, 0.6, 0.1]} />
          <meshStandardMaterial color="#d6d3d1" />
        </mesh>
        <mesh position={[-0.4, -0.3, 0]} castShadow>
          <boxGeometry args={[0.1, 0.6, 0.1]} />
          <meshStandardMaterial color="#d6d3d1" />
        </mesh>
        <mesh position={[0.4, -0.3, 0]} castShadow>
          <boxGeometry args={[0.1, 0.6, 0.1]} />
          <meshStandardMaterial color="#d6d3d1" />
        </mesh>
        <mesh position={[2, -0.3, 0]} castShadow>
          <boxGeometry args={[0.1, 0.6, 0.1]} />
          <meshStandardMaterial color="#d6d3d1" />
        </mesh>
      </group>
    </group>
  );
};

const House3D = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (event) => {
      // Normalize mouse position
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-lg">
      <Canvas shadows camera={{ position: [0, 0, 6], fov: 40 }}>
        <color attach="background" args={['#f8fafc']} />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 10]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <HouseModel mousePosition={mousePosition} />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          enableRotate={false}
        />
        <fog attach="fog" args={['#f8fafc', 10, 20]} />
      </Canvas>
    </div>
  );
};

export default House3D;

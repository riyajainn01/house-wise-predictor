
import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const HouseModel = ({ mousePosition }) => {
  // Properly type the refs as THREE.Group and THREE.Mesh
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
      {/* House base */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 2, 2]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      
      {/* Roof */}
      <group ref={roof} position={[0, 1.5, 0]}>
        <mesh castShadow>
          <coneGeometry args={[2.25, 1.5, 4]} />
          <meshStandardMaterial color="#8b5cf6" />
        </mesh>
        
        {/* Roof details */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <coneGeometry args={[1.9, 0.5, 4]} />
          <meshStandardMaterial color="#7c3aed" />
        </mesh>
      </group>
      
      {/* Front facade */}
      <mesh position={[0, 0, 1.01]} castShadow>
        <planeGeometry args={[3, 2]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>
      
      {/* Door */}
      <mesh position={[0, -0.5, 1.02]} castShadow>
        <boxGeometry args={[0.8, 1, 0.05]} />
        <meshStandardMaterial color="#8b5a2b" />
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
      
      {/* Chimney */}
      <mesh position={[-0.8, 1.5, -0.5]} castShadow>
        <boxGeometry args={[0.4, 1, 0.4]} />
        <meshStandardMaterial color="#c0c0c0" />
      </mesh>
      
      {/* Garden base */}
      <mesh position={[0, -1.05, 0]} receiveShadow>
        <boxGeometry args={[5, 0.1, 3]} />
        <meshStandardMaterial color="#4ade80" />
      </mesh>
      
      {/* Path to house */}
      <mesh position={[0, -1, 1.2]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1, 1.2]} />
        <meshStandardMaterial color="#d4d4d8" />
      </mesh>
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
      </Canvas>
    </div>
  );
};

export default House3D;

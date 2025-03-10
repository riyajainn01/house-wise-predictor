
import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const HouseModel = ({ mousePosition }) => {
  const house = useRef();
  const roof = useRef();
  
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
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      
      {/* Roof */}
      <group ref={roof} position={[0, 1.5, 0]}>
        <mesh castShadow>
          <coneGeometry args={[2.25, 1.5, 4]} />
          <meshStandardMaterial color="#8b5cf6" />
        </mesh>
      </group>
      
      {/* Door */}
      <mesh position={[0, -0.5, 1.01]} castShadow>
        <boxGeometry args={[0.8, 1, 0.1]} />
        <meshStandardMaterial color="#5f4b32" />
      </mesh>
      
      {/* Windows */}
      <mesh position={[-1, 0, 1.01]} castShadow>
        <boxGeometry args={[0.6, 0.6, 0.1]} />
        <meshStandardMaterial color="#a8d5ff" />
      </mesh>
      <mesh position={[1, 0, 1.01]} castShadow>
        <boxGeometry args={[0.6, 0.6, 0.1]} />
        <meshStandardMaterial color="#a8d5ff" />
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

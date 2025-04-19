import React, { useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, PerspectiveCamera, Center } from '@react-three/drei';
import { Mesh } from 'three';

interface ModelViewerProps {
  modelUrl: string;
}

// Model component that actually loads and displays the 3D model
function Model({ url }: { url: string }) {
  const gltf = useGLTF(url);
  
  return (
    <Center>
      <primitive 
        object={gltf.scene} 
        scale={1.5} 
        position={[0, 0, 0]} 
        rotation={[0, 0, 0]}
        castShadow
        receiveShadow
      />
    </Center>
  );
}

const ModelViewer: React.FC<ModelViewerProps> = ({ modelUrl }) => {
  return (
    <div className="w-full h-full">
      <Canvas shadows dpr={[1, 2]}>
        <color attach="background" args={['#1f2937']} />
        
        <Suspense fallback={<LoadingFallback />}>
          <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />
          <ambientLight intensity={0.5} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={1}
            castShadow
          />
          <Model url={modelUrl} />
          <Environment preset="city" />
          <OrbitControls 
            enablePan={true} 
            enableZoom={true} 
            enableRotate={true}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
      
      <div className="absolute left-3 bottom-3 text-xs text-gray-400 bg-gray-800/70 px-2 py-1 rounded">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  );
};

// Fallback component while the model is loading
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#4B5563" wireframe />
    </mesh>
  );
}

export default ModelViewer;
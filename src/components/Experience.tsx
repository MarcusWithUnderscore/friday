import {
  ContactShadows,
  Environment,
  OrbitControls,
  Sky,
} from "@react-three/drei";
import { Avatar } from "./Model";
import { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";

export const Experience = () => {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();

  useEffect(() => {
    const handleZoom = (event: any) => {
      if (controlsRef.current) {
        const direction = camera.position.clone().normalize();
        camera.position.addScaledVector(direction, event.detail.zoom);
        controlsRef.current.update();
      }
    };

    window.addEventListener('avatarZoom', handleZoom);
    return () => window.removeEventListener('avatarZoom', handleZoom);
  }, [camera]);

  return (
    <>
      <OrbitControls 
        ref={controlsRef}
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        minDistance={2}
        maxDistance={10}
      />
      <Sky />
      <Environment preset="sunset" />
      <group position-y={-1}>
        <ContactShadows
          opacity={0.42}
          scale={10}
          blur={1}
          far={10}
          resolution={256}
          color="#000000"
        />
        <Avatar animation="Idle" rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} />
        <mesh scale={5} rotation-x={-Math.PI * 0.5} position-y={-0.001}>
          <planeGeometry />
          <meshStandardMaterial color="white" />
        </mesh>
      </group>
    </>
  );
};
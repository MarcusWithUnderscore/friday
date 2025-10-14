import { OrbitControls } from "@react-three/drei";

export const Experience: React.FC = () => {
  return (
    <>
      <OrbitControls />
      <mesh>
        <boxGeometry />
        <meshNormalMaterial />
      </mesh>
    </>
  );
};
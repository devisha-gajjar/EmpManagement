// components/3d/Card3D.tsx
import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { Mesh } from "three";

interface Card3DProps {
  position: [number, number, number];
  title: string;
  content: string[];
}

export default function Card3D({ position, title, content }: Card3DProps) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Slight rotation animation
  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y += 0.002;
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Card shape */}
      <boxGeometry args={[4, 2.5, 0.2]} />
      <meshStandardMaterial color={hovered ? "#6b21a8" : "#4f46e5"} />

      {/* Card title */}
      <Text
        position={[0, 0.8, 0.15]}
        fontSize={0.3}
        color="#fff"
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>

      {/* Card content */}
      {content.map((line, i) => (
        <Text
          key={i}
          position={[0, 0.5 - i * 0.3, 0.15]}
          fontSize={0.2}
          color="#fff"
          anchorX="center"
          anchorY="middle"
        >
          {line}
        </Text>
      ))}
    </mesh>
  );
}

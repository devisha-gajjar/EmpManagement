// components/3d/Dashboard3D.tsx
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import Card3D from "./Card3D";

interface Dashboard3DProps {
  dashboard: any;
}

export default function Dashboard3D({ dashboard }: Dashboard3DProps) {
  if (!dashboard) return null;

  const cardsData = [
    {
      title: "Employee Info",
      content: [
        `Name: ${dashboard.fullName}`,
        `Position: ${dashboard.position}`,
        `Start: ${new Date(
          dashboard.employmentStartDate
        ).toLocaleDateString()}`,
        `DOB: ${new Date(dashboard.dateOfBirth).toLocaleDateString()}`,
      ],
      position: [-6, 0, 0],
    },
    {
      title: "Tasks",
      content: [
        `Total: ${dashboard.totalTasksAssigned}`,
        `Pending: ${dashboard.pendingTasks}`,
        `Completed: ${dashboard.completedTasks}`,
      ],
      position: [0, 0, 0],
    },
    {
      title: "Leave Info",
      content: [
        `Total: ${dashboard.totalLeaveDays}`,
        `Present: ${dashboard.totalPresentDays}`,
        `Absent: ${dashboard.totalAbsentDays}`,
      ],
      position: [6, 0, 0],
    },
    {
      title: "Department",
      content: [
        `Dept: ${dashboard.department.departmentName}`,
        `Manager: ${dashboard.department.managerName}`,
      ],
      position: [0, -4, 0],
    },
  ];

  return (
    <Canvas
      camera={{ position: [0, 0, 15], fov: 50 }}
      style={{ width: "100%", height: "80vh" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 10]} intensity={1} />

      <Environment preset="sunset" />

      {cardsData.map((card, i) => (
        <Card3D
          key={i}
          title={card.title}
          content={card.content}
          position={card.position as [number, number, number]}
        />
      ))}

      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
    </Canvas>
  );
}

import { useParams } from "react-router-dom";
import { useState } from "react";
import { Button, Col, Row } from "reactstrap";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";

import { tasksMock, projectMock } from "../configs/project-mgmt.config";
import { getProjectDetailsCardConfigs } from "../configs/project-details.config";
import PageHeader from "../../../../components/shared/page-header/PageHeader";
import CardComponent from "../../../../components/shared/card/Card";

import "../styles/ProjectDetails.css";
import TaskDetails from "./TaskDetails";

const statusColumns = [
  "Pending",
  "In Progress",
  "Dev Completed",
  "Ready for Testing",
  "Completed",
];

const ProjectDetails = () => {
  const { id } = useParams();

  const [tasks, setTasks] = useState(tasksMock);

  const completedCount = tasks.filter((t) => t.status === "Completed").length;

  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  const { timelineCardConfig, tasksCardConfig, progressCardConfig } =
    getProjectDetailsCardConfigs(
      projectMock,
      completedCount,
      tasks.length,
      progressPercent
    );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = Number(active.id);
    const newStatus = String(over.id);

    setTasks((prev) =>
      prev.map((task) =>
        task.task_id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  return (
    <>
      <div className="mb-3">
        <PageHeader
          showBackButton
          icon="folder"
          title={projectMock.project_name}
          subtitle={`${projectMock.status} • ${tasks.length} tasks`}
          theme="blue"
        />
      </div>
      {/* Header */}
      <Row className="mb-4 align-items-center bg-white m-1 rounded border p-3">
        <Col>
          <p className="text-muted mb-0">{projectMock.description}</p>
        </Col>
        <Col className="text-end">
          <Button color="primary">
            <i className="bi bi-plus-lg me-2"></i>
            Add Task
          </Button>
        </Col>
      </Row>

      {/* Stats */}
      <Row className="mb-4">
        <Col md={4}>
          <CardComponent cardConfig={timelineCardConfig} />
        </Col>
        <Col md={4}>
          <CardComponent cardConfig={tasksCardConfig} />
        </Col>
        <Col md={4}>
          <CardComponent cardConfig={progressCardConfig} />
        </Col>
      </Row>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="kanban-grid">
          {statusColumns.map((status) => (
            <TaskDetails
              key={status}
              status={status}
              tasks={tasks.filter((t) => t.status === status)}
            />
          ))}
        </div>
      </DndContext>
    </>
  );
};

export default ProjectDetails;

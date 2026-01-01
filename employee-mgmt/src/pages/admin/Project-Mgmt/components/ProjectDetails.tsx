import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Col, Row } from "reactstrap";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";

import { getProjectDetailsCardConfigs } from "../configs/project-details.config";
import PageHeader from "../../../../components/shared/page-header/PageHeader";
import CardComponent from "../../../../components/shared/card/Card";

import "../styles/ProjectDetails.css";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../../app/store";
import {
  fetchProjectById,
  // fetchProjectTasks,
  updateTaskStatus,
} from "../../../../features/admin/project-mgmt/projectDetailsApi";
import { useAppSelector } from "../../../../app/hooks";
import AddTaskForm from "./AddTaskForm";
import TaskDetails from "./TaskDetails";

const statusColumns = [
  "Pending",
  "In Progress",
  "Dev Completed",
  "Ready for Testing",
  "Completed",
];

const ProjectDetails = () => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const { id } = useParams();
  const projectId = Number(id);
  const dispatch = useDispatch<AppDispatch>();

  const { project, tasks, loading } = useAppSelector(
    (state) => state.projectDetails
  );

  console.log("project", project);
  useEffect(() => {
    dispatch(fetchProjectById(projectId));
  }, [projectId, dispatch]);

  if (loading || !project) {
    return <div className="text-center py-5">Loading project…</div>;
  }

  const completedCount = tasks.filter((t) => t.status === "Completed").length;

  const progressPercent = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as number;
    const newStatus = over.id as string;

    dispatch(updateTaskStatus({ taskId, status: newStatus }));
  };

  const { timelineCardConfig, tasksCardConfig, progressCardConfig } =
    getProjectDetailsCardConfigs(
      project,
      completedCount,
      tasks.length,
      progressPercent
    );

  return (
    <>
      <div className="mb-3">
        <PageHeader
          showBackButton
          icon="folder"
          title={project.projectName}
          subtitle={`${project.status} • ${tasks.length} tasks`}
          theme="blue"
        />
      </div>

      <Row className="mb-4 align-items-center bg-white m-1 rounded border p-3">
        <Col>
          <p className="text-muted mb-0">{project.description}</p>
        </Col>
        <Col className="text-end">
          <Button color="primary" onClick={() => setIsTaskModalOpen(true)}>
            <i className="bi bi-plus-lg me-2"></i>
            Add Task
          </Button>
        </Col>
      </Row>

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
              projectId={projectId}
            />
          ))}
        </div>
      </DndContext>

      <AddTaskForm
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        projectId={projectId}
      />
    </>
  );
};

export default ProjectDetails;

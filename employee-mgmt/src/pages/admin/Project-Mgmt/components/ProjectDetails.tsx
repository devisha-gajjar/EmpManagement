import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Col, Row } from "reactstrap";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { useDispatch } from "react-redux";
import { useTheme } from "@mui/material";

import PageHeader from "../../../../components/shared/page-header/PageHeader";
import CardComponent from "../../../../components/shared/card/Card";

import TextSkeleton from "../../../../components/shared/loader/SkeletonLoader/TextSkeleton";
import CardSkeleton from "../../../../components/shared/loader/SkeletonLoader/CardSkeleton";

import { getProjectDetailsCardConfigs } from "../configs/project-details.config";
import AddTaskForm from "./AddTaskForm";
import TaskDetails from "./TaskDetails";

import type { AppDispatch } from "../../../../app/store";
import { useAppSelector } from "../../../../app/hooks";
import {
  fetchProjectById,
  updateTaskStatus,
} from "../../../../features/admin/project-mgmt/projectDetailsApi";

import "../styles/ProjectDetails.css";

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

  const muiTheme = useTheme();
  const isDark = muiTheme.palette.mode === "dark";
  const completedCount = tasks.filter((t) => t.status === "Completed").length;

  const progressPercent = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;

  useEffect(() => {
    if (projectId) {
      dispatch(fetchProjectById(projectId));
    }
  }, [projectId, dispatch]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as number;
    const newStatus = over.id as string;

    dispatch(updateTaskStatus({ taskId, status: newStatus }));
  };

  if (loading || !project) {
    return (
      <>
        <div className="mb-3">
          <TextSkeleton lines={2} />
        </div>

        <Row className="mb-4 p-3 border rounded">
          <Col md={9}>
            <TextSkeleton lines={2} />
          </Col>
          <Col md={3}>
            <CardSkeleton count={1} />
          </Col>
        </Row>

        <Row className="mb-4">
          <CardSkeleton count={3} />
        </Row>

        <div className="kanban-grid">
          {statusColumns.map((_, index) => (
            <div key={index} className="kanban-column">
              <TextSkeleton lines={1} />
              <CardSkeleton count={3} />
            </div>
          ))}
        </div>
      </>
    );
  }

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

      <Row
        className={`mb-4 align-items-center m-1 rounded border p-3 ${
          isDark ? "bg-dark text-light border-secondary" : "bg-white text-dark"
        }`}
      >
        <Col>
          <p className={`mb-0 ${isDark ? "text-white" : "text-muted"}`}>
            {project.description}
          </p>
        </Col>

        <Col className="text-end">
          <Button
            color={isDark ? "secondary" : "primary"}
            onClick={() => setIsTaskModalOpen(true)}
          >
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

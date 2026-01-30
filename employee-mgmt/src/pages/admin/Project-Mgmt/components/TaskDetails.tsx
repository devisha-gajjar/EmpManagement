import {
  Card,
  CardHeader,
  CardBody,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { useState } from "react";
import Tag from "../../../../components/shared/tag/Tag";
import { priorityTagConfig } from "../configs/project-details.config";
import type { ProjectTask } from "../../../../interfaces/project.interface";
import AddTaskForm from "./AddTaskForm";
import { formatDate } from "../../../../utils/dateUtil";
import { truncateText } from "../../../../utils/text.util";
import { useAppDispatch, useSnackbar } from "../../../../app/hooks";
import {
  fetchTaskById,
  deleteTask,
  fetchProjectById,
} from "../../../../features/admin/project-mgmt/projectDetailsApi";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";

interface DraggableTaskProps {
  task: ProjectTask;
  onEdit: (task: ProjectTask) => void;
  onDelete: (taskId: number) => void;
}

const DraggableTask = ({ task, onEdit, onDelete }: DraggableTaskProps) => {
  const muiTheme = useTheme();
  const isDark = muiTheme.palette.mode === "dark";

  const navigate = useNavigate();

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.taskId,
    });

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  const onEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onEdit(task);
  };

  const onDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    onDelete(task.taskId);
  };

  const handleOpenLogs = () => {
    navigate(
      `/admin/projects/${task.projectId}/tasks/${task.taskId}/work-logs`
    );
  };

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.6 : 1,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card
        className={`mb-3 card-container ${
          isDark ? "bg-dark text-light border-secondary" : "bg-white text-dark"
        }`}
      >
        <CardHeader className="d-flex justify-content-between align-items-center">
          <div
            {...listeners}
            className="d-flex align-items-center gap-2 cursor-grab"
          >
            <i className="bi bi-grip-vertical"></i>
            <Tag tagConfig={priorityTagConfig(task.priority)} />
          </div>

          <Dropdown isOpen={menuOpen} toggle={toggleMenu}>
            <DropdownToggle
              tag="span"
              className="cursor-pointer"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              <i className="bi bi-three-dots-vertical"></i>
            </DropdownToggle>

            <DropdownMenu
              end
              className={
                isDark ? "bg-body-secondary text-light border-secondary" : ""
              }
            >
              <DropdownItem onClick={onEditClick}>
                <i className="bi bi-pencil me-2"></i> Edit
              </DropdownItem>

              <DropdownItem className="text-danger" onClick={onDeleteClick}>
                <i className="bi bi-trash me-2"></i> Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </CardHeader>

        <CardBody onClick={handleOpenLogs} className="cursor-pointer">
          <h6>{task.taskName}</h6>
          <p className={`small ${isDark ? "text-light" : "text-muted"}`}>
            {task.description}
          </p>

          <div className="d-flex justify-content-between small">
            <span>{truncateText(task.assignedTo, 15)}</span>
            <span>Due: {formatDate(task.dueDate)}</span>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
interface Props {
  status: string;
  tasks: ProjectTask[];
  projectId: number;
}

const TaskDetails = ({ status, tasks, projectId }: Props) => {
  const { setNodeRef } = useDroppable({ id: status });
  const [editTask, setEditTask] = useState<ProjectTask | null>(null);
  const dispatch = useAppDispatch();
  const snackbar = useSnackbar();

  const handleEdit = async (task: ProjectTask) => {
    const result = await dispatch(fetchTaskById(task.taskId)).unwrap();
    setEditTask(result);
  };

  const handleDelete = async (taskId: number) => {
    try {
      await dispatch(deleteTask(taskId)).unwrap();
      await dispatch(fetchProjectById(projectId)).unwrap();

      snackbar.success("Task deleted successfully!");
    } catch (error) {
      snackbar.error("Failed to delete task : " + error);
    }
  };

  return (
    <>
      <div ref={setNodeRef} className="kanban-column">
        <h6 className="mb-3 d-flex align-items-center gap-2">
          {status}
          <Tag
            tagConfig={{
              id: `${status}-count`,
              label: String(tasks.length),
              type: "static",
              isSelected: false,
              hasBorder: false,
              backgroundColor: "light-purple",
              textColor: "purple",
            }}
          />
        </h6>

        {tasks.map((task) => (
          <DraggableTask
            key={task.taskId}
            task={task}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <AddTaskForm
        isOpen={Boolean(editTask)}
        onClose={() => setEditTask(null)}
        projectId={editTask?.projectId ?? 0}
        taskId={editTask?.taskId}
        task={editTask!}
      />
    </>
  );
};

export default TaskDetails;

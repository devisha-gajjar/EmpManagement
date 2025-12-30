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

interface DraggableTaskProps {
  task: ProjectTask;
  onEdit: (task: ProjectTask) => void;
  onDelete: (taskId: number) => void;
}

const DraggableTask = ({ task }: DraggableTaskProps) => {
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
    // onEdit(task);
  };

  const onDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    // onDelete(task.taskId);
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
      <Card className="mb-3 card-container">
        <CardHeader className="d-flex justify-content-between align-items-center">
          <Tag tagConfig={priorityTagConfig(task.priority)} />

          <Dropdown isOpen={menuOpen} toggle={toggleMenu}>
            <DropdownToggle
              tag="span"
              className="cursor-pointer"
              aria-expanded={menuOpen}
            >
              <i className="bi bi-three-dots-vertical"></i>
            </DropdownToggle>

            <DropdownMenu end>
              <DropdownItem onClick={onEditClick}>
                <i className="bi bi-pencil me-2"></i> Edit
              </DropdownItem>

              <DropdownItem className="text-danger" onClick={onDeleteClick}>
                <i className="bi bi-trash me-2"></i> Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </CardHeader>

        <CardBody {...listeners}>
          <h6>{task.taskName}</h6>
          <p className="text-muted small">{task.description}</p>

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
}

const TaskDetails = ({ status, tasks }: Props) => {
  const { setNodeRef } = useDroppable({ id: status });
  const [editTask, setEditTask] = useState<ProjectTask | null>(null);

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
            onEdit={setEditTask}
            onDelete={(id) => console.log("Delete task", id)}
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

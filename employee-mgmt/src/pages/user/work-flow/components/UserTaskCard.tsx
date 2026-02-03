import "../styles/userTask.css";
import type { TaskResponseDto } from "../../../../interfaces/userTask.interface,";
import { truncateText } from "../../../../utils/text.util";

interface Props {
  task: TaskResponseDto;
}

export const UserTaskCard = ({ task }: Props) => {
  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "Completed";

  return (
    <div className="user-task-card">
      {/* HEADER */}
      <div className="task-header">
        <div className="task-title">
          <h6>{task.taskName}</h6>

          {task.priority && (
            <span className={`priority ${task.priority.toLowerCase()}`}>
              {task.priority}
            </span>
          )}
        </div>

        <div
          className={`status ${task.status.toLowerCase().replace(" ", "-")}`}
        >
          {task.status}
        </div>
      </div>

      {/* DESCRIPTION */}
      {task.description && (
        <p className="task-description">{truncateText(task.description, 20)}</p>
      )}

      {/* META */}
      <div className="task-meta">
        <span className="project-name">{task.projectName}</span>

        <span className={`due ${isOverdue ? "overdue" : ""}`}>
          <i className="bi bi-calendar-date"></i> {task.dueDate?.split("T")[0]}
          {isOverdue && " (Overdue)"}
        </span>
      </div>
    </div>
  );
};

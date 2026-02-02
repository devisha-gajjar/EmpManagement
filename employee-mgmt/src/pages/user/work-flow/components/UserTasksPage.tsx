import { useEffect } from "react";
import CardSkeleton from "../../../../components/shared/loader/SkeletonLoader/CardSkeleton";
import { UserTaskCard } from "./UserTaskCard";
import UserTaskSummary from "./UserTaskSummary";

import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { fetchUserTasks } from "../../../../features/user/task/userTasksSlice";

const UserTasksPage = () => {
  const dispatch = useAppDispatch();

  const { tasks, loading, error } = useAppSelector((state) => state.userTask);

  useEffect(() => {
    dispatch(fetchUserTasks());
  }, [dispatch]);

  if (loading) return <CardSkeleton count={3} />;

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  return (
    <>
      {/* Summary */}
      <UserTaskSummary tasks={tasks} />

      {/* Filters (UI only for now) */}
      <div className="filters mb-3 d-flex gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Search tasks..."
        />

        <select className="form-select">
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <select className="form-select">
          <option value="">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {/* Task list */}
      {tasks.length === 0 ? (
        <p className="text-muted">No tasks assigned to you.</p>
      ) : (
        <div className="d-flex flex-column gap-3">
          {tasks.map((task) => (
            <UserTaskCard key={task.taskId} task={task} />
          ))}
        </div>
      )}
    </>
  );
};

export default UserTasksPage;

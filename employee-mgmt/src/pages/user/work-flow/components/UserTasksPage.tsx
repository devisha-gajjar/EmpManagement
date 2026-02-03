import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { fetchUserTasks } from "../../../../features/user/task/userTasksSlice";
import CardSkeleton from "../../../../components/shared/loader/SkeletonLoader/CardSkeleton";
import { UserTaskCard } from "./UserTaskCard";
import UserTaskSummary from "./UserTaskSummary";
import { notificationHubService } from "../../../../services/signalR/notificationHub.service";

const UserTasksPage = () => {
  const dispatch = useAppDispatch();
  const { tasks, loading, error } = useAppSelector((state) => state.userTask);
  const userId = useAppSelector((state) => state.auth.userId);

  // Initial load
  useEffect(() => {
    dispatch(fetchUserTasks());
  }, [dispatch]);

  // SignalR listener
  useEffect(() => {
    if (!userId) return;

    const onTaskAssigned = () => {
      dispatch(fetchUserTasks());
    };

    notificationHubService.onTaskAssigned(onTaskAssigned);

    return () => {
      notificationHubService.offTaskAssigned(onTaskAssigned);
    };
  }, [dispatch, userId]);

  if (loading) return <CardSkeleton count={3} />;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <>
      <UserTaskSummary tasks={tasks} />

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

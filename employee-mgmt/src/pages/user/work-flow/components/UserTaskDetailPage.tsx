import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  fetchTaskDetail,
  clearUserTasks,
  updateTaskStatus,
} from "../../../../features/user/task/userTasksSlice";
import "../styles/userTaskDetail.css";
import type {
  TaskWorkLogDto,
  TaskTagDto,
  TaskCommentDto,
} from "../../../../interfaces/userTask.interface";
import { formatStatusAction } from "../../../../utils/formateStatusAction";
import CollapsibleSection from "../../../../components/shared/collasable-section/CollapsibleSection";
import AddWorkLogModal from "./AddWorkLogModal";
import { taskStatusOptions } from "../../../../utils/constant";
import { formatDateWithTime } from "../../../../utils/dateUtil";
import PageHeader from "../../../../components/shared/page-header/PageHeader";
import { notificationHubService } from "../../../../services/signalR/notificationHub.service";

const UserTaskDetailPage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const dispatch = useAppDispatch();

  const [showWorkLogModal, setShowWorkLogModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [liveComments, setLiveComments] = useState<TaskCommentDto[]>([]);
  const [newComment, setNewComment] = useState("");
  const [typingUser, setTypingUser] = useState<string | null>(null);

  const { selectedTask, loading, error } = useAppSelector(
    (state) => state.userTask
  );

  const { userId } = useAppSelector((state) => state.auth);

  const { userName } = useAppSelector((state) => state.auth);
  useEffect(() => {
    const handleCommentAdded = (data: any) => {
      setLiveComments((prev) => [
        ...prev,
        {
          commentId: data.commentId,
          comment: data.message,
          createdBy: data.userName,
          createdOn: data.createdAt,
        },
      ]);
    };

    const handleTyping = (userName: string) => {
      setTypingUser(userName);
      setTimeout(() => setTypingUser(null), 2000);
    };

    notificationHubService.onUserTyping(handleTyping);

    notificationHubService.onTaskCommentAdded(handleCommentAdded);

    return () => {
      notificationHubService.offTaskCommentAdded(handleCommentAdded);
      notificationHubService.offUserTyping(handleTyping);
    };
  }, []);

  useEffect(() => {
    if (!taskId) return;

    notificationHubService.joinTaskGroup(Number(taskId));

    return () => {
      notificationHubService.leaveTaskGroup(Number(taskId));
    };
  }, [taskId]);

  useEffect(() => {
    if (taskId) {
      dispatch(fetchTaskDetail(Number(taskId)));
    }

    return () => {
      dispatch(clearUserTasks());
    };
  }, [dispatch, taskId]);

  useEffect(() => {
    if (selectedTask?.comments) {
      // Use optional chaining
      setLiveComments(selectedTask.comments);
    }
  }, [selectedTask?.comments]);

  useEffect(() => {
    if (selectedTask?.task?.status) {
      setSelectedStatus(selectedTask.task.status);
    }
  }, [selectedTask?.task?.status]);

  if (loading) return <p className="page-state">Loading task…</p>;
  if (error) return <p className="page-state error">{error}</p>;
  if (!selectedTask) return null;

  const { task, timeline, workLogs, tags } = selectedTask;

  const currentUserId = userId;
  const isAssignedUser = task?.userId === currentUserId;

  const totalHours = workLogs.reduce(
    (total: number, log: TaskWorkLogDto) => total + log.hoursSpent,
    0
  );

  const sortedTimeline = [...timeline].sort(
    (a, b) => new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime()
  );

  const sortedComments = [...liveComments].sort(
    (a, b) => new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime()
  );

  const handleChangeStatus = () => {
    if (!taskId || !selectedTask) return;

    if (selectedStatus === selectedTask.task.status) return;

    dispatch(
      updateTaskStatus({
        taskId: Number(taskId),
        status: selectedStatus,
      })
    );
  };

  const handleMarkComplete = () => {
    if (!taskId || !selectedTask) return;

    if (selectedTask.task.status === "Completed") return;

    dispatch(
      updateTaskStatus({
        taskId: Number(taskId),
        status: "Completed",
      })
    );
  };

  const handleSendComment = async () => {
    if (!taskId || !newComment.trim()) return;

    await notificationHubService.addTaskComment(Number(taskId), {
      comment: newComment,
    });

    setNewComment("");
  };

  const handleTyping = () => {
    if (!taskId || !userName) return;
    notificationHubService.sendTyping(Number(taskId), userName);
  };

  const statusChanges = sortedTimeline.filter(
    (item) => item.action === "STATUS_CHANGED"
  );

  const statusSteps =
    statusChanges.length > 0
      ? statusChanges
      : [
          {
            activityId: "initial",
            newValue: task.status,
            userName: "System",
            createdOn: task.startDate,
          },
        ];

  return (
    <>
      <div className="mb-3">
        <PageHeader
          icon="clipboard-check"
          title={task.taskName}
          subtitle="View task information, timeline, and work logs"
          theme="blue"
        />
      </div>
      <div className="task-detail-layout">
        <div className="task-main">
          {/* HEADER */}
          <div className="task-header">
            <div>
              <h1 className="task-title">{task.taskName}</h1>
              <p className="task-id">TASK-{task.taskId}</p>
            </div>

            <div className="task-tags">
              {tags.map((t: TaskTagDto) => (
                <span key={t.tagId} className="tag">
                  {t.name}
                </span>
              ))}
            </div>
          </div>

          <p className="task-description">{task.description}</p>
        </div>

        <div className="main-container">
          <div className="section-container">
            {/* STATUS TIMELINE */}
            <CollapsibleSection title="Status Timeline" defaultOpen>
              <div className="status-progress">
                {statusSteps.map((item, index) => {
                  const isCurrent = index === statusSteps.length - 1;

                  return (
                    <div key={item.activityId} className="status-step">
                      <div
                        className={`status-indicator ${
                          isCurrent ? "current" : "completed"
                        }`}
                      />

                      <div className="status-meta">
                        <div className="status-name">{item.newValue}</div>

                        <div className="status-user">
                          Changed by <strong>{item.userName}</strong>
                        </div>

                        <div className="status-time">
                          {formatDateWithTime(item.createdOn)}
                        </div>
                      </div>

                      {!isCurrent && <div className="status-line" />}
                    </div>
                  );
                })}
              </div>

              <div className="timeline-history">
                {sortedTimeline.map((item) => (
                  <div key={item.activityId} className="timeline-row">
                    <div className="timeline-marker" />
                    <div className="timeline-content">
                      <div className="timeline-header">
                        {formatStatusAction(
                          item.action,
                          item.oldValue,
                          item.newValue
                        )}
                      </div>

                      <div className="timeline-user">
                        <div className="avatar sm">
                          {item.userName?.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="username">{item.userName}</span>
                        <span className="separator">•</span>
                        <span className="timestamp">
                          {new Date(item.createdOn).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            {/* WORK LOG */}
            <CollapsibleSection title="Work Log" defaultOpen={false}>
              <div className="card-header">
                <h4>Time Tracking</h4>
                <div className="d-flex gap-2 align-items-center">
                  <span className="badge">{totalHours}h logged</span>

                  <button
                    className="log-time-btn"
                    disabled={!isAssignedUser}
                    onClick={() => setShowWorkLogModal(true)}
                  >
                    <i className="bi bi-plus"></i> Log Time
                  </button>
                </div>
              </div>

              {workLogs.length === 0 && <div>No logs to show</div>}

              <div className="time-log-list">
                {workLogs.map((w: TaskWorkLogDto) => (
                  <div key={w.workLogId} className="time-log-item">
                    <div className="avatar">
                      {w.userName?.slice(0, 2).toUpperCase()}
                    </div>

                    <div className="time-log-body">
                      <span className="username">{w.userName}</span>
                      <p>{w.description}</p>
                    </div>

                    <span className="time-pill">{w.hoursSpent}h</span>
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            {/* COMMENTS */}
            <CollapsibleSection title="Discussion" defaultOpen={false}>
              {sortedComments.map((c: TaskCommentDto) => {
                const isCurrentUser = c.createdBy === userName;

                return (
                  <div
                    key={c.commentId}
                    className={`comment ${isCurrentUser ? "own" : ""}`}
                  >
                    {!isCurrentUser && (
                      <div className="avatar">
                        {String(c.createdBy).slice(0, 2).toUpperCase()}
                      </div>
                    )}

                    <div className="comment-content">
                      <div className="comment-header">
                        <span className="comment-user">{c.createdBy}</span>
                        <span className="comment-time">
                          {formatDateWithTime(c.createdOn)}
                        </span>
                      </div>

                      <div className="comment-bubble">{c.comment}</div>
                    </div>

                    {isCurrentUser && (
                      <div className="avatar">
                        {String(c.createdBy).slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="comment-input">
                <div className="avatar small">
                  {String(userName).slice(0, 2).toUpperCase()}
                </div>

                <input
                  value={newComment}
                  onChange={(e) => {
                    setNewComment(e.target.value);
                    handleTyping();
                  }}
                  placeholder="Write a comment..."
                />

                <button onClick={handleSendComment}>
                  <i className="bi bi-send"></i>
                </button>
              </div>

              {typingUser && (
                <div className="typing-indicator">
                  {typingUser} is typing...
                </div>
              )}
            </CollapsibleSection>
          </div>

          {/* SIDEBAR */}
          <aside className="task-sidebar">
            <div className="card p-3">
              <h5 className="task-sidebar-header">Status</h5>

              <select
                className="status-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {taskStatusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <div className="d-flex gap-3">
                <button
                  className="primary-btn"
                  onClick={handleChangeStatus}
                  disabled={
                    !selectedTask || selectedStatus === selectedTask.task.status
                  }
                >
                  Change Status
                </button>

                <button
                  className="primary-btn"
                  onClick={handleMarkComplete}
                  disabled={
                    !selectedTask || selectedTask.task.status === "Completed"
                  }
                >
                  Mark Complete
                </button>
              </div>
            </div>
            <div className="card p-3">
              <h5 className="task-sidebar-header">Details</h5>
              <div className="detail-row">
                <span>Project</span>
                <strong>{task.projectName}</strong>
              </div>
              <div className="detail-row">
                <span>Priority</span> <strong>{task.priority}</strong>
              </div>
              <div className="detail-row">
                <span>Due date</span>
                <strong>
                  {task.dueDate ? new Date(task.dueDate).toDateString() : "-"}
                </strong>
              </div>
            </div>
            <div className="card p-3">
              <h5 className="task-sidebar-header">Quick actions</h5>
              <button
                className="secondary-btn"
                disabled={!isAssignedUser}
                onClick={() => setShowWorkLogModal(true)}
              >
                Log time
              </button>
            </div>
          </aside>
        </div>
      </div>

      <AddWorkLogModal
        open={showWorkLogModal}
        taskId={task.taskId}
        onClose={() => setShowWorkLogModal(false)}
      />
    </>
  );
};

export default UserTaskDetailPage;

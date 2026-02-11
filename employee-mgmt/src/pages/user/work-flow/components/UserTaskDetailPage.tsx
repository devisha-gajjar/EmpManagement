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
} from "../../../../interfaces/userTask.interface,";

import {
  formatActionSimple,
  formatStatusAction,
} from "../../../../utils/formateStatusAction";

import CollapsibleSection from "../../../../components/shared/collasable-section/CollapsibleSection";
import AddWorkLogModal from "./AddWorkLogModal";
import { taskStatusOptions } from "../../../../utils/constant";
import { formatDate, formatDateWithTime } from "../../../../utils/dateUtil";
import PageHeader from "../../../../components/shared/page-header/PageHeader";

const UserTaskDetailPage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const dispatch = useAppDispatch();

  const [showWorkLogModal, setShowWorkLogModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const { selectedTask, loading, error } = useAppSelector(
    (state) => state.userTask
  );

  const { userName } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (taskId) {
      dispatch(fetchTaskDetail(Number(taskId)));
    }

    return () => {
      dispatch(clearUserTasks());
    };
  }, [dispatch, taskId]);

  useEffect(() => {
    if (selectedTask?.task?.status) {
      setSelectedStatus(selectedTask.task.status);
    }
  }, [selectedTask?.task?.status]);

  if (loading) return <p className="page-state">Loading task…</p>;
  if (error) return <p className="page-state error">{error}</p>;
  if (!selectedTask) return null;

  const { task, timeline, workLogs, comments, tags } = selectedTask;

  const totalHours = workLogs.reduce(
    (total: number, log: TaskWorkLogDto) => total + log.hoursSpent,
    0
  );

  const sortedTimeline = [...timeline].sort(
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
                <span className="badge">{totalHours}h logged</span>

                <button
                  className="log-time-btn"
                  onClick={() => setShowWorkLogModal(true)}
                >
                  <i className="bi bi-plus"></i> Log Time
                </button>
              </div>

              {workLogs.length === 0 && <div>No logs to show</div>}

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
            </CollapsibleSection>

            {/* COMMENTS */}
            <CollapsibleSection title="Discussion" defaultOpen={false}>
              {comments.map((c: TaskCommentDto) => (
                <div key={c.commentId} className="comment">
                  <div className="avatar">
                    {String(c.createdBy).slice(0, 2).toUpperCase()}
                  </div>

                  <div className="comment-bubble">{c.comment}</div>
                </div>
              ))}

              <div className="comment-input">
                <div className="avatar small">
                  {String(userName).slice(0, 2).toUpperCase()}
                </div>
                <input placeholder="Write a comment..." />
                <button>Send</button>
              </div>
            </CollapsibleSection>
          </div>

          {/* SIDEBAR */}
          <aside className="task-sidebar">
            <div className="card p-3">
              <h5>Status</h5>

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
              <h5>Details</h5>
              <div className="detail-row">
                <span>Project</span>
                <strong>{task.projectName}</strong>
              </div>
              <div className="detail-row">
                <span>Priority</span> <strong>{task.priority}</strong>
              </div>
              <div className="detail-row">
                {" "}
                <span>Due date</span>{" "}
                <strong>
                  {" "}
                  {task.dueDate
                    ? new Date(task.dueDate).toDateString()
                    : "-"}{" "}
                </strong>{" "}
              </div>{" "}
            </div>{" "}
            <div className="card p-3">
              {" "}
              <h5>Quick actions</h5>{" "}
              <button className="secondary-btn">Log time</button>{" "}
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

import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  fetchTaskDetail,
  clearUserTasks,
} from "../../../../features/user/task/userTasksSlice";

import "../styles/userTaskDetail.css";
import type {
  TaskWorkLogDto,
  TaskTagDto,
  TaskTimelineDto,
  TaskCommentDto,
} from "../../../../interfaces/userTask.interface,";
import {
  formatActionSimple,
  formatStatusAction,
} from "../../../../utils/formateStatusAction";
import CollapsibleSection from "../../../../components/shared/collasable-section/CollapsibleSection";

const UserTaskDetailPage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const dispatch = useAppDispatch();

  const { selectedTask, loading, error } = useAppSelector(
    (state) => state.userTask
  );

  useEffect(() => {
    if (taskId) {
      dispatch(fetchTaskDetail(Number(taskId)));
    }

    return () => {
      dispatch(clearUserTasks());
    };
  }, [dispatch, taskId]);

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

  return (
    <div className="task-detail-layout">
      {/* ================= LEFT ================= */}
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

        {/* STATUS TIMELINE */}
        <CollapsibleSection title="Status Timeline" defaultOpen>
          {/* TOP STATUS PROGRESSION */}
          <div className="status-progress">
            {sortedTimeline.map((item, index) => (
              <div key={item.activityId} className="status-step">
                <div
                  className={`status-indicator ${
                    index === sortedTimeline.length - 1 ? "current" : ""
                  }`}
                />

                <div className="status-meta">
                  <span className="status-name">
                    {formatActionSimple(item.action)}
                  </span>
                  <span className="status-user">{item.userName}</span>
                </div>

                {index < sortedTimeline.length - 1 && (
                  <div className="status-line" />
                )}
              </div>
            ))}
          </div>

          {/* ACTIVITY HISTORY */}
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
        <section className="card time-tracking-card">
          <div className="card-header">
            <div className="card-header-left">
              <h4 className="card-title">Time Tracking</h4>
              <span className="badge">{totalHours}h logged</span>
            </div>

            <button className="log-time-btn">+ Log Time</button>
          </div>

          <div className="time-log-list">
            {workLogs.map((w: TaskWorkLogDto) => (
              <div key={w.workLogId} className="time-log-item">
                <div className="avatar">
                  {w.userName?.slice(0, 2).toUpperCase()}
                </div>

                <div className="time-log-body">
                  <div className="time-log-header">
                    <span className="username">{w.userName}</span>
                    <span className="separator">•</span>
                    <span className="timestamp">
                      {new Date(w.createdOn).toLocaleDateString()}{" "}
                      {new Date(w.createdOn).toLocaleTimeString()}
                    </span>
                  </div>

                  <p className="time-log-desc">{w.description}</p>
                </div>

                <span className="time-pill">{w.hoursSpent}h</span>
              </div>
            ))}
          </div>
        </section>

        {/* COMMENTS */}
        <section className="card">
          <h4 className="card-title">Discussion</h4>

          {comments.map((c: TaskCommentDto) => (
            <div key={c.commentId} className="comment">
              <div className="avatar">
                {String(c.createdBy).slice(0, 2).toUpperCase()}
              </div>
              <div className="comment-body">
                <strong>User {c.createdBy}</strong>
                <p>{c.comment}</p>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* ================= RIGHT ================= */}
      <aside className="task-sidebar">
        <div className="card">
          <h5>Status</h5>
          <span className={`status ${task.status?.toLowerCase()}`}>
            {task.status}
          </span>

          <button className="primary-btn">Mark Complete</button>
        </div>

        <div className="card">
          <h5>Details</h5>

          <div className="detail-row">
            <span>Project</span>
            <strong>{task.projectId}</strong>
          </div>

          <div className="detail-row">
            <span>Priority</span>
            <strong>{task.priority}</strong>
          </div>

          <div className="detail-row">
            <span>Due date</span>
            <strong>
              {task.dueDate ? new Date(task.dueDate).toDateString() : "-"}
            </strong>
          </div>
        </div>

        <div className="card">
          <h5>Quick actions</h5>
          <button className="secondary-btn">Log time</button>
          <button className="secondary-btn">Edit task</button>
        </div>
      </aside>
    </div>
  );
};

export default UserTaskDetailPage;

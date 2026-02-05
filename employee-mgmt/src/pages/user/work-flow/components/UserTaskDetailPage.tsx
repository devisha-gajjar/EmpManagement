import { useEffect, useState } from "react";
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
  TaskCommentDto,
} from "../../../../interfaces/userTask.interface,";
import {
  formatActionSimple,
  formatStatusAction,
} from "../../../../utils/formateStatusAction";
import CollapsibleSection from "../../../../components/shared/collasable-section/CollapsibleSection";
import AddWorkLogModal from "./AddWorkLogModal";

const UserTaskDetailPage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const dispatch = useAppDispatch();
  const [showWorkLogModal, setShowWorkLogModal] = useState(false);

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

  const openWorkModal = () => {
    console.log("Reached in work log")
    setShowWorkLogModal(true);
  };

  return (
    <>
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

                {sortedTimeline.length == 0 ? (
                  <div>No data availbale to show</div>
                ) : (
                  <></>
                )}
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
            <CollapsibleSection title="Work Log" defaultOpen={false}>
              <div className="card-header">
                <div className="card-header-left">
                  <h4 className="card-title">Time Tracking</h4>
                  <span className="badge">{totalHours}h logged</span>
                </div>

                <button
                  className="log-time-btn"
                  onClick={() => openWorkModal()}
                >
                  + Log Time
                </button>
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

                {workLogs.length == 0 ? <div>No logs to show</div> : <></>}
              </div>
            </CollapsibleSection>

            {/* COMMENTS */}
            <CollapsibleSection title="Discussion" defaultOpen={false}>
              <div className="discussion">
                <div className="comments-list">
                  {comments.map((c: TaskCommentDto) => (
                    <div key={c.commentId} className="comment">
                      <div className="avatar">
                        {String(c.createdBy).slice(0, 2).toUpperCase()}
                      </div>

                      <div className="comment-content">
                        <div className="comment-header">
                          <span className="name">User {c.createdBy}</span>
                          <span className="time">
                            {/* {new Date(c.createdAt).toLocaleString()} */}
                          </span>
                        </div>

                        <div className="comment-bubble">{c.comment}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                {comments.length > 0 && <div className="comment-border"></div>}

                <div className="comment-input">
                  <div className="avatar small">
                    {String(userName).slice(0, 2).toUpperCase()}
                  </div>
                  <input placeholder="Write a comment..." />
                  <button>
                    <i className="bi bi-send"></i>
                  </button>
                </div>
              </div>
            </CollapsibleSection>
          </div>

          <aside className="task-sidebar">
            <div className="card p-3">
              <h5>Status</h5>
              <span className={`status ${task.status?.toLowerCase()}`}>
                {task.status}
              </span>

              <button className="primary-btn">Mark Complete</button>
            </div>

            <div className="card p-3">
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

            <div className="card p-3">
              <h5>Quick actions</h5>
              <button className="secondary-btn">Log time</button>
              <button className="secondary-btn">Edit task</button>
            </div>
          </aside>
        </div>
      </div>
      {true && (
        <AddWorkLogModal
          taskId={task.taskId}
          onClose={() => setShowWorkLogModal(false)}
        />
      )}
    </>
  );
};

export default UserTaskDetailPage;

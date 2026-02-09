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

const UserTaskDetailPage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const dispatch = useAppDispatch();

  const [showWorkLogModal, setShowWorkLogModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const { selectedTask, loading, error } = useAppSelector(
    (state) => state.userTask
  );

  const { userName } = useAppSelector((state) => state.auth);

  /* =======================
     FETCH / CLEANUP
  ======================== */
  useEffect(() => {
    if (taskId) {
      dispatch(fetchTaskDetail(Number(taskId)));
    }

    return () => {
      dispatch(clearUserTasks());
    };
  }, [dispatch, taskId]);

  const { task, timeline, workLogs, comments, tags } = selectedTask;
  /* =======================
     STATUS SYNC
  ======================== */
  useEffect(() => {
    if (task?.status) {
      setSelectedStatus(task.status);
    }
  }, [task?.status]);

  /* =======================
     GUARDS (VERY IMPORTANT)
  ======================== */
  if (loading) return <p className="page-state">Loading task…</p>;
  if (error) return <p className="page-state error">{error}</p>;
  if (!selectedTask) return null;

  /* =======================
     SAFE DESTRUCTURING
  ======================== */

  /* =======================
     DERIVED DATA
  ======================== */
  const totalHours = workLogs.reduce(
    (total: number, log: TaskWorkLogDto) => total + log.hoursSpent,
    0
  );

  const sortedTimeline = [...timeline].sort(
    (a, b) => new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime()
  );

  const handleStatusChange = () => {
    if (!taskId || selectedStatus === task.status) return;

    dispatch(
      updateTaskStatus({
        taskId: Number(taskId),
        status: selectedStatus,
      })
    );
  };

  /* =======================
     RENDER
  ======================== */
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
              <div className="status-progress">
                {sortedTimeline.length === 0 && <div>No data available</div>}

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
            <CollapsibleSection title="Work Log">
              <div className="card-header">
                <h4>Time Tracking</h4>
                <span className="badge">{totalHours}h logged</span>

                <button
                  className="log-time-btn"
                  onClick={() => setShowWorkLogModal(true)}
                >
                  + Log Time
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
            <CollapsibleSection title="Discussion">
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
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {taskStatusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <button
                className="primary-btn"
                disabled={selectedStatus === task.status}
                onClick={handleStatusChange}
              >
                Update Status
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

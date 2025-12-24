import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchNotificationsByUser, markAllNotificationsAsRead, markNotificationAsRead } from "../../../features/user/notifications/notificationApi";
import { notificationHubService } from "../../../services/signalR/notificationHub.service";
import type { NotificationList } from "../../../interfaces/notification.interface";
import { Card, CardBody, Badge, Button } from "reactstrap";
import "./notification-list.css";
import { getNotificationTag } from "./notification.config";
import Tag from "../../../components/shared/tag/Tag";
import PageHeader from "../../../components/shared/page-header/PageHeader";

function NotificationsList() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((state) => state.notification);
  const { userId } = useAppSelector((state) => state.auth);

  // Initial fetch
  useEffect(() => {
    if (userId) {
      dispatch(fetchNotificationsByUser(Number(userId)));
    }
  }, [dispatch, userId]);

  // SignalR live updates
  useEffect(() => {
    const onProjectMemberAssign = () => {
      if (userId) {
        dispatch(fetchNotificationsByUser(Number(userId)));
      }
    };

    notificationHubService.onAssignedToProject(onProjectMemberAssign);
    return () =>
      notificationHubService.offAssignedToProject(onProjectMemberAssign);
  }, [dispatch, userId]);

  // Mark individual notification as read
  const handleMarkAsRead = (notificationId: number) => {
    dispatch(markNotificationAsRead(notificationId));
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = () => {
    if (selectedIds.length > 0) {
      dispatch(markAllNotificationsAsRead(selectedIds));
    } else {
      dispatch(markAllNotificationsAsRead(null));
    }

    setSelectedIds([]);
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const unreadIds = list
        .filter((n) => !n.isRead)
        .map((n) => n.notificationId);

      setSelectedIds(unreadIds);
    } else {
      setSelectedIds([]);
    }
  };

  return (
    <div>
      <div className="mb-3">
        <PageHeader
          icon="bi bi-bell"
          title="Notification List"
          subtitle="View and manage your notifications"
          theme="orange"
        />
      </div>
      <div className="d-flex justify-content-between">
        <div className="d-flex justify-content-between mb-3 p-2 rounded bg-light border gap-2">
          <input
            className="form-check-input"
            type="checkbox"
            id="selectAllUnread"
            checked={
              list.some((n) => !n.isRead) &&
              selectedIds.length === list.filter((n) => !n.isRead).length
            }
            onChange={(e) => handleSelectAll(e.target.checked)}
          />
          <label
            className="form-check-label small fw-medium mb-0"
            htmlFor="selectAllUnread"
          >
            Select all unread
          </label>
        </div>

        <Button
          color="primary"
          className="mb-3"
          onClick={handleMarkAllAsRead}
          disabled={
            loading || (selectedIds.length === 0 && list.every((n) => n.isRead))
          }
        >
          {selectedIds.length > 0
            ? `Mark Selected (${selectedIds.length}) as Read`
            : "Mark All as Read"}
        </Button>
      </div>

      {loading && <div className="text-muted text-center">Loading...</div>}

      {!loading && list.length === 0 && (
        <div className="text-muted text-center">No notifications yet</div>
      )}

      {!loading &&
        list.map((n: NotificationList) => (
          <Card
            key={n.notificationId}
            className={`mb-3 shadow-sm notification-card ${
              !n.isRead ? "notification-unread" : "notification-read"
            }`}
            style={{
              transition: "all 0.3s ease",
            }}
          >
            <CardBody className="p-4 d-flex gap-3">
              <div className="flex-grow-1 d-flex gap-4">
                <input
                  type="checkbox"
                  disabled={n.isRead}
                  checked={selectedIds.includes(n.notificationId)}
                  onChange={() => handleCheckboxChange(n.notificationId)}
                  className="form-check-input mt-1"
                />

                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between mb-2 align-items-center">
                    <div className="d-flex align-items-center gap-2">
                      <h6 className="mb-0 fw-semibold">{n.title}</h6>
                      <Tag tagConfig={getNotificationTag(n.type)} />
                    </div>
                  </div>

                  <p className="mb-2 text-muted small">{n.message}</p>

                  <small className="text-muted">
                    {new Date(n.createdAt).toLocaleString()}
                  </small>
                </div>
              </div>

              {/* Mark individual notification as read */}
              {!n.isRead && (
                <div className="d-flex align-items-center">
                  <Button
                    className="btn mark-as-read-btn"
                    onClick={() => handleMarkAsRead(n.notificationId)}
                  >
                    <i className="bi bi-check2-all fs-5"></i>
                  </Button>
                  {/* <div
                    className={`rounded-circle ${
                      !n.isRead ? "bg-primary " : ""
                    }`}
                    style={{
                      width: 8,
                      height: 8,
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  /> */}
                </div>
              )}
            </CardBody>
          </Card>
        ))}
    </div>
  );
}

export default NotificationsList;

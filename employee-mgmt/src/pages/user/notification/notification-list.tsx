import { useEffect, useState } from "react";
import { Card, CardBody, Badge } from "reactstrap";
import { notificationHubService } from "../../../services/signalR/notificationHub.service";

interface ProjectNotification {
  projectId: number;
  role: number;
  action: "Assigned" | "Updated";
}

function NotificationList() {
  const [notifications, setNotifications] = useState<ProjectNotification[]>([]);

  useEffect(() => {
    const projectMemberAssign = (data: ProjectNotification) => {
      setNotifications((prev) => [data, ...prev]);
    };

    notificationHubService.onAssignedToProject(projectMemberAssign);

    return () => {
      notificationHubService.offAssignedToProject(projectMemberAssign);
    };
  }, []);

  const roleMap: Record<number, string> = {
    1: "Project Manager",
    2: "Team Leader",
    3: "Developer",
    4: "Tester",
    5: "Designer",
  };

  return (
    <div className="p-3">
      <h5 className="mb-3">Notifications</h5>

      {notifications.length === 0 && (
        <div className="text-muted">No notifications yet</div>
      )}

      {notifications.map((n, index) => (
        <Card key={index} className="mb-2 shadow-sm">
          <CardBody className="d-flex justify-content-between align-items-start">
            <div>
              <div className="fw-semibold">
                {n.action === "Assigned"
                  ? "You were assigned to a project"
                  : "Your project role was updated"}
              </div>

              <div className="text-muted small">Project ID: {n.projectId}</div>

              <div className="small">
                Role:{" "}
                <span className="fw-medium">
                  {roleMap[n.role] ?? "Unknown"}
                </span>
              </div>
            </div>

            <Badge color={n.action === "Assigned" ? "success" : "warning"}>
              {n.action}
            </Badge>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

export default NotificationList;

import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardBody } from "reactstrap";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { formatDate } from "../../../../utils/dateUtil";
import { fetchTaskWorkLogs } from "../../../../features/admin/project-mgmt/taskWorklogApi";
import PageHeader from "../../../../components/shared/page-header/PageHeader";

const TaskWorkLogsPage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const dispatch = useAppDispatch();

  const { data, loading } = useAppSelector((state) => state.taskWorkLogs);

  useEffect(() => {
    if (taskId) {
      dispatch(fetchTaskWorkLogs(Number(taskId)));
    }
  }, [taskId]);

  if (loading)
    return (
      <div className="container mt-3">
        <p>Loading work logs...</p>
      </div>
    );

  return (
    <div>
      <div className="mb-3">
        <PageHeader
          icon="assignment"
          title="Task Work Logs"
          subtitle="View the detailed work logs for this task"
          theme="purple"
          showBackButton={true}
        />
      </div>

      {data?.workLogs.length === 0 && (
        <p className="text-muted">No work logs found.</p>
      )}

      {data?.workLogs.map((log) => (
        <Card
          key={log.workLogId}
          className="mb-3 shadow-sm border-0"
          style={{ borderRadius: "0.5rem" }}
        >
          <CardBody>
            <div className="d-flex justify-content-between align-items-center">
              <strong className="text">{log.userName}</strong>
              <span className="text-muted">{formatDate(log.logDate)}</span>
            </div>

            <div className="mt-2">
              <span className="badge text-dark">{log.hoursSpent} hrs</span>
            </div>

            {log.description && (
              <p className="mt-2 mb-0 text-secondary">{log.description}</p>
            )}
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default TaskWorkLogsPage;

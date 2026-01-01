import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardBody } from "reactstrap";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import { formatDate } from "../../../../utils/dateUtil";
import { fetchTaskWorkLogs } from "../../../../features/admin/project-mgmt/taskWorklogApi";

const TaskWorkLogsPage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const dispatch = useAppDispatch();

  const { data, loading } = useAppSelector((state) => state.taskWorkLogs);

  useEffect(() => {
    if (taskId) {
      dispatch(fetchTaskWorkLogs(Number(taskId)));
    }
  }, [taskId]);

  if (loading) return <p>Loading work logs...</p>;

  return (
    <div className="container mt-3">
      <h5 className="mb-3">Work Logs – {data?.taskName}</h5>

      {data?.workLogs.length === 0 && (
        <p className="text-muted">No work logs found.</p>
      )}

      {data?.workLogs.map((log) => (
        <Card key={log.workLogId} className="mb-2">
          <CardBody>
            <div className="d-flex justify-content-between">
              <strong>{log.userName}</strong>
              <span className="text-muted">{formatDate(log.logDate)}</span>
            </div>

            <div className="mt-1">
              <span className="badge bg-primary">{log.hoursSpent} hrs</span>
            </div>

            {log.description && <p className="mt-2 mb-0">{log.description}</p>}
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default TaskWorkLogsPage;

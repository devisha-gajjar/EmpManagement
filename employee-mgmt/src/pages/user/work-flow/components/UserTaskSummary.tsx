import { Col, Row } from "reactstrap";
import CardComponent from "../../../../components/shared/card/Card";
import type { TaskResponseDto } from "../../../../interfaces/userTask.interface,";

interface Props {
  tasks?: TaskResponseDto[];
}

const UserTaskSummary = ({ tasks = [] }: Props) => {
  const total = tasks.length;

  const inProgress = tasks.filter((t) => t.status === "In Progress").length;

  const overdue = tasks.filter(
    (t) =>
      t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "Completed"
  ).length;

  const completed = tasks.filter((t) => t.status === "Completed").length;

  const completionRate = total ? Math.round((completed / total) * 100) : 0;

  return (
    <Row className="mb-4">
      <Col md={3}>
        <CardComponent
          cardConfig={{
            title: "Total Tasks",
            value: total,
            icon: "list-task",
            iconColor: "primary",
          }}
        />
      </Col>

      <Col md={3}>
        <CardComponent
          cardConfig={{
            title: "In Progress",
            value: inProgress,
            icon: "arrow-repeat",
            iconColor: "warning",
          }}
        />
      </Col>

      <Col md={3}>
        <CardComponent
          cardConfig={{
            title: "Overdue",
            value: overdue,
            icon: "exclamation-triangle",
            iconColor: "danger",
          }}
        />
      </Col>

      <Col md={3}>
        <CardComponent
          cardConfig={{
            title: "Completion",
            value: `${completionRate}%`,
            icon: "check-circle",
            iconColor: "success",
            subtitle: `${completed} completed`,
            subtitleColor: "muted",
          }}
        />
      </Col>
    </Row>
  );
};

export default UserTaskSummary;

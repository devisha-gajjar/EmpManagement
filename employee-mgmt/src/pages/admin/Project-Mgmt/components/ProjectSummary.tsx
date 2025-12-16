import { Row, Col } from "reactstrap";
import { ProjectStatus } from "../../../../enums/enum";
import { ProjectStatusUI } from "../configs/project-mgmt.config";
import CardComponent from "../../../../components/shared/card/Card";

interface Props {
  counts: Record<number, number>;
}

const ProjectSummary = ({ counts }: Props) => {
  const statuses = [
    ProjectStatus.Planning,
    ProjectStatus.InProgress,
    ProjectStatus.OnHold,
    ProjectStatus.Completed,
  ];

  return (
    <Row className="g-3 mb-4">
      {statuses.map((status) => {
        const ui = ProjectStatusUI[status];

        return (
          <Col key={status} md={3}>
            <CardComponent
              cardConfig={{
                title: ui.label,
                value: counts[status] || 0,
                icon: ui.icon,
                valueColor: ui.tagColor,
                iconColor: ui.tagColor,
              }}
            />
          </Col>
        );
      })}
    </Row>
  );
};

export default ProjectSummary;

import { Row, Col, Button, Input } from "reactstrap";
import PageHeader from "../../../../components/shared/page-header/PageHeader";
import CardComponent from "../../../../components/shared/card/Card";
import MemberCard from "./MemberCard";
import "../styles/ProjectMembers.css";

const stats = [
  {
    title: "Project Manager",
    value: 1,
    icon: "clipboard-check",
    iconColor: "primary",
  },
  {
    title: "Team Leader",
    value: 1,
    icon: "person-workspace",
    iconColor: "info",
  },
  {
    title: "Developer",
    value: 2,
    icon: "code-slash",
    iconColor: "success",
  },
  {
    title: "Tester",
    value: 0,
    icon: "bug-fill",
    iconColor: "danger",
  },
  {
    title: "Designer",
    value: 1,
    icon: "palette-fill",
    iconColor: "warning",
  },
];

const ProjectMembersPage = () => {
  return (
    <div>
      <PageHeader
        showBackButton
        title="Team Members"
        subtitle="E-Commerce Platform Redesign"
        theme="blue"
      />

      <div className="d-flex justify-content-between align-items-center my-4 bg-white p-4 rounded border">
        <Input
          className="member-search"
          placeholder="Search members by name, email, or role..."
        />
        <Button color="primary">
          <i className="bi bi-person-plus me-2" />
          Add Member
        </Button>
      </div>

      <Row className="g-3 mb-4">
        {stats.map((stat) => (
          <Col key={stat.title} xs={12} sm={6} md={4} lg>
            <CardComponent
              cardConfig={{
                title: stat.title,
                value: stat.value,
                icon: stat.icon,
              }}
            />
          </Col>
        ))}
      </Row>

      <Row className="g-3 member-container m-1">
        <Col md={4}>
          <MemberCard />
        </Col>
        <Col md={4}>
          <MemberCard />
        </Col>
        <Col md={4}>
          <MemberCard />
        </Col>
      </Row>
    </div>
  );
};

export default ProjectMembersPage;

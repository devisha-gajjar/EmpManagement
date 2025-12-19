import { Row, Col, Button, Input } from "reactstrap";
import PageHeader from "../../../../components/shared/page-header/PageHeader";
import CardComponent from "../../../../components/shared/card/Card";
import MemberCard from "./MemberCard";
import "../styles/ProjectMembers.css";
import { useGetMembersByProjectQuery } from "../../../../features/admin/project-mgmt/projectMembersApi";
import { useParams } from "react-router-dom";
import { ProjectRole } from "../../../../enums/enum";
import { useState } from "react";
import ProjectMemberForm from "./ProjectMemberFrom";

const stats = [
  {
    role: ProjectRole.ProjectManager,
    title: "Project Manager",
    icon: "clipboard-check",
  },
  {
    role: ProjectRole.TeamLeader,
    title: "Team Leader",
    icon: "person-workspace",
  },
  {
    role: ProjectRole.Developer,
    title: "Developer",
    icon: "code-slash",
  },
  {
    role: ProjectRole.Tester,
    title: "Tester",
    icon: "bug-fill",
  },
  {
    role: ProjectRole.Designer,
    title: "Designer",
    icon: "palette-fill",
  },
];

const ProjectMembersPage = () => {
  // const { data: projects = [], isError } = useGetProjectsQuery();
  const [openAddMember, setOpenAddMember] = useState(false);
  const { id } = useParams();

  const { data: members = [], isError } = useGetMembersByProjectQuery(
    Number(id)
  );

  const roleCounts = members.reduce<Record<string, number>>((acc, m) => {
    acc[m.role] = (acc[m.role] || 0) + 1;
    return acc;
  }, {});

  const handleAddMember = () => {
    setOpenAddMember(true);
  };

  return (
    <>
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
          <Button color="primary" onClick={handleAddMember}>
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
                  value: roleCounts[stat.role] || 0,
                  icon: stat.icon,
                }}
              />
            </Col>
          ))}
        </Row>

        <Row className="g-3 member-container m-1">
          {isError && <p>Error loading members</p>}
          {members.length > 0 ? (
            members.map((member) => (
              <Col md={4} key={member.projectMemberId}>
                <MemberCard member={member} />
              </Col>
            ))
          ) : (
            <>
              <div>No member added yet.</div>
            </>
          )}
        </Row>
      </div>
      <ProjectMemberForm
        isOpen={openAddMember}
        onClose={() => setOpenAddMember(false)}
        projectId={Number(id)}
      />
    </>
  );
};

export default ProjectMembersPage;

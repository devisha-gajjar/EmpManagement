import { Row, Col, Input, Button } from "reactstrap";
import ProjectCard from "./components/ProjectCard";
import ProjectSummary from "./components/ProjectSummary";
import PageHeader from "../../../components/shared/page-header/PageHeader";
import { useGetProjectsQuery } from "../../../features/admin/project-mgmt/projectsMgmtApi";
import { ProjectStatus } from "../../../enums/enum";

const ProjectsPage = () => {
  const { data: projects = [], isLoading, isError } = useGetProjectsQuery();

  const counts = projects.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  if (isLoading) {
    return <div className="p-4">Loading projects...</div>;
  }

  if (isError) {
    return <div className="p-4 text-danger">Failed to load projects</div>;
  }

  const statusOptions = Object.keys(ProjectStatus)
    .filter((key) => isNaN(Number(key))) 
    .map((key) => ({
      label: key.replace(/([A-Z])/g, " $1").trim(), 
      value: ProjectStatus[key as keyof typeof ProjectStatus],
    }));

  return (
    <>
      <div className="mb-3">
        <PageHeader
          icon="kanban"
          title="Project List"
          subtitle="Manage projects and track progress"
          theme="red"
        />
      </div>

      <ProjectSummary counts={counts} />

      {/* Filters */}
      <Row className="align-items-center bg-white p-3 m-1 border border-1 rounded ">
        <Col md={4}>
          <Input placeholder="Search projects..." />
        </Col>
        <Col md={3}>
          <Input type="select">
            <option value="">All Status</option>
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </Input>
        </Col>
        <Col md={{ size: 3, offset: 2 }} className="text-end">
          <Button color="primary">
            <i className="bi bi-plus-lg me-2"></i>
            New Project
          </Button>
        </Col>
      </Row>

      {/* Project cards */}
      <Row className="g-4 p-1 mt-2">
        {projects.map((p) => (
          <Col md={4} key={p.projectId}>
            <ProjectCard project={p} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default ProjectsPage;

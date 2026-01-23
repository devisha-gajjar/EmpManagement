import { Row, Col, Input, Button } from "reactstrap";
import ProjectCard from "./ProjectCard";
import ProjectSummary from "./ProjectSummary";
import PageHeader from "../../../../components/shared/page-header/PageHeader";
import { useGetProjectsQuery } from "../../../../features/admin/project-mgmt/projectsMgmtApi";
import { ProjectStatus } from "../../../../enums/enum";
import { useMemo, useState } from "react";
import { useDebounce } from "../../../../app/hooks";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";
import CardSkeleton from "../../../../components/shared/loader/SkeletonLoader/CardSkeleton";
import FormSkeleton from "../../../../components/shared/loader/SkeletonLoader/FormSkeleton";
import TextSkeleton from "../../../../components/shared/loader/SkeletonLoader/TextSkeleton";


const ProjectsPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const isDark = theme.palette.mode === "dark";
  const inputClass = isDark
    ? "bg-dark text-light border-secondary"
    : "bg-white text-dark";

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | "">("");

  const debouncedSearch = useDebounce(searchText, 400);

  const { data: projects = [], isLoading, isError } = useGetProjectsQuery();

  const counts = useMemo(() => {
    return projects.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        !debouncedSearch ||
        project.projectName
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase()) ||
        project.description
          ?.toLowerCase()
          .includes(debouncedSearch.toLowerCase());

      const matchesStatus =
        statusFilter === "" || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, debouncedSearch, statusFilter]);

  const statusOptions = Object.keys(ProjectStatus)
    .filter((key) => Number.isNaN(Number(key)))
    .map((key) => ({
      label: key.replaceAll(/([A-Z])/g, " $1").trim(),
      value: ProjectStatus[key as keyof typeof ProjectStatus],
    }));

  if (isError) {
    return (
      <div className="p-4 text-danger">
        Failed to load projects. Please try again.
      </div>
    );
  }

  return (
    <>
      <div className="mb-3">
        {isLoading ? (
          <TextSkeleton lines={2} />
        ) : (
          <PageHeader
            icon="kanban"
            title="Project List"
            subtitle="Manage projects and track progress"
            theme="pink"
          />
        )}
      </div>

      <div className="mb-3">
        {isLoading ? (
          <CardSkeleton count={3} />
        ) : (
          <ProjectSummary counts={counts} />
        )}
      </div>

      {/* Filters */}
      <Row
        className={`align-items-center p-3 m-1 border border-1 rounded ${
          isDark ? "bg-dark text-light" : "bg-white"
        }`}
      >
        {isLoading ? (
          <Col md={12}>
            <FormSkeleton fields={1} />
          </Col>
        ) : (
          <>
            <Col md={4}>
              <Input
                className={inputClass}
                placeholder="Search projects..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Col>

            <Col md={3}>
              <Input
                type="select"
                className={inputClass}
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
              >
                <option value="">All Status</option>
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </Input>
            </Col>

            <Col md={{ size: 3, offset: 2 }} className="text-end">
              <Button
                color="primary"
                onClick={() => navigate("/admin/projects/new")}
              >
                <i className="bi bi-plus-lg me-2"></i>
                New Project
              </Button>
            </Col>
          </>
        )}
      </Row>

      {/* Project cards */}
      {isLoading ? (
        <CardSkeleton count={6} />
      ) : filteredProjects.length ? (
        <Row className="g-4 p-1 mt-2">
          {filteredProjects.map((project) => (
            <Col md={4} key={project.projectId}>
              <ProjectCard project={project} />
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-muted p-4">No projects found.</div>
      )}
    </>
  );
};

export default ProjectsPage;

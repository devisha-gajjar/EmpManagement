import { Card, CardBody, Progress } from "reactstrap";
import type { Project } from "../../../../interfaces/project.interface";
import { ProjectStatusUI } from "../configs/project-mgmt.config";
import Tag from "../../../../components/shared/tag/Tag";
import { useNavigate } from "react-router-dom";
import "../styles/ProjectCard.css";

interface Props {
  project: Project;
}

const ProjectCard = ({ project }: Props) => {
  const navigate = useNavigate();
  const ui = ProjectStatusUI[project.status];
  console.log("ui", project);

  function navigateToProject(id: number) {
    navigate(`/admin/project-details/${id}`);
  }

  return (
    <Card
      className="h-100 shadow-sm"
      onClick={() => navigateToProject(project.projectId)}
    >
      <CardBody className="card-details">
        {/* Status tag */}
        <div className="d-flex justify-content-between">
          <Tag
            tagConfig={{
              id: String(project.status),
              label: ui.label,
              type: "static",
              isSelected: false,
              hasBorder: false,
              backgroundColor: "light-blue",
              textColor: "blue",
            }}
          />
          <i className="bi bi-three-dots-vertical cursor-pointer"></i>
        </div>

        <h5 className="mt-3">{project.projectName}</h5>
        <p className="text-muted small">{project.description}</p>

        <div className="mb-2 small">Progress</div>
        <Progress value={project.progressPercentage} />

        <div className="d-flex justify-content-between mt-3 text-muted small">
          <span>{new Date(project.createdOn).toLocaleDateString()}</span>
          <div className="d-flex justify-content-between mt-2 text-muted small gap-2">
            <span>
              {project.completedTaskCount ?? 0}/{project.taskCount ?? 0} tasks
            </span>
            <span> {project.progressPercentage ?? 0}%</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ProjectCard;

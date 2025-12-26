import {
  Card,
  CardBody,
  Progress,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import type { Project } from "../../../../interfaces/project.interface";
import { ProjectStatusUI } from "../configs/project-mgmt.config";
import Tag from "../../../../components/shared/tag/Tag";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/ProjectCard.css";
import CommonConfirmDialog from "../../../../components/shared/confirmation-dialog/CommonConfirmDialog";
import { useDeleteProjectMutation } from "../../../../features/admin/project-mgmt/projectsMgmtApi";

interface Props {
  project: Project;
}

const ProjectCard = ({ project }: Props) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const navigate = useNavigate();
  const ui = ProjectStatusUI[project.status];

  const [menuOpen, setMenuOpen] = useState(false);

  const [deleteProject] = useDeleteProjectMutation();

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent card click
    setMenuOpen((prev) => !prev);
  };

  const navigateToProject = (id: number) => {
    navigate(`/admin/project-details/${id}`);
  };

  const onEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/admin/projects/edit/${project.projectId}`);
  };

  const onAddMember = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/admin/projects/members/${project.projectId}`);
  };

  const onDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteId(project.projectId);
    setOpenDeleteDialog(true);
    setMenuOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteProject(deleteId).unwrap();
      setOpenDeleteDialog(false);
      setDeleteId(null);
    } catch (error) {
      console.error("Delete project failed", error);
    }
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
    setDeleteId(null);
  };

  return (
    <>
      <Card
        className="h-100 shadow-sm cursor-pointer"
        onClick={() => navigateToProject(project.projectId)}
      >
        <CardBody className="card-details">
          <div className="d-flex justify-content-between align-items-start">
            <Tag
              tagConfig={{
                id: String(project.status),
                label: ui.label,
                type: "static",
                isSelected: false,
                hasBorder: false,
                backgroundColor: ui.backgroundColor,
                textColor: ui.textColor,
              }}
            />

            <Dropdown isOpen={menuOpen} toggle={toggleMenu}>
              <DropdownToggle
                tag="span"
                data-toggle="dropdown"
                aria-expanded={menuOpen}
                className="project-menu"
              >
                <i className="bi bi-three-dots-vertical cursor-pointer "></i>
              </DropdownToggle>

              <DropdownMenu end>
                <DropdownItem onClick={onEdit}>
                  <i className="bi bi-pencil me-2"></i> Edit
                </DropdownItem>
                <DropdownItem onClick={onAddMember}>
                  <i className="bi bi-person-plus me-2"></i> Add Member
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem className="text-danger" onClick={onDelete}>
                  <i className="bi bi-trash me-2"></i> Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

          <h5 className="mt-3">{project.projectName}</h5>
          <p className="text-muted small">{project.description}</p>

          <div className="mb-2 small">Progress</div>
          <Progress value={project.progressPercentage} />

          <div className="d-flex justify-content-between mt-3 text-muted small">
            <span>{new Date(project.createdOn).toLocaleDateString()}</span>
            <div className="d-flex gap-2">
              <span>
                {project.completedTaskCount ?? 0}/{project.taskCount ?? 0} tasks
              </span>
              <span>{project.progressPercentage ?? 0}%</span>
            </div>
          </div>
        </CardBody>
      </Card>
      <CommonConfirmDialog
        open={openDeleteDialog}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Delete"
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default ProjectCard;

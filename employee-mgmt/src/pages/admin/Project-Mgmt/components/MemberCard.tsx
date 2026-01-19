import { useState } from "react";
import {
  Card,
  CardBody,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import Tag from "../../../../components/shared/tag/Tag";
import "../styles/MemberCard.css";
import { useDeleteMemberMutation } from "../../../../features/admin/project-mgmt/projectMembersApi";
import { ProjectRoleConfig } from "../configs/project-member.config";
import type { ProjectRole } from "../../../../enums/enum";
import CommonConfirmDialog from "../../../../components/shared/confirmation-dialog/CommonConfirmDialog";
import ProjectMemberForm from "./ProjectMemberFrom";
import { useParams } from "react-router-dom";
import { useTheme } from "@mui/material"; // import theme hook

const MemberCard = ({ member }: { member: any }) => {
  const roleConfig = ProjectRoleConfig[member.role as ProjectRole];
  const { id } = useParams();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAddMember, setOpenAddMember] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [deleteMember] = useDeleteMemberMutation();

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark"; // detect dark mode

  const handleAddMember = () => {
    setOpenAddMember(true);
  };

  // Avatar initials
  const initials =
    member.user.fullName
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() || "NA";

  const handleDelete = () => {
    setDeleteId(member.projectMemberId);
    setOpenDeleteDialog(true);
    setMenuOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteMember(deleteId).unwrap();
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
        className={`member-card ${
          isDark ? "bg-dark text-light border-secondary" : "bg-white text-dark"
        }`}
      >
        <CardBody>
          <div className="d-flex justify-content-between align-items-start">
            {/* Avatar */}
            <div
              className="avatar-circle"
              style={{
                backgroundColor: isDark ? "#2c2c2c" : "#e0e0e0",
                color: isDark ? "#fff" : "#000",
              }}
            >
              {initials}
            </div>

            {/* Menu */}
            <Dropdown isOpen={menuOpen} toggle={() => setMenuOpen(!menuOpen)}>
              <DropdownToggle tag="span" className="cursor-pointer">
                <i className="bi bi-three-dots-vertical" />
              </DropdownToggle>
              <DropdownMenu
                end
                className={isDark ? "bg-body-secondary text-light" : ""}
              >
                <DropdownItem onClick={() => handleAddMember()}>
                  Edit Role
                </DropdownItem>
                <DropdownItem
                  className="text-danger"
                  onClick={() => handleDelete()}
                >
                  Remove
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* Name */}
          <h6 className="mt-3 mb-0">{member.user.fullName}</h6>

          {/* Email */}
          <small className="text-muted">{member.user.email}</small>

          <div className="d-flex justify-content-between w-100">
            {/* Role */}
            <div className="mt-2">
              <Tag
                tagConfig={{
                  id: member.role,
                  label: roleConfig?.label ?? "Unknown",
                  type: "static",
                  backgroundColor: roleConfig?.backgroundColor ?? "light-gray",
                  textColor: roleConfig?.textColor ?? "secondary",
                  hasBorder: false,
                  isSelected: false,
                }}
              />
            </div>

            {/* Joined Date */}
            <div className="text-muted small mt-2">
              Since {new Date(member.addedOn).toLocaleDateString()}
            </div>
          </div>
        </CardBody>
      </Card>

      <CommonConfirmDialog
        open={openDeleteDialog}
        title="Delete Project"
        message="Are you sure you want to delete this member? This action cannot be undone."
        confirmText="Delete"
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />

      <ProjectMemberForm
        isOpen={openAddMember}
        onClose={() => setOpenAddMember(false)}
        projectId={Number(id)}
        projectMemberId={member.projectMemberId}
      />
    </>
  );
};

export default MemberCard;

import React, { useState } from "react";
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

const MemberCard = ({ member }: { member: any }) => {
  const roleConfig = ProjectRoleConfig[member.role as ProjectRole];

  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteMember] = useDeleteMemberMutation();

  // Avatar initials
  const initials =
    member.user.fullName
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() || "NA";

  return (
    <Card className="member-card">
      <CardBody>
        <div className="d-flex justify-content-between align-items-start">
          {/* Avatar */}
          <div className="avatar-circle">{initials}</div>

          {/* Menu */}
          <Dropdown isOpen={menuOpen} toggle={() => setMenuOpen(!menuOpen)}>
            <DropdownToggle tag="span" className="cursor-pointer">
              <i className="bi bi-three-dots-vertical" />
            </DropdownToggle>
            <DropdownMenu end>
              <DropdownItem>Edit Role</DropdownItem>
              <DropdownItem
                className="text-danger"
                onClick={() => deleteMember(member.projectMemberId)}
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
  );
};

export default MemberCard;

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

const MemberCard = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Card className="member-card">
      <CardBody>
        <div className="d-flex justify-content-between align-items-start">
          {/* Avatar */}
          <div className="avatar-circle">SJ</div>

          {/* Menu */}
          <Dropdown isOpen={menuOpen} toggle={() => setMenuOpen(!menuOpen)}>
            <DropdownToggle tag="span" className="cursor-pointer">
              <i className="bi bi-three-dots-vertical" />
            </DropdownToggle>
            <DropdownMenu end>
              <DropdownItem>Edit Role</DropdownItem>
              <DropdownItem className="text-danger">Remove</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <h6 className="mt-3 mb-0">Sarah Johnson</h6>
        <small className="text-muted">sarah.johnson@company.com</small>

        <div className="d-flex justify-content-between w-100">
          <div className="mt-2">
            <Tag
              tagConfig={{
                id: "pm",
                label: "Project Manager",
                type: "static",
                backgroundColor: "light-purple",
                textColor: "purple",
                hasBorder: false,
                isSelected: false,
              }}
            />
          </div>

          <div className="text-muted small mt-2">Since 1/10/2024</div>
        </div>
      </CardBody>
    </Card>
  );
};

export default MemberCard;

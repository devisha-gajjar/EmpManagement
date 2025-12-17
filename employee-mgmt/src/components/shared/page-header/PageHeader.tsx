import React from "react";
import { Card, CardBody } from "reactstrap";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import "./PageHeader.css";
import type { PageHeaderProps } from "../../../interfaces/pageHeader.interface";

const PageHeader: React.FC<PageHeaderProps> = ({
  icon = "pencil-square",
  title,
  subtitle = "",
  theme = "admin",
  showBackButton = false,
  onBackClick,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <Card className={classNames("page-header-card", theme)}>
      <CardBody className="header-content">
        <div className="d-flex align-items-center gap-3">
          {showBackButton && (
            <i
              className="bi bi-chevron-left me-2 fs-4 cursor-pointer"
              onClick={handleBack}
            />
          )}

          <i className={`bi bi-${icon} icon`} />

          <div>
            <h2 className="title">{title}</h2>
            {subtitle && <p className="subtitle">{subtitle}</p>}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default PageHeader;

import React from "react";
import { Card, CardBody } from "reactstrap";
import classNames from "classnames";
import "./PageHeader.css";
import type { PageHeaderProps } from "../../../interfaces/pageHeader.interface";

const PageHeader: React.FC<PageHeaderProps> = ({
  icon = "pencil-square",
  title,
  subtitle = "",
  theme = "admin",
}) => {
  return (
    <Card className={classNames("page-header-card", theme)}>
      <CardBody className="header-content">
        {/* Icon */}
        <i className={`bi bi-${icon} icon`} />

        {/* Text */}
        <div>
          <h2 className="title">{title}</h2>
          {subtitle && <p className="subtitle">{subtitle}</p>}
        </div>
      </CardBody>
    </Card>
  );
};

export default PageHeader;

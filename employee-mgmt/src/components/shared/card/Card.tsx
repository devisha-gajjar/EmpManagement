import React from "react";
import { Card, CardBody } from "reactstrap";
import classNames from "classnames";
import "./Card.css";
import Tag from "../tag/Tag";

export interface TagConfig {
  id: string;
  label: string;
  type: "static" | "selectable";
  isSelected: boolean;
  hasBorder: boolean;
  backgroundColor: string;
  textColor: string;
}

export interface CardInputConfig {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string; // bootstrap icon name
  tag?: TagConfig;
  subtitleColor?: string;
  valueColor?: string;
  iconColor?: string;
}

interface CardProps {
  cardConfig: CardInputConfig;
}

const CardComponent: React.FC<CardProps> = ({ cardConfig }) => {
  const {
    title,
    value,
    subtitle,
    icon,
    tag,
    subtitleColor = "purple",
    valueColor = "black",
    iconColor = "purple",
  } = cardConfig;

  const hasRightElement = Boolean(icon || tag);
  const showIcon = Boolean(icon && !tag);
  const showTag = Boolean(tag);

  return (
    <Card className="stats-card">
      <CardBody>
        <div className="card-header">
          {/* Left section */}
          <div className="card-title-section">
            <h3 className="card-title">{title}</h3>

            <div className={classNames("card-value", `text-${valueColor}`)}>
              {value}
            </div>

            {subtitle && (
              <p
                className={classNames("card-subtitle", `text-${subtitleColor}`)}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Right section */}
          {hasRightElement && (
            <div className="card-right-section">
              {showIcon && (
                <div className={classNames("card-icon", `text-${iconColor}`)}>
                  <i className={`bi bi-${icon}`} />
                </div>
              )}

              {showTag && tag && (
                <div className="card-tag">
                  <Tag tagConfig={tag} />
                </div>
              )}    
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default CardComponent;

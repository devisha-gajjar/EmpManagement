import React from "react";
import classNames from "classnames";
import "./Tag.css";
import type { TagInputConfig } from "../../../interfaces/tag.interface";

export type TagType = "static" | "selectable";

interface TagProps {
  tagConfig: TagInputConfig;
  onTagSelected?: (payload: {
    id: string;
    label: string;
    isSelected: boolean;
  }) => void;
  onTagClosed?: (payload: { id: string; label: string }) => void;
}

const Tag: React.FC<TagProps> = ({ tagConfig, onTagSelected, onTagClosed }) => {
  const { id, label, type, isSelected, hasBorder, backgroundColor, textColor } =
    tagConfig;

  const isClickable = type === "selectable" && !isSelected;
  const isClosable = type === "selectable" && isSelected;
  const isStatic = type === "static";

  const formatColor = (color: string) =>
    color.replaceAll(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

  const bgColor = isSelected
    ? formatColor(textColor)
    : formatColor(backgroundColor);

  const textClr = isSelected
    ? formatColor(backgroundColor)
    : formatColor(textColor);

  const handleClick = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (type !== "selectable") return;

    if (!isSelected) {
      onTagSelected?.({ id, label, isSelected: true });
    } else {
      onTagClosed?.({ id, label });
    }
  };

  return (
    <div className="tag-container">
      <div
        className={classNames(
          "tag",
          {
            clickable: isClickable,
            closable: isClosable,
            selected: isSelected,
            static: isStatic,
            bordered: hasBorder,
            "not-closable": !isClosable,
          },
          `bg-${bgColor}`,
          `text-${textClr}`
        )}
        onClick={handleClick}
      >
        <span className="tag-label">{label}</span>

        {isClosable && (
          <span className="tag-close" onClick={(e) => handleClick(e)}>
            &times;
          </span>
        )}
      </div>
    </div>
  );
};

export default Tag;

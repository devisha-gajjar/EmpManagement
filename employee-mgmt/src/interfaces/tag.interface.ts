import type { TagType } from "../components/shared/tag/Tag";
import type { TagColor } from "../types/type";

export interface TagInputConfig {
    id: string;
    label: string;
    type: TagType;
    isSelected: boolean;
    hasBorder: boolean;
    backgroundColor: TagColor;
    textColor: TagColor;
}
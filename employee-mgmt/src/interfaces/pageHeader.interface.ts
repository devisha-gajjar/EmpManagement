import type { PageHeaderTheme } from "../types/type";

export interface PageHeaderProps {
    icon?: string;
    title: string;
    subtitle?: string;
    theme?: PageHeaderTheme;
    showBackButton?: boolean;
    backLabel?: string;
    onBackClick?: () => void;
}   
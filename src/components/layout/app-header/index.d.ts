import { ReactNode } from "react";

export interface AppHeaderProps {
  children?: ReactNode;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
  current: boolean;
}

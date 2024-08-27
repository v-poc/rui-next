import React from "react";
import type { ReactNode } from "react";
import type { BadgeProps } from "../badge/Badge";

// SideBarItemProps type
export type SideBarItemProps = {
  badge?: BadgeProps["text"];
  disabled?: boolean;
  key?: string;
  title?: ReactNode;
};

// SideBarItem FC
export const SideBarItem: React.FC<SideBarItemProps> = () => null;

export default SideBarItem;

import { createContext, ReactNode } from "react";

// CheckListContext type
export type CheckListContextType = {
  activeIcon?: ReactNode;
  disabled?: boolean;
  readOnly?: boolean;
  value: string[];
  check: (val: string) => void;
  uncheck: (val: string) => void;
} | null;

export const CheckListContext = createContext<CheckListContextType>(null);

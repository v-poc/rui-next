import React from "react";
import type { CSSProperties, ReactNode } from "react";
import classnames from "classnames";

// DividerProps type
export type DividerProps = {
  prefixCls?: string;
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
  contentAlign?: "center" | "left" | "right"; // takes effect when vertical: false
  vertical?: boolean; // vertical or horizontal
};

// Divider FC
export const Divider: React.FC<DividerProps> = (props) => {
  const {
    prefixCls = "r-divider",
    className,
    children,
    contentAlign = "center",
    style,
    vertical = false,
  } = props;

  const wrapCls = classnames(
    prefixCls,
    className,
    `${prefixCls}-${vertical ? "vertical" : "horizontal"}`,
    `${prefixCls}-${contentAlign}`
  );

  return (
    <div className={wrapCls} style={style}>
      {children && <div className={`${prefixCls}-content`}>{children}</div>}
    </div>
  );
};

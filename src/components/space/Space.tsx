import React from "react";
import type { CSSProperties, ReactNode } from "react";
import classNames from "classnames";

type StyleProps = CSSProperties & {
  "--gap"?: string;
};

// SpaceProps type
export type SpaceProps = {
  prefixCls?: string;
  children?: ReactNode;
  gap?: number;
  align?: "start" | "center" | "end" | "baseline";
  justify?:
    | "start"
    | "center"
    | "end"
    | "between"
    | "around"
    | "evenly"
    | "stretch";
  block?: boolean;
  wrap?: boolean;
  vertical?: boolean; // vertical or horizontal
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

// Space FC
export const Space: React.FC<SpaceProps> = (props) => {
  const {
    prefixCls,
    children,
    gap = 8,
    align,
    justify,
    block,
    wrap,
    vertical,
    onClick,
  } = props;

  const wrapCls = classNames(prefixCls, {
    [`${prefixCls}-wrap`]: wrap,
    [`${prefixCls}-block`]: block,
    [`${prefixCls}-horizontal`]: !vertical,
    [`${prefixCls}-vertical`]: vertical,
    [`${prefixCls}-align-${align}`]: !!align,
    [`${prefixCls}-justify-${justify}`]: !!justify,
  });

  const wrapStyle: StyleProps = {
    "--gap": `${gap}px`,
  };

  return (
    <div className={wrapCls} style={wrapStyle} onClick={onClick}>
      {React.Children.map(children, (item: ReactNode) => {
        return item && <div className={`${prefixCls}-item`}>{item}</div>;
      })}
    </div>
  );
};

Space.defaultProps = {
  prefixCls: "r-space",
  vertical: false,
};

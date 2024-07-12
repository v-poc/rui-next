import React from "react";
import type { CSSProperties, ReactNode } from "react";
import classnames from "classnames";

// FlexProps Type
export type FlexProps = {
  prefixCls?: string;
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
  alignContent?: "start" | "end" | "center" | "between" | "around" | "stretch";
  role?: string;
  direction?: "row" | "row-reverse" | "column" | "column-reverse";
  wrap?: "nowrap" | "wrap" | "wrap-reverse";
  justify?: "start" | "end" | "center" | "between" | "around";
  align?: "start" | "center" | "end" | "baseline" | "stretch";
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
};

// Flex FC
const Flex: React.FC<FlexProps> = (props) => {
  const {
    direction,
    wrap,
    justify,
    align = "center",
    alignContent,
    className,
    children,
    prefixCls = "r-flexbox",
    style,
    ...restProps
  } = props;

  const wrapCls = classnames(prefixCls, className, {
    [`${prefixCls}-dir-row`]: direction === "row",
    [`${prefixCls}-dir-row-reverse`]: direction === "row-reverse",
    [`${prefixCls}-dir-column`]: direction === "column",
    [`${prefixCls}-dir-column-reverse`]: direction === "column-reverse",

    [`${prefixCls}-nowrap`]: wrap === "nowrap",
    [`${prefixCls}-wrap`]: wrap === "wrap",
    [`${prefixCls}-wrap-reverse`]: wrap === "wrap-reverse",

    [`${prefixCls}-justify-start`]: justify === "start",
    [`${prefixCls}-justify-end`]: justify === "end",
    [`${prefixCls}-justify-center`]: justify === "center",
    [`${prefixCls}-justify-between`]: justify === "between",
    [`${prefixCls}-justify-around`]: justify === "around",

    [`${prefixCls}-align-start`]: align === "start",
    [`${prefixCls}-align-center`]: align === "center",
    [`${prefixCls}-align-end`]: align === "end",
    [`${prefixCls}-align-baseline`]: align === "baseline",
    [`${prefixCls}-align-stretch`]: align === "stretch",

    [`${prefixCls}-align-content-start`]: alignContent === "start",
    [`${prefixCls}-align-content-end`]: alignContent === "end",
    [`${prefixCls}-align-content-center`]: alignContent === "center",
    [`${prefixCls}-align-content-between`]: alignContent === "between",
    [`${prefixCls}-align-content-around`]: alignContent === "around",
    [`${prefixCls}-align-content-stretch`]: alignContent === "stretch",
  });

  return (
    <div className={wrapCls} style={style} {...restProps}>
      {children}
    </div>
  );
};

export default Flex;

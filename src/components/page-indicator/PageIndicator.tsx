import React from "react";
import type { CSSProperties, ReactElement } from "react";
import classnames from "classnames";

// PageIndicatorProps type
export type PageIndicatorProps = {
  prefixCls?: string;
  className?: string;
  total: number;
  current: number;
  color?: "primary" | "white";
  style?: CSSProperties;
  vertical?: boolean; // vertical or horizontal
};

// PageIndicator FC
const PageIndicator: React.FC<PageIndicatorProps> = (props) => {
  const {
    prefixCls = "r-page-indicator",
    className,
    total,
    current,
    color = "primary",
    style,
    vertical = false,
  } = props;

  const wrapCls = classnames(
    prefixCls,
    className,
    `${prefixCls}-${vertical ? "vertical" : "horizontal"}`,
    `${prefixCls}-color-${color}`
  );

  const itemCls = (index: number) => {
    return classnames(`${prefixCls}-item`, {
      [`${prefixCls}-item-active`]: current === index,
    });
  };

  const items: ReactElement[] = new Array(total)
    .fill("")
    .map((n, idx) => (
      <div key={`indicator${idx}`} className={itemCls(idx)}></div>
    ));

  return (
    <div className={wrapCls} style={style}>
      {items}
    </div>
  );
};

export default PageIndicator;

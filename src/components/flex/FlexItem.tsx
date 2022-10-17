import React from "react";
import type { CSSProperties, ReactNode } from "react";
import classnames from "classnames";

// FlexItemProps Type
export type FlexItemProps = {
  prefixCls?: string;
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
  disabled?: boolean;
};

// FlexItem FC
const FlexItem: React.FC<FlexItemProps> = (props) => {
  const {
    prefixCls = "r-flexbox",
    className,
    style,
    children,
    ...restProps
  } = props;

  const wrapCls = classnames(`${prefixCls}-item`, className);

  return (
    <div className={wrapCls} style={style} {...restProps}>
      {children}
    </div>
  );
};

export default FlexItem;

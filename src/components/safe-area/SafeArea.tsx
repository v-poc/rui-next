import React from "react";
import classnames from "classnames";

// SafeAreaProps type
export type SafeAreaProps = {
  prefixCls?: string;
  className?: string;
  position: "top" | "bottom";
};

// SafeArea FC
export const SafeArea: React.FC<SafeAreaProps> = (props) => {
  const { prefixCls, className, position } = props;

  const wrapCls = classnames(
    prefixCls,
    className,
    `${prefixCls}-position-${position}`
  );

  return <div className={wrapCls}></div>;
};

SafeArea.defaultProps = {
  prefixCls: "r-safe-area",
};

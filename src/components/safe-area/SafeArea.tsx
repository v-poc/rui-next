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
  const { prefixCls = "r-safe-area", className, position } = props;

  const wrapCls = classnames(
    prefixCls,
    className,
    `${prefixCls}-position-${position}`
  );

  return <div className={wrapCls}></div>;
};

export default SafeArea;

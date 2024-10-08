import React, { ReactNode } from "react";

// AutoJustifyContentProps type
export type AutoJustifyContentProps = {
  prefixCls?: string;
  children?: ReactNode;
};

// AutoJustifyContent FC
export const AutoJustifyContent: React.FC<AutoJustifyContentProps> = (
  props
) => {
  const { prefixCls = "r-auto-justify-content", children } = props;

  return (
    <div className={prefixCls}>
      <div className={`${prefixCls}-content`}>{children}</div>
    </div>
  );
};

export default AutoJustifyContent;

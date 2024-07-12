import React, { ReactNode } from "react";
import classnames from "classnames";

// StepProps type
export type StepProps = {
  prefixCls?: string;
  className?: string;
  description?: ReactNode;
  icon?: ReactNode;
  title?: ReactNode;
  status?: "error" | "finish" | "process" | "wait";
};

// Step FC
export const Step: React.FC<StepProps> = (props) => {
  const {
    prefixCls = "r-step",
    className,
    description = "",
    icon,
    title,
    status = "wait",
  } = props;

  const wrapCls = classnames(
    prefixCls,
    className,
    `${prefixCls}-status-${status}`
  );

  return (
    <div className={wrapCls}>
      <div className={`${prefixCls}-indicator`}>
        <div className={`${prefixCls}-icon-container`}>{icon}</div>
      </div>
      <div className={`${prefixCls}-content`}>
        <div className={`${prefixCls}-title`}>{title}</div>
        {description && (
          <div className={`${prefixCls}-description`}>{description}</div>
        )}
      </div>
    </div>
  );
};

import React, { ReactNode } from "react";
import classnames from "classnames";
import type { StepProps } from "./Step";

// StepsProps type
export type StepsProps = {
  prefixCls?: string;
  className?: string;
  children?: ReactNode;
  currentIndex?: number;
  vertical?: boolean; // vertical or horizontal
};

// Steps FC
export const Steps: React.FC<StepsProps> = (props) => {
  const {
    prefixCls = "r-steps",
    className,
    currentIndex = 0,
    vertical = false,
    children,
  } = props;

  const wrapCls = classnames(
    prefixCls,
    className,
    `${prefixCls}-${vertical ? "vertical" : "horizontal"}`
  );

  return (
    <div className={wrapCls}>
      {React.Children.map(children, (child: ReactNode, index: number) => {
        if (!React.isValidElement(child)) {
          return child;
        }

        const childProps = child.props as StepProps;
        let status = childProps.status || "wait";

        if (index < currentIndex) {
          status = childProps.status || "finish";
        } else if (index === currentIndex) {
          status = childProps.status || "process";
        }

        const icon = childProps.icon || (
          <span className="r-step-icon-dot"></span>
        );

        return React.cloneElement(child, {
          // @ts-ignore
          status,
          icon,
        });
      })}
    </div>
  );
};

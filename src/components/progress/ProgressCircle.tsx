import React, { ReactNode } from "react";
import classnames from "classnames";

// ProgressCircleProps Type
export type ProgressCircleProps = {
  prefixCls?: string;
  className?: string;
  percent?: number;
  children?: ReactNode;
  size?: number;
  trackWidth?: number;
};

// ProgressCircle FC
const ProgressCircle: React.FC<ProgressCircleProps> = (props) => {
  const {
    prefixCls = "r-progress",
    className,
    percent = 0,
    children,
    size = 50,
    trackWidth = 3,
  } = props;

  const wrapCls = classnames(`${prefixCls}-circle`, className);

  const radius = (size - trackWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const wrapStyle = {
    width: `${size}px`,
    height: `${size}px`,
  };

  const circularStyle = {
    strokeWidth: `${trackWidth}px`,
    r: `${radius}px`,
    cx: `${size / 2}px`,
    cy: `${size / 2}px`,
  };

  const fillStyle = {
    ...circularStyle,
    strokeDasharray: circumference,
    strokeDashoffset: circumference * (1 - percent / 100),
  };

  return (
    <div className={wrapCls} style={wrapStyle}>
      <div className={`${prefixCls}-circle-content`}>
        <svg className={`${prefixCls}-circle-svg`}>
          <circle
            className={`${prefixCls}-circle-track`}
            fill="transparent"
            style={circularStyle}
          />
          <circle
            className={`${prefixCls}-circle-fill`}
            fill="transparent"
            style={fillStyle}
          />
        </svg>
        <div className={`${prefixCls}-circle-info`}>{children}</div>
      </div>
    </div>
  );
};

export default ProgressCircle;

import React, { CSSProperties, ReactNode } from "react";
import ProgressBar from "./ProgressBar";
import ProgressCircle from "./ProgressCircle";

// ProgressProps Type
export type ProgressProps = {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties; // the style of container
  barStyle?: CSSProperties; // the style of bar
  percent?: number; // the percent value of progress
  position?: "fixed" | "normal"; // the position of progress bar
  unfilled?: boolean; // whether to fill unfinished part of progress
  appearTransition?: boolean;
  children?: ReactNode;
  size?: number;
  trackWidth?: number;
  mode?: "bar" | "circle";
};

// Progress FC
const Progress: React.FC<ProgressProps> = props => {
  const {
    prefixCls,
    className,
    style = {},
    barStyle = {},
    percent,
    position,
    unfilled,
    appearTransition,
    children,
    size,
    trackWidth,
    mode,
  } = props;

  const barProps = {
    className,
    prefixCls,
    position,
    unfilled,
    style,
    barStyle,
    appearTransition,
    percent,
  };

  const circleProps = {
    prefixCls,
    className,
    percent,
    children,
    size,
    trackWidth,
  };

  return mode === "circle" ? (
    <ProgressCircle {...circleProps} />
  ) : (
    <ProgressBar {...barProps} />
  );
};

Progress.defaultProps = {
  prefixCls: "r-progress",
  percent: 0,
  position: "fixed",
  unfilled: true,
  appearTransition: false,
  size: 50,
  trackWidth: 3,
  mode: "bar",
};

export default Progress;

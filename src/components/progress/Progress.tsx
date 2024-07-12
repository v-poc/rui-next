import React from "react";
import type { CSSProperties, ReactNode } from "react";
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
const Progress: React.FC<ProgressProps> = (props) => {
  const {
    prefixCls = "r-progress",
    className,
    style = {},
    barStyle = {},
    percent = 0,
    position = "fixed",
    unfilled = true,
    appearTransition = false,
    children,
    size = 50,
    trackWidth = 3,
    mode = "bar",
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

export default Progress;

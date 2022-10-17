import React, { useCallback, useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import classnames from "classnames";

// ProgressBarProps Type
export type ProgressBarProps = {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties; // the style of container
  barStyle?: CSSProperties; // the style of bar
  percent?: number; // the percent value of progress
  position?: "fixed" | "normal"; // the position of progress bar
  unfilled?: boolean; // whether to fill unfinished part of progress
  appearTransition?: boolean;
};

// ProgressBar FC
const ProgressBar: React.FC<ProgressBarProps> = (props) => {
  const barRef = useRef<HTMLDivElement>(null);
  let noAppearTransition = false;

  const {
    className,
    prefixCls,
    position,
    unfilled,
    style = {},
    barStyle = {},
    appearTransition,
    percent,
  } = props;

  useEffect(() => {
    noAppearTransition = true;

    if (appearTransition) {
      setTimeout(() => {
        if (barRef && barRef.current) {
          barRef.current.style.width = `${percent}%`;
        }
      }, 10);
    }
  }, []);

  // get percent style
  const percentStyle = useCallback(
    () => ({
      width: noAppearTransition || !appearTransition ? `${percent}%` : 0,
      height: 0,
    }),
    [noAppearTransition, appearTransition, percent]
  );

  const wrapCls = classnames(`${prefixCls}-outer`, className, {
    [`${prefixCls}-fixed-outer`]: position === "fixed",
    [`${prefixCls}-hide-outer`]: !unfilled,
  });

  return (
    <div
      style={style}
      className={wrapCls}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        ref={barRef}
        className={`${prefixCls}-bar`}
        style={{
          ...barStyle,
          ...percentStyle(),
        }}
      />
    </div>
  );
};

ProgressBar.defaultProps = {
  prefixCls: "r-progress",
  percent: 0,
  position: "fixed",
  unfilled: true,
  appearTransition: false,
};

export default ProgressBar;

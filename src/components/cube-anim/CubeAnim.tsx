import React from "react";
import type { CSSProperties, ReactNode } from "react";

// CubeAnimProps type
export type CubeAnimProps = {
  prefixCls?: string;
  scale?: number;
  front?: ReactNode;
  back?: ReactNode;
  top?: ReactNode;
  bottom?: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
};

// CubeAnim FC
export const CubeAnim: React.FC<CubeAnimProps> = (props) => {
  const { prefixCls, scale, front, back, top, bottom, left, right } = props;

  const cubeStyle: CSSProperties = {};
  if (scale !== 1) {
    cubeStyle["transform"] = `scale(${scale})`;
  }

  return (
    <div className={`${prefixCls}-wrapper`}>
      <div className={prefixCls} style={cubeStyle}>
        <ul>
          <li className="front">
            {front}
          </li>
          <li className="back">
            {back}
          </li>
          <li className="top">
            {top}
          </li>
          <li className="bottom">
            {bottom}
          </li>
          <li className="left">
            {left}
          </li>
          <li className="right">
            {right}
          </li>
        </ul>
      </div>
    </div>
  );
};

CubeAnim.defaultProps = {
  prefixCls: "r-cube",
  scale: 1,
  front: "Front",
  back: "Back",
  top: "Top",
  bottom: "Bottom",
  left: "Left",
  right: "Right",
};

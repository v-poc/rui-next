import React, { useState } from "react";
import type { CSSProperties } from "react";
import classnames from "classnames";

type StyleProps = CSSProperties & {
  "--delay"?: number;
  "--heart-color"?: string;
  // "transform"?: string;
  "--line-count"?: number;
  "--line-index"?: number;
  // "backgroundColor"?: string;
};

// LikeButtonProps type
export type LikeButtonProps = {
  prefixCls?: string;
  className?: string;
  delay?: number; // unit (ms)
  scale?: number;
  heartColor?: string;
  lineColors?: string[];
  callback?: () => void;
};

// LikeButton FC
export const LikeButton: React.FC<LikeButtonProps> = props => {
  const {
    prefixCls,
    className,
    delay,
    scale = 1,
    heartColor,
    lineColors = [],
    callback,
  } = props;

  const [isAddCls, setIsAddCls] = useState(false);

  const btnStyle: StyleProps = {
    "--delay": delay,
    "--heart-color": heartColor,
  };
  if (scale !== 1) {
    btnStyle["transform"] = `scale(${scale})`;
  }

  const cls = classnames(`${prefixCls}-btn`, className, {
    "focus-btn": isAddCls,
  });

  const onClickButton = () => {
    setIsAddCls(true);
    setTimeout(() => {
      setIsAddCls(false);
      if (typeof callback === "function") {
        callback();
      }
    }, delay);
  };

  const particleStyle: StyleProps = {
    "--line-count": lineColors.length,
  };

  const particleItemStyle = (i: number) => ({
    "--line-index": i,
    backgroundColor: lineColors[i],
  });

  return (
    <div className={`${prefixCls}-container`}>
      <div className={cls} style={btnStyle} onClick={onClickButton}>
        <div className={`${prefixCls}-wrapper`}>
          <div className={`${prefixCls}-ripple`}></div>
          <svg
            className={`${prefixCls}-heart`}
            width={24}
            height={24}
            viewBox="0 0 24 24"
          >
            <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"></path>
          </svg>
          <div className={`${prefixCls}-particle`} style={particleStyle}>
            {new Array(lineColors.length)
              .fill("")
              .map((_: string, index: number) => (
                <div
                  key={`item${index}`}
                  className={`${prefixCls}-particle-item`}
                  style={particleItemStyle(index)}
                ></div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

LikeButton.defaultProps = {
  prefixCls: "r-btn-like",
  delay: 500,
  heartColor: "#F66",
  lineColors: ["#F66", "#66F", "#F90", "#09F", "#9C3", "#3C9"],
};

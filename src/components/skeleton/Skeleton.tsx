import React, { ReactNode } from "react";
import classnames from "classnames";

const SKELETON_WIDTH = {
  DEFAULT_TITLE: "40%",
  DEFAULT_ROW: "100%",
  LAST_ROW: "60%",
};

// SkeletonProps Type
export type SkeletonProps = {
  prefixCls?: string;
  loading?: boolean;
  avatar?: boolean;
  avatarSize?: string;
  children?: ReactNode;
  title?: boolean;
  titleWidth?: number | string;
  row?: number;
  rowWidth?: number | string | number[] | string[];
};

// Skeleton FC
const Skeleton: React.FC<SkeletonProps> = (props) => {
  const {
    prefixCls,
    children,
    loading,
    avatar,
    avatarSize,
    title,
    titleWidth,
    row,
    rowWidth,
  } = props;

  // avatar css class
  const avatarCls = classnames(prefixCls, "r-skeleton-avatar", {
    "r-skeleton-avatar-large": avatarSize === "lg",
    "r-skeleton-avatar-small": avatarSize === "sm",
  });

  // title width style
  const titleWidthStyle = () => {
    return {
      width: getTitleWidth(),
    };
  };

  // get title width
  const getTitleWidth = () => {
    if (titleWidth) {
      return typeof titleWidth === "number" ? `${titleWidth}%` : titleWidth;
    }
    return SKELETON_WIDTH.DEFAULT_TITLE;
  };

  // get row width
  const getRowWidth = (index: number) => {
    if (rowWidth) {
      if (Array.isArray(rowWidth)) {
        return typeof rowWidth[index] === "number"
          ? `${rowWidth[index]}%`
          : rowWidth[index];
      } else {
        return typeof rowWidth === "number" ? `${rowWidth}%` : rowWidth;
      }
    }
    return SKELETON_WIDTH.DEFAULT_ROW;
  };

  // row width style
  const rowWidthStyle = (index: number) => {
    return {
      width: index === row ? SKELETON_WIDTH.LAST_ROW : getRowWidth(index - 1),
    };
  };

  return loading ? (
    <div className={prefixCls}>
      {avatar && <div className={avatarCls}></div>}
      <div className={`${prefixCls}-content`}>
        {title && (
          <h4 className={`${prefixCls}-title`} style={titleWidthStyle()}></h4>
        )}
        {new Array(row).fill("").map((_, index) => (
          <div
            className={`${prefixCls}-row`}
            key={`row${index}`}
            style={rowWidthStyle(index + 1)}
          ></div>
        ))}
      </div>
    </div>
  ) : (
    <div>{children}</div>
  );
};

Skeleton.defaultProps = {
  prefixCls: "r-skeleton",
  loading: true,
  avatar: false,
  avatarSize: "md",
  title: false,
  titleWidth: SKELETON_WIDTH.DEFAULT_TITLE,
  row: 3,
  rowWidth: SKELETON_WIDTH.DEFAULT_ROW,
};

export default Skeleton;

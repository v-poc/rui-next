import React from "react";
import type { CSSProperties, ReactNode } from "react";
import classnames from "classnames";

// BadgeProps type
export type BadgeProps = {
  prefixCls?: string;
  className?: string;
  children?: ReactNode;
  style?: CSSProperties;
  hot?: boolean;
  size?: "large" | "small";
  overflowcount?: number;
  corner?: boolean;
  dot?: boolean;
  text?: any;
};

// Badge FC
export const Badge: React.FC<BadgeProps> = (props) => {
  const {
    className,
    prefixCls,
    children,
    // text,
    size,
    // overflowcount,
    dot,
    corner,
    hot,
    ...restProps
  } = props;

  let { text, overflowcount } = props;

  overflowcount = overflowcount as number;

  if (dot) {
    text = ""; // dot mode don't need text
  }

  if (typeof text === "number" && text > overflowcount) {
    text = `${overflowcount}+`; // overflow count
  }

  const scrollNumberCls = classnames({
    [`${prefixCls}-dot`]: dot,
    [`${prefixCls}-dot-large`]: dot && size === "large",
    [`${prefixCls}-text`]: !dot && !corner,
    [`${prefixCls}-corner`]: corner,
    [`${prefixCls}-corner-large`]: corner && size === "large",
  });

  const wrapCls = classnames(prefixCls, className, {
    [`${prefixCls}-not-a-wrapper`]: !children,
    [`${prefixCls}-corner-wrapper`]: corner,
    [`${prefixCls}-hot`]: !!hot,
    [`${prefixCls}-corner-wrapper-large`]: corner && size === "large",
  });

  return (
    <span className={wrapCls}>
      {children}
      {(text || dot) && (
        <sup className={scrollNumberCls} {...restProps}>
          {text}
        </sup>
      )}
    </span>
  );
};

Badge.defaultProps = {
  prefixCls: "r-badge",
  size: "small",
  overflowcount: 99,
  dot: false,
  corner: false,
};

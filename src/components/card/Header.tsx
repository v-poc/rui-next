import React from "react";
import type { CSSProperties, ReactNode } from "react";
import classnames from "classnames";

// CardHeaderProps Type
export type CardHeaderProps = {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  thumbStyle?: CSSProperties;
  title?: ReactNode;
  thumb?: ReactNode; // needs img url if thumb is string
  extra?: ReactNode;
};

// CardHeader FC
const CardHeader: React.FC<CardHeaderProps> = (props) => {
  const {
    prefixCls = "r-card",
    className,
    title,
    thumb,
    thumbStyle = {},
    extra,
    ...restProps
  } = props;

  const wrapCls = classnames(`${prefixCls}-header`, className);

  return (
    <div className={wrapCls} {...restProps}>
      <div className={`${prefixCls}-header-content`}>
        {typeof thumb === "string" ? (
          <img src={thumb} style={thumbStyle} />
        ) : (
          thumb
        )}
        {title}
      </div>
      {extra && <div className={`${prefixCls}-header-extra`}>{extra}</div>}
    </div>
  );
};

export default CardHeader;

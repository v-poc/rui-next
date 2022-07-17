import React from "react";
import classnames from "classnames";
import CarouselCircle from "./CarouselCircle";
import CarouselRect from "./CarouselRect";

// ActivityIndicatorProps Type
export type ActivityIndicatorProps = {
  prefixCls?: string;
  className?: string;
  animating?: boolean;
  carousel?: "circle" | "rect";
  panelColor?: string;
  toast?: boolean;
  sizeType?: "large" | "small";
  size?: number;
  text?: string;
  color?: "default" | "primary" | "white" | string;
};

// ActivityIndicator FC
const ActivityIndicator: React.FC<ActivityIndicatorProps> = (props) => {
  const {
    prefixCls,
    className,
    animating,
    carousel,
    toast,
    sizeType,
    size,
    text,
    color,
  } = props;

  const wrapCls = classnames(
    prefixCls,
    className,
    {
      [`${prefixCls}-lg`]: sizeType === 'large',
      [`${prefixCls}-sm`]: sizeType === 'small',
      [`${prefixCls}-toast`]: !!toast,
    }
  );

  const spinnerCls = classnames(
    `${prefixCls}-spinner`,
    {
      [`${prefixCls}-spinner-lg`]: !!toast || sizeType === 'large',
    }
  );

  if (carousel === "circle") {
    return (
      <CarouselCircle
        size={size}
        color={color}
      />
    );
  }

  if (carousel === "rect") {
    return (
      <CarouselRect
        color={color}
      />
    );
  }

  if (!animating) {
    return null;
  }

  if (toast) {
    return (
      <div className={wrapCls}>
        {text ? (
          <div className={`${prefixCls}-content`}>
            <span className={spinnerCls} aria-hidden="true" />
            <span className={`${prefixCls}-toast`}>{text}</span>
          </div>
        ) : (
          <div className={`${prefixCls}-content`}>
            <span className={spinnerCls} aria-label="Loading" />
          </div>
        )}
      </div>
    );
  }
  
  return text ? (
    <div className={wrapCls}>
      <span className={spinnerCls} aria-hidden="true" />
      <span className={`${prefixCls}-tip`}>{text}</span>
    </div>
  ) : (
    <div className={wrapCls}>
      <span className={spinnerCls} aria-label="loading" />
    </div>
  );
};

ActivityIndicator.defaultProps = {
  prefixCls: "r-activity-indicator",
  animating: true,
  sizeType: "small",
  size: 30,
  panelColor: "rgba(34, 34, 34, .6)",
  toast: false,
};

export default ActivityIndicator;

import React, { useEffect, HTMLProps, MouseEventHandler } from "react";
import classnames from "classnames";
import loadSprite from "../utils/loadSprite";

// SvgProps
export type SvgProps = Omit<
  HTMLProps<SVGSVGElement>,
  "size" | "type" | "crossOrigin"
>;

// IconProps Type
export type IconProps = SvgProps & {
  prefixCls?: string;
  className?: string;
  size?: "xxs" | "xs" | "sm" | "md" | "lg";
  type: string;
  color?: string;
  onClick?: MouseEventHandler<SVGSVGElement>;
};

// Icon FC
const Icon: React.FC<IconProps> = (props) => {
  // useEffect hook
  useEffect(() => loadSprite(), []);

  const {
    type,
    prefixCls = "r-icon",
    className,
    size = "md",
    ...restProps
  } = props;

  const wrapCls = classnames(
    prefixCls,
    className,
    `${prefixCls}-${type}`,
    `${prefixCls}-${size}`
  );

  return (
    <svg className={wrapCls} {...restProps}>
      <use xlinkHref={`#${type}`} />
    </svg>
  );
};

export default Icon;

import React, { ReactNode } from "react";
import classnames from "classnames";

// WhiteSpaceProps Type
export type WhiteSpaceProps = {
  prefixCls?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  style?: React.CSSProperties;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  children?: ReactNode;
  vertical?: boolean; // vertical or horizontal
};

// WhiteSpace FC
const WhiteSpace: React.FC<WhiteSpaceProps> = (props) => {
  const {
    prefixCls,
    size,
    className,
    style,
    onClick,
    children,
    vertical = true,
  } = props;

  const _cls = prefixCls || (vertical ? "r-whitespace" : "r-wingblank");
  const _size = size || (vertical ? "md" : "lg");

  const wrapCls = classnames(
    _cls,
    `${_cls}-${_size}`,
    className
  );

  return (
    <div
      className={wrapCls}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default WhiteSpace;

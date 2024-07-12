import React, { ReactNode } from "react";
import classnames from "classnames";

// NavBarProps Type
export type NavBarProps = {
  prefixCls?: string;
  className?: string;
  children?: ReactNode;
  mode?: "dark" | "light";
  icon?: ReactNode;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  onLeftClick?: () => void;
};

// NavBar FC
const NavBar: React.FC<NavBarProps> = (props) => {
  const {
    mode = "dark",
    icon,
    leftContent,
    rightContent,
    onLeftClick = () => {},
    prefixCls = "r-navbar",
    className,
    children,
    ...restProps
  } = props;

  const wrapCls = classnames(prefixCls, className, `${prefixCls}-${mode}`);

  return (
    <div className={wrapCls} {...restProps}>
      <div className={`${prefixCls}-left`} role="button" onClick={onLeftClick}>
        {icon && (
          <span className={`${prefixCls}-left-icon`} aria-hidden="true">
            {icon}
          </span>
        )}
        {leftContent}
      </div>
      <div className={`${prefixCls}-title`}>{children}</div>
      <div className={`${prefixCls}-right`}>{rightContent}</div>
    </div>
  );
};

export default NavBar;

import React, { ReactNode, MouseEvent } from "react";
import classnames from "classnames";
import Icon from "../icon/index";

// ListItemProps Type
export type ListItemProps = {
  prefixCls?: string;
  className?: string;
  arrow?: boolean | ReactNode;
  children?: ReactNode;
  clickable?: boolean;
  description?: ReactNode;
  disabled?: boolean;
  extra?: ReactNode;
  prefix?: ReactNode;
  title?: ReactNode;
  onClick?: (e: MouseEvent) => void;
};

// ListItem FC
const ListItem: React.FC<ListItemProps> = (props) => {
  const {
    prefixCls,
    className,
    arrow,
    children,
    clickable,
    description,
    disabled,
    extra,
    prefix,
    title,
    onClick,
  } = props;

  const isClickable = clickable || !!onClick;
  const vArrow = arrow !== undefined ? arrow : isClickable;

  const handleClick = (e: MouseEvent) => {
    if (disabled) {
      return;
    }

    if (typeof onClick === "function") {
      onClick(e);
    }
  };

  const renderContent = (
    <div
      className={`${prefixCls}-content`}
    >
      {prefix && (
        <div
          className={`${prefixCls}-content-prefix`}
        >
          {prefix}
        </div>
      )}
      <div className={`${prefixCls}-content-main`}>
        {title && (
          <div
            className={`${prefixCls}-content-main-title`}
          >
            {title}
          </div>
        )}
        {children}
        {description && (
          <div
            className={`${prefixCls}-content-main-desc`}
          >
            {description}
          </div>
        )}
      </div>
      {extra && (
        <div
          className={`${prefixCls}-content-extra`}
        >
          {extra}
        </div>
      )}
      {vArrow && (
        <div
          className={`${prefixCls}-content-arrow`}
        >
          {vArrow === true
            ? <Icon type="right" />
            : vArrow}
        </div>
      )}
    </div>
  );

  const wrapCls = classnames(
    prefixCls,
    {
      [`${prefixCls}-plain-anchor`]: isClickable,
      [`${prefixCls}-disabled`]: disabled,
    },
  );

  return isClickable ? (
    <a
      className={wrapCls}
      onClick={handleClick}
    >
      {renderContent}
    </a>
  ): (
    <div
      className={wrapCls}
      onClick={handleClick}
    >
      {renderContent}
    </div>
  );
};

ListItem.defaultProps = {
  prefixCls: "r-list-item",
};

export default ListItem;

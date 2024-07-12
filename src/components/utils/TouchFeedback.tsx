import React, { useEffect, useState, cloneElement } from "react";
import classnames from "classnames";

// TouchFeedbackProps Type
export type TouchFeedbackProps = {
  disabled?: boolean;
  activeClassName?: string;
  activeStyle?: any;
  children?: any;
};

// TouchFeedback FC
const TouchFeedback = (props: TouchFeedbackProps) => {
  const [active, setActive] = useState<boolean>(false);

  const { activeClassName, activeStyle, disabled = false, children } = props;

  // useEffect hook
  useEffect(() => {
    if (disabled && active) {
      setActive(false);
    }
  }, [disabled, active]);

  // trigger event
  const triggerEvent = (type: string, isActive: boolean, ev: any) => {
    const eventType = `on${type}`;

    if (children.props[eventType]) {
      children.props[eventType](ev);
    }

    if (isActive !== active) {
      setActive(isActive);
    }
  };

  const onTouchStart = (e: React.TouchEvent) =>
    triggerEvent("TouchStart", true, e); // onTouchStart

  const onTouchMove = (e: React.TouchEvent) =>
    triggerEvent("TouchMove", false, e); // onTouchMove

  const onTouchEnd = (e: React.TouchEvent) =>
    triggerEvent("TouchEnd", false, e); // onTouchEnd

  const onTouchCancel = (e: React.TouchEvent) =>
    triggerEvent("TouchCancel", false, e); // onTouchCancel

  const onMouseDown = (e: React.MouseEvent) =>
    triggerEvent("MouseDown", true, e); // onMouseDown

  const onMouseUp = (e: React.MouseEvent) => triggerEvent("MouseUp", false, e); // onMouseUp

  const onMouseLeave = (e: React.MouseEvent) =>
    triggerEvent("MouseLeave", false, e); // onMouseLeave

  // events
  const events = disabled
    ? {}
    : {
        onTouchStart,
        onTouchMove,
        onTouchEnd,
        onTouchCancel,
        onMouseDown,
        onMouseUp,
        onMouseLeave,
      };

  const child = React.Children.only(children);

  if (!disabled && active) {
    let { style, className } = child.props;

    if (activeStyle) {
      style = { ...style, ...activeStyle };
      className = classnames(className, activeClassName);
    }

    return cloneElement(child, {
      className,
      style,
      ...events,
    });
  }

  return cloneElement(child, events);
};

export default TouchFeedback;

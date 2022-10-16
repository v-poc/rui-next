import React, { useMemo } from "react";
import type { ReactNode } from "react";
import classnames from "classnames";
import { ActivityIndicator, AutoJustifyContent, Icon, Mask } from "../index";
import type { MaskProps } from "../mask/index";
import type { PropagationEvent, GetContainer } from "../utils/index";

// ToastProps type
export type ToastProps = {
  prefixCls?: string;
  content?: ReactNode;
  duration?: number;
  getContainer?: GetContainer;
  icon?: "success" | "fail" | "loading" | ReactNode;
  maskClassName?: string;
  maskClickable?: boolean;
  maskStyle?: MaskProps["style"];
  position?: "top" | "bottom" | "center";
  stopPropagation?: PropagationEvent[];
  visible?: boolean;
  afterClose?: () => void;
};

// Toast FC
export const Toast: React.FC<ToastProps> = (props) => {
  const {
    prefixCls,
    content,
    // duration,
    getContainer,
    icon,
    maskClassName,
    maskClickable,
    maskStyle,
    position,
    stopPropagation,
    visible,
    afterClose,
  } = props;

  const topStyle = useMemo(() => {
    let res = "50%";

    if (position === "top") {
      res = "20%";
    } else if (position === "bottom") {
      res = "80%";
    }

    return res;
  }, [position]);

  const iconNode = useMemo(() => {
    if (!icon) {
      return null;
    }

    let res = null;

    switch (icon) {
      case "success":
        res = (
          <Icon
            type="check-circle-o"
            className={`${prefixCls}-icon-success`}
          />
        );
        break;
      case "fail":
        res = (
          <Icon
            type="cross-circle"
            className={`${prefixCls}-icon-fail`}
          />
        );
        break;
      case "loading":
        res = (
          <ActivityIndicator
            sizeType="large"
            className={`${prefixCls}-loading`}
          />
        );
        break;
      default:
        res = icon;
        break;
    };

    return res;
  }, [icon]);

  const maskCls = classnames(
    `${prefixCls}-mask`,
    maskClassName
  );

  const innerCls = classnames(
    `${prefixCls}-main`,
    `${prefixCls}-main-${icon ? "icon" : "text"}`
  );

  return (
    <Mask
      className={maskCls}
      afterClose={afterClose}
      destroyOnClose
      disableBodyScroll={!maskClickable}
      getContainer={getContainer}
      opacity={0}
      stopPropagation={stopPropagation}
      style={{
        pointerEvents: maskClickable ? "none" : "auto",
        ...maskStyle,
      }}
      visible={visible}
    >
      <div className={`${prefixCls}-wrap`}>
        <div
          className={innerCls}
          style={{
            top: topStyle,
          }}
        >
          {iconNode && (
            <div className={`${prefixCls}-icon`}>
              {iconNode}
            </div>
          )}
          <AutoJustifyContent>
            {content}
          </AutoJustifyContent>
        </div>
      </div>
    </Mask>
  );
};

Toast.defaultProps = {
  prefixCls: "r-toast",
  maskClickable: true,
  stopPropagation: ["click"],
};

import React, { useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import classnames from "classnames";
import { useSpring } from "rui-hooks";
import { animated } from "rui-hooks";
import { useUnmountedRef } from "rui-hooks";
import { useLockScroll } from "rui-hooks";
import {
  ShouldRender,
  renderToContainer,
  withStopPropagation,
} from "../utils/index";
import type { GetContainer, PropagationEvent } from "../utils/index";

const opacityData = {
  default: 0.55,
  thin: 0.35,
  thick: 0.75,
};

// MaskProps type
export type MaskProps = {
  prefixCls?: string;
  className?: string;
  children?: ReactNode;
  color?: "black" | "white";
  destroyOnClose?: boolean;
  disableBodyScroll?: boolean;
  forceRender?: boolean;
  getContainer?: GetContainer;
  opacity?: "default" | "thin" | "thick" | number;
  stopPropagation?: PropagationEvent[];
  style?: CSSProperties;
  visible?: boolean;
  afterClose?: () => void;
  afterShow?: () => void;
  onClickMask?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

// Mask FC
export const Mask: React.FC<MaskProps> = (props) => {
  const {
    prefixCls,
    className,
    children,
    color,
    destroyOnClose,
    disableBodyScroll,
    forceRender,
    getContainer,
    opacity,
    stopPropagation = ["click"],
    style,
    visible,
    afterClose,
    afterShow,
    onClickMask,
  } = props;

  const [active, setActive] = useState(visible);
  const rootRef = useRef<HTMLDivElement>(null);

  const unmountedRef = useUnmountedRef();

  useLockScroll(rootRef, visible && disableBodyScroll);

  const background = useMemo(() => {
    const opacityVal =
      typeof opacity === "string" ? opacityData[opacity] : opacity;
    const rgbVal = color === "white" ? "255, 255, 255" : "0, 0, 0";
    return `rgba(${rgbVal}, ${opacityVal || 0})`;
  }, [color, opacity]);

  const wrapStyle = useSpring({
    opacity: visible ? 1 : 0,
    config: {
      precision: 0.01,
      mass: 1,
      tension: 250,
      friction: 30,
      clamp: true,
    },
    onStart: () => setActive(true),
    onRest: () => {
      if (unmountedRef.current) {
        return;
      }
      setActive(visible);
      visible ? afterShow?.() : afterClose?.();
    },
  });

  const wrapCls = classnames(prefixCls, className);

  const renderNode = withStopPropagation(
    stopPropagation,
    <animated.div
      className={wrapCls}
      ref={rootRef}
      style={{
        ...style,
        background,
        opacity: wrapStyle.opacity,
        display: active ? undefined : "none",
      }}
      onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.target === e.currentTarget) {
          onClickMask?.(e);
        }
      }}
    >
      {onClickMask && (
        <div
          className={`${prefixCls}-aria-button`}
          role="button"
          aria-label="Mask"
          onClick={onClickMask}
        ></div>
      )}
      <div className={`${prefixCls}-content`}>{children}</div>
    </animated.div>
  );

  return (
    <ShouldRender
      active={active}
      forceRender={forceRender}
      destroyOnClose={destroyOnClose}
    >
      {renderToContainer(getContainer, renderNode)}
    </ShouldRender>
  );
};

Mask.defaultProps = {
  prefixCls: "r-mask",
  color: "black",
  destroyOnClose: false,
  disableBodyScroll: true,
  forceRender: false,
  getContainer: null,
  opacity: "default",
  stopPropagation: ["click"],
  visible: true,
};

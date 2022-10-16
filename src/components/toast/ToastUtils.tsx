import React from "react";
import { Toast } from "./Toast"
import type { ToastProps} from "./Toast";
import { ImperativeHandler, renderImperatively } from "../utils/index";

let currHandler: ImperativeHandler | null = null;
let currTimer: number | null = null;

const defaultProps = {
  duration: 2000,
  maskClickable: true,
  position: "center",
};

export type ToastShowProps = Omit<ToastProps, "visible">;

export type ToastHandler = {
  close: () => void;
};

type ToastWrapperProps = ToastShowProps & {
  onClose?: () => void;
};

// ToastWrapper FC
const ToastWrapper = (props: ToastWrapperProps) => (
  <Toast {...props} />
);

export const show = (p: ToastShowProps | string) => {
  const opts = typeof p === "string" ? { content: p } : p;
  const props = {
    ...defaultProps,
    ...opts,
  } as any;

  const el = (
    <ToastWrapper
      {...props}
      onClose={() => {
        currHandler = null;
      }}
    />
  );

  if (currHandler) {
    currHandler.replace(el);
  } else {
    currHandler = renderImperatively(el);
  }

  if (currTimer) {
    window.clearTimeout(currTimer);
  }

  const { duration } = props;

  if (duration !== 0) {
    currTimer = window.setTimeout(() => clear(), duration);
  }

  return currHandler as ToastHandler;
};

export const clear = () => {
  currHandler?.close();
  currHandler = null;
};

export const config = (
  v: Pick<ToastProps, "duration" | "maskClickable" | "position">
) => {
  if (v.duration !== undefined) {
    defaultProps.duration = v.duration;
  }

  if (v.maskClickable !== undefined) {
    defaultProps.maskClickable = v.maskClickable;
  }

  if (v.position !== undefined) {
    defaultProps.position = v.position;
  }
};

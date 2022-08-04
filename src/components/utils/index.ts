/* eslint-disable no-console */
import { MutableRefObject } from "react";

// Log info
export const logInfo = (content: any, type = "info"): void => {
  // @ts-ignore
  console[type] && console[type]("[RUI-log] %c%s", "background: #69C;color: #FFF", content);
};

type TargetElement = HTMLElement | Element | Document | Window;

// BasicTarget Type
export type BasicTarget<T = HTMLElement> =
  | (() => T | null)
  | T
  | null
  | MutableRefObject<T | null | undefined>;

// Get target element
export const getTargetElement = (
  target?: BasicTarget<TargetElement>,
  defaultElement?: TargetElement,
): TargetElement | null | undefined => {
  if (!target) {
    return defaultElement;
  }

  let targetElement: TargetElement | null | undefined;

  if (typeof target === "function") {
    targetElement = target();
  } else if ("current" in target) {
    targetElement = target.current;
  } else {
    targetElement = target;
  }

  return targetElement;
};

// Get Data Attributes
export const getDataAttr = (props: { [key: string]: any }) => {
  return Object.keys(props).reduce<{ [key: string]: string }>((prev, key) => {
    const prefix = key.substring(0, 5);
    if (prefix === 'aria-' || prefix === 'data-' || key === 'role') {
      prev[key] = props[key];
    }
    return prev;
  }, {});
};

// Check if we can use DOM
export const canUseDOM = !!(
  typeof window !== "undefined" &&
  typeof document !== "undefined" &&
  window.document &&
  window.document.createElement
);

// Get css length with unit
export const getCSSLength = (v: string | number) => {
  return typeof v === "number" ? `${v}px` : v;
};

// Sort value
export const sortValue = (v: [number, number]): [number, number] => v.sort((a, b) => a - b);

// Find the nearest item from the numbers array
export const getNearest = (arr: number[], targetItem: number) => {
  return arr.reduce((prevItem, currItem) => {
    return Math.abs(prevItem - targetItem) < Math.abs(currItem - targetItem) ? prevItem : currItem;
  });
};

// Get bound
export const getBound = (pos: number, min: number | undefined, max: number | undefined) => {
  let res = pos;

  if (min !== undefined) {
    res = Math.max(pos, min);
  }

  if (max !== undefined) {
    res = Math.min(res, max);
  }
  
  return res;
};

// Attach props to component
export function attachPropsToComp<
  C,
  P extends Record<string, any>
>(
  comp: C,
  props: P
): C & P {
  const ret = comp as any;
  for (const k in props) {
    if (props.hasOwnProperty(k)) {
      ret[k] = props[k];
    }
  }
  return ret;
};

/* eslint-disable no-console */
import React from "react";
import type { DependencyList, MutableRefObject } from "react";

// Log info
export const logInfo = (content: any, type = "info"): void => {
  // @ts-ignore
  console[type] && console[type]("[RUI-log] %c%s", "background: #69C;color: #FFF", content);
};

// Check whether it is string
const isString = (str: any) => {
  return typeof str === "string";
};

// Check whether it contains double-byte characters (zh-CN)
const reDoubleByteChar = /^[\u4e00-\u9fa5]{2}$/;
const isDoubleByteChar = (str: any) => reDoubleByteChar.test(str);

// Insert one space between two `zh-CN` characters automatically
export const insertSpace = (child: any) => {
  if (isString(child.type) && isDoubleByteChar(child.props.children)) {
    return React.cloneElement(
      child,
      {},
      child.props.children.split('').join(' '),
    );
  }
  
  if (isString(child)) {
    if (isDoubleByteChar(child)) {
      child = child.split('').join(' ');
    }
    return (<span>{child}</span>);
  }
  
  return child;
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

// Sleep util function
export const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

// Check if same deps
export function checkIfSameDeps (
  oldDeps: DependencyList,
  deps: DependencyList
): boolean {
  if (oldDeps === deps) {
    return true;
  }

  for (let i = 0; i < oldDeps.length; i++) {
    if (!Object.is(oldDeps[i], deps[i])) {
      return false;
    }
  }
  
  return true;
};

/* eslint-disable no-console */
// Log info
export const logInfo = (content: any, type = "info"): void => {
  // @ts-ignore
  console[type] && console[type]("[RUI-log] %c%s", "background: #69C;color: #FFF", content);
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

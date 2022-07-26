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

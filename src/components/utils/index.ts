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

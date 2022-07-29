import { useMemo, useRef } from "react";

export type noop = (...args: any[]) => any;

function useMemoizedFn<T extends noop>(fn: T) {
  if (typeof fn !== "function") {
    console.warn(`[useMemoizedFn] The param type: ${typeof fn} that is not a function.`);
    return;
  }

  const fnRef = useRef<T>(fn);
  // wrap by useMemo for react devtool issue
  fnRef.current = useMemo(() => fn, [fn]);

  const memoizedFn = useRef<T>();
  if (!memoizedFn.current) {
    memoizedFn.current = function(...args) {
      // eslint-disable-next-line @typescript-eslint/no-invalid-this
      return fnRef.current.apply(this, args);
    } as T;
  }

  return memoizedFn.current;
};

export default useMemoizedFn;

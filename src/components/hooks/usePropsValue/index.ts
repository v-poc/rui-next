import React, { useRef } from "react";
import useMemoizedFn from "../useMemoizedFn/index";
import useUpdate from "../useUpdate/index";

type PropsType<T> = {
  defaultValue?: T; // default value (optional)
  value?: T; // value (optional)
  onChange?: (v: T) => void;
};

const usePropsValue = <T>(props: PropsType<T>) => {
  const { defaultValue, value, onChange } = props; // @ts-ignore
  const valRef = useRef<T>(value !== undefined ? value : defaultValue);

  if (value !== undefined) {
    valRef.current = value;
  }

  const forceReRender = useUpdate();

  const setValue: any = useMemoizedFn(
    (v: React.SetStateAction<T>, forceTrigger: boolean = false) => {
      const nextVal =
        typeof v === "function" ? (v as (prev: T) => T)(valRef.current) : v;

      if (!forceTrigger && nextVal === valRef.current) {
        return;
      }

      valRef.current = nextVal;
      forceReRender();

      return onChange?.(nextVal);
    }
  );

  return [valRef.current, setValue] as const;
};

export default usePropsValue;

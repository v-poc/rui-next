import { useEffect } from "react";
import useLatest from "../useLatest/index";

const useUnmount = (fn: () => void) => {
  if (typeof fn !== "function") {
    console.warn(
      `[useUnmount] The param type: ${typeof fn} that is not a function.`
    );
    return;
  }

  const fnRef = useLatest(fn);

  useEffect(
    // return function
    () => () => {
      fnRef.current();
    },
    []
  );
};

export default useUnmount;

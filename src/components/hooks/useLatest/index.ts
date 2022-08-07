import { useRef } from "react";

function useLatest<T>(val: T) {
  const valRef = useRef(val);
  valRef.current = val;

  return valRef;
};

export default useLatest;

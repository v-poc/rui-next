import { useEffect, useRef } from "react";

const useUnmountedRef = () => {
  const unmountedRef = useRef<boolean>(false);

  useEffect(() => {
    unmountedRef.current = false;

    return () => {
      unmountedRef.current = true;
    };
  }, []);

  return unmountedRef;
};

export default useUnmountedRef;

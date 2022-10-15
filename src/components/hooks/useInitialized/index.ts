import { useRef } from "react";

const useInitialized = (isCheck?: boolean) => {
  const initializedRef = useRef<boolean | undefined>(isCheck);

  if (isCheck) {
    initializedRef.current = true;
  }

  return !!initializedRef.current;
};

export default useInitialized;

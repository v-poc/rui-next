import React, { useEffect, useRef } from "react";
import useInViewport from "../hooks/useInViewport/index";

// LazyloadProps type
type LazyloadProps = {
  onActive?: () => void;
};

// Lazyload FC
export const Lazyload: React.FC<LazyloadProps> = (props) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const [isInViewport] = useInViewport(targetRef);

  useEffect(() => {
    if (isInViewport) {
      props.onActive?.();
    }
  }, [isInViewport]);

  return <div ref={targetRef}></div>;
};

export default Lazyload;

import React, { useState } from "react";
import useEffectWithTarget from "../useEffectWithTarget/index";
import { getTargetElement, sleep } from "../../utils/index";
import type { BasicTarget } from "../../utils/index";

type OptionsType = {
  rootMargin?: string;
  threshold?: number | number[];
  root?: BasicTarget<Element>;
};

const useInViewport = (target: BasicTarget, options?: OptionsType) => {
  const [isInViewport, setIsInViewport] = useState(true);
  const [ratio, setRatio] = useState(1);

  useEffectWithTarget(
    () => {
      const el = getTargetElement(target) as any;
      if (!el) {
        return;
      }

      const observerInstance = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            setIsInViewport(entry.isIntersecting);
            setRatio(entry.intersectionRatio);
          }
        },
        {
          ...options,
          root: getTargetElement(options?.root) as any,
        }
      );

      observerInstance.observe(el);

      return () => {
        observerInstance.disconnect();
      };
    },
    [],
    target
  );

  return [isInViewport, ratio] as const;
};

export default useInViewport;

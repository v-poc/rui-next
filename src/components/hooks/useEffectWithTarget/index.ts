import React, { useEffect, useLayoutEffect, useRef } from "react";
import type { DependencyList, EffectCallback } from "react";
import useUnmount from "../useUnmount/index";
import { checkIfSameDeps, getTargetElement } from "../../utils/index";
import type { BasicTarget } from "../../utils/index";

type TargetType = BasicTarget<any> | BasicTarget<any>[];

const useEffectWithTarget = (
  useEffectType: typeof useEffect | typeof useLayoutEffect
) => {
  const fn = (
    effectFn: EffectCallback,
    deps: DependencyList,
    target: TargetType
  ) => {
    const isInitRef = useRef<boolean>(false);
    const lastElementsRef = useRef<any[]>([]);
    const lastDepsRef = useRef<DependencyList>([]);
    const unloadRef = useRef<any>();

    useEffectType(() => {
      const targets = Array.isArray(target) ? target : [target];
      const elements = targets.map((item: TargetType) =>
        getTargetElement(item)
      );

      if (!isInitRef.current) {
        isInitRef.current = true;
        lastElementsRef.current = elements;
        lastDepsRef.current = deps;
        unloadRef.current = effectFn();
        return;
      }

      if (
        elements.length !== lastElementsRef.current.length ||
        !checkIfSameDeps(elements, lastElementsRef.current) ||
        !checkIfSameDeps(deps, lastDepsRef.current)
      ) {
        unloadRef.current?.();
        lastElementsRef.current = elements;
        lastDepsRef.current = deps;
        unloadRef.current = effectFn();
      }
    });

    useUnmount(() => {
      unloadRef.current?.();
      isInitRef.current = false;
    });
  };

  return fn;
};

export default useEffectWithTarget(useEffect);

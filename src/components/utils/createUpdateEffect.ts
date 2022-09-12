import { useEffect, useLayoutEffect, useRef } from "react";

type EffectHookType = typeof useEffect | typeof useLayoutEffect;

type CreateUpdateEffectType = (h: EffectHookType) => EffectHookType;

const createUpdateEffect: CreateUpdateEffectType = (h) => (effect, deps) => {
  const isMounted = useRef(false);

  h(() => () => {
    isMounted.current = false;
  }, []);

  h(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      return effect();
    }
  }, deps);
};

export default createUpdateEffect;

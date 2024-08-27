/*
 * Inspired by @react-spring | MIT License (https://github.com/pmndrs/react-spring)
 */
import React, {
  useEffect,
  useRef,
  useState,
  useContext,
  PropsWithChildren,
} from "react";

// useMemoOne hook
type Cache<T> = {
  inputs?: any[];
  result?: T;
};

function useMemoOne<T>(getResult: () => T, inputs?: any[]): T {
  const [initial] = useState(
    (): Cache<T> => ({
      inputs,
      result: getResult(),
    })
  );

  const committed = useRef<Cache<T>>();
  const prevCache = committed.current;

  let cache = prevCache;
  if (cache) {
    const useCache = Boolean(
      inputs && cache.inputs && areInputsEqual(inputs, cache.inputs)
    );
    if (!useCache) {
      cache = {
        inputs,
        result: getResult(),
      };
    }
  } else {
    cache = initial;
  }

  useEffect(() => {
    committed.current = cache;
    if (prevCache == initial) {
      initial.inputs = initial.result = undefined;
    }
  }, [cache]);

  return cache.result!;
}

function areInputsEqual(next: any[], prev: any[]) {
  if (next.length !== prev.length) {
    return false;
  }
  for (let i = 0; i < next.length; i++) {
    if (next[i] !== prev[i]) {
      return false;
    }
  }
  return true;
}

/**
 * This context affects all new and existing `SpringValue` objects
 * created with the hook API or the renderprops API.
 */
export interface SpringContext {
  /** Pause all new and existing animations. */
  pause?: boolean;
  /** Force all new and existing animations to be immediate. */
  immediate?: boolean;
}

export const SpringContext = ({
  children,
  ...props
}: PropsWithChildren<SpringContext>) => {
  const inherited = useContext(ctx);

  // Inherited values are dominant when truthy.
  const pause = props.pause || !!inherited.pause,
    immediate = props.immediate || !!inherited.immediate;

  // Memoize the context to avoid unwanted renders.
  props = useMemoOne(() => ({ pause, immediate }), [pause, immediate]);

  const { Provider } = ctx;
  return <Provider value={props}>{children}</Provider>;
};

const ctx = makeContext(SpringContext, {} as SpringContext);

// Allow `useContext(SpringContext)` in TypeScript.
SpringContext.Provider = ctx.Provider;
SpringContext.Consumer = ctx.Consumer;

/** Make the `target` compatible with `useContext` */
function makeContext<T>(target: any, init: T): React.Context<T> {
  Object.assign(target, React.createContext(init));
  target.Provider._context = target;
  target.Consumer._context = target;
  return target;
}

export default SpringContext;

import { useCallback, useRef, useState } from "react";
import useUnmount from "../useUnmount/index";
import { BasicTarget, getTargetElement } from "../../utils/index";
import screenfull from "../../utils/screenfull";

export type Options = {
  onExitFull?: () => void;
  onFull?: () => void;
};

const useFullscreen = (target: BasicTarget, options?: Options) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean | undefined>(false);
  const { onExitFull, onFull } = options || {};

  const onExitFullRef = useRef(onExitFull);
  onExitFullRef.current = onExitFull;

  const onFullRef = useRef(onFull);
  onFullRef.current = onFull;

  // onChange event
  const onChange = useCallback(() => {
    if (screenfull.isEnabled) {
      if (screenfull.isFullscreen) {
        onFullRef.current && onFullRef.current();
      } else {
        screenfull.off?.("change", onChange);
        onExitFullRef.current && onExitFullRef.current();
      }

      setIsFullscreen(screenfull.isFullscreen);
    }
  }, []);

  // setFull event
  const setFull = useCallback(() => {
    const el = getTargetElement(target);
    if (!el) {
      return;
    }

    if (screenfull.isEnabled) {
      try {
        screenfull.request?.(el as HTMLElement);
        screenfull.on?.("change", onChange);
      } catch (e) {
        console.error(e);
      }
    }
  }, [target, onChange]);

  // exitFull event
  const exitFull = useCallback(() => {
    // if already exit fullscreen state
    if (!isFullscreen) {
      return;
    }

    if (screenfull.isEnabled) {
      screenfull.exit?.();
    }
  }, [isFullscreen]);

  // toggleFull event
  const toggleFull = useCallback(() => {
    if (isFullscreen) {
      exitFull();
    } else {
      setFull();
    }
  }, [isFullscreen, exitFull, setFull]);

  // useUnmount hook
  useUnmount(() => {
    if (screenfull.isEnabled) {
      screenfull.off?.("change", onChange);
    }
  });

  return [
    isFullscreen,
    {
      setFull,
      exitFull,
      toggleFull,
    },
  ] as const;
};

export default useFullscreen;

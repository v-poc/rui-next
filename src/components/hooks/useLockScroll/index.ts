import React, { useEffect } from "react";
import useTouch from "../useTouch/index";
import { getScrollParent, supportsPassive } from "../../utils/index";

let totalCount = 0; // total lock count

const useLockScroll = (
  rootRef: React.RefObject<HTMLElement>,
  shouldLock: boolean | undefined
) => {
  const CLS_LOCK = "r-overflow-hidden";
  const touch = useTouch();

  const onTouchMove = (e: TouchEvent) => {
    touch.move(e);

    const directionStatus = touch.deltaY.current > 0 ? "10" : "01";
    const el = getScrollParent(e.target as Element, rootRef.current) as HTMLElement;
    if (!el) {
      return;
    }

    let status = "11";
    const { scrollHeight, offsetHeight, scrollTop } = el;

    if (scrollTop === 0) {
      status = offsetHeight >= scrollHeight ? "00" : "01";
    } else if (scrollTop + offsetHeight >= scrollHeight) {
      status = "10";
    }

    if (
      status != "11" &&
      touch.isVertical() &&
      !(parseInt(status, 2) & parseInt(directionStatus, 2)) &&
      e.cancelable
    ) {
      e.preventDefault();
    }
  };

  const lock = () => {
    document.addEventListener("touchstart", touch.start);
    document.addEventListener(
      "touchmove",
      onTouchMove,
      supportsPassive ? { passive: false } : false
    );

    if (!totalCount) {
      document.body.classList.add(CLS_LOCK);
    }

    totalCount++;
  };

  const unlock = () => {
    if (totalCount) {
      document.removeEventListener("touchstart", touch.start);
      document.removeEventListener("touchmove", onTouchMove);

      totalCount--;

      if (totalCount === 0) {
        document.body.classList.remove(CLS_LOCK);
      }
    }
  };

  useEffect(() => {
    if (shouldLock) {
      lock();

      return () => {
        unlock();
      };
    }
  }, [shouldLock]);
};

export default useLockScroll;

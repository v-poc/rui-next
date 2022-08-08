import { useRef } from "react";
import useEventListener from "../useEventListener/index";
import { BasicTarget, getTargetElement } from "../../utils/index";

const useClickAway = (
  onClickAway: (event: MouseEvent | TouchEvent) => void,
  target: BasicTarget | BasicTarget[],
  eventName: string = "click",
) => {
  const onClickAwayRef = useRef(onClickAway);
  onClickAwayRef.current = onClickAway;

  const handler = (event: any) => {
    const arrTargets = Array.isArray(target) ? target : [target];
    const isContain = arrTargets.some((item) => {
      const targetEl = getTargetElement(item) as HTMLElement;
      return !targetEl || targetEl?.contains(event.target);
    });

    if (isContain) {
      return;
    }

    onClickAwayRef.current(event);
  };

  useEventListener(
    eventName,
    handler,
    {
      target: () => document,
    }
  );
};

export default useClickAway;

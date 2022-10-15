import { useRef } from "react";

const MIN_NUM = 10;

const getDirection = (x: number, y: number) => {
  if (x > y && x > MIN_NUM) {
    return "horizontal";
  }

  if (y > x && y > MIN_NUM) {
    return "vertical";
  }

  return "";
};

type DirectionType = "" | "vertical" | "horizontal";

const useTouch = () => {
  const startXRef = useRef<number>(0);
  const startYRef = useRef<number>(0);
  const deltaXRef = useRef<number>(0);
  const deltaYRef = useRef<number>(0);
  const offsetXRef = useRef<number>(0);
  const offsetYRef = useRef<number>(0);
  const directionRef = useRef<DirectionType>("");

  const isV = () => directionRef.current === "vertical";

  const isH = () => directionRef.current === "horizontal";

  const reset = () => {
    deltaXRef.current = 0;
    deltaYRef.current = 0;
    offsetXRef.current = 0;
    offsetYRef.current = 0;
    directionRef.current = "";
  };

  const start = ((e: TouchEvent) => {
    reset();
    startXRef.current = e.touches[0].clientX;
    startYRef.current = e.touches[0].clientY;
  }) as EventListener;

  const move = ((e: TouchEvent) => {
    const touchItem = e.touches[0];
    deltaXRef.current = touchItem.clientX < 0 ? 0 : touchItem.clientX - startXRef.current;
    deltaYRef.current = touchItem.clientY - startYRef.current;
    offsetXRef.current = Math.abs(deltaXRef.current);
    offsetYRef.current = Math.abs(deltaYRef.current);

    if (!directionRef.current) {
      directionRef.current = getDirection(offsetXRef.current, offsetYRef.current);
    }
  }) as EventListener;

  return {
    startX: startXRef,
    startY: startYRef,
    deltaX: deltaXRef,
    deltaY: deltaYRef,
    offsetX: offsetXRef,
    offsetY: offsetYRef,
    direction: directionRef,
    move,
    reset,
    start,
    isVertical: isV,
    isHorizontal: isH,
  };
};

export default useTouch;

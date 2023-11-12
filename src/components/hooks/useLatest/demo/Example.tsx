import React, { useRef, useState } from "react";
import { useLatest, Button, Divider } from "../../../index";

// Example FC
const Example = () => {
  const [isStart, setIsStart] = useState(false);
  const [count, setCount] = useState(0);
  const [refCount, setRefCount] = useState(0);
  const countRef = useLatest(refCount);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const handleClick = () => {
    if (!isStart) {
      timerRef.current = setInterval(() => {
        setCount(count + 1);
        setRefCount(countRef.current + 1);
      }, 1000);
      setIsStart(true);
    } else {
      clearInterval(timerRef.current);
      setCount(0);
      setRefCount(0);
      setIsStart(false);
    }
  };

  return (
    <>
      <Divider contentAlign="left">Count by useState: {count}</Divider>
      <Divider contentAlign="left">
        Count by <strong>useLatest</strong>: {refCount}
      </Divider>
      <br />
      <Button size="small" inline onClick={handleClick}>
        {isStart ? "Stop" : "Start"} testing
      </Button>
      <br />
      <br />
    </>
  );
};

export default Example;

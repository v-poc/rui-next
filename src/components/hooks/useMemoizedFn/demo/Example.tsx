import React, { useCallback, useRef, useState } from "react";
import { useMemoizedFn, Button, Divider } from "../../../index";
import { logInfo } from "../../../experimental";

type SubCompType = {
  flag: "useCallback" | "useMemoizedFn";
  logCount?: () => void;
};

// SubComponent
const SubComp = React.memo<SubCompType>((props) => {
  const { flag, logCount } = props;
  const countRenderRef = useRef(0);
  countRenderRef.current++;

  if (countRenderRef.current > 1) {
    logInfo(`${flag} cause SubComponent re-render: ${countRenderRef.current}`);
  }

  return (
    <>
      <p>
        Current SubComponent - renderCount:{" "}
        <strong>{countRenderRef.current}</strong>
      </p>
      <br />
      <Button type="ghost" size="small" inline onClick={logCount}>
        Click to show the count of ParentComponent
      </Button>
    </>
  );
});

// Example FC - ParentComponent
const Example = () => {
  const [count, setCount] = useState(0); // the count of ParentComponent

  const callbackFn = useCallback(() => {
    logInfo(`useCallback - current count of ParentComponent is ${count}`);
  }, [count]);

  const memoizedFn = useMemoizedFn(() => {
    logInfo(`useMemoizedFn - current count of ParentComponent is ${count}`);
  });

  return (
    <>
      <p>Current ParentComponent - count: {count}</p>
      <br />
      <Button size="small" inline onClick={() => setCount((c) => c + 1)}>
        Click to view the <strong>re-render</strong> of SubComponent
      </Button>
      <br />
      <br />
      <Divider>
        Pass prop to SubComponent by <strong>useCallback</strong>
      </Divider>
      <SubComp flag="useCallback" logCount={callbackFn} />
      <br />
      <br />
      <Divider>
        Pass prop to SubComponent by <strong>useMemoizedFn</strong>
      </Divider>
      <SubComp flag="useMemoizedFn" logCount={memoizedFn} />
    </>
  );
};

export default Example;

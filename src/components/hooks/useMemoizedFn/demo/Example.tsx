import React, { useCallback, useRef, useState } from "react";
import { Button, Divider } from "rui-next";
import { useMemoizedFn } from "rui-hooks";

type SubCompType = {
  logCount?: () => void;
};

// SubComponent
const SubComp = React.memo<SubCompType>((props) => {
  const { logCount } = props;
  const countRenderRef = useRef(0);
  countRenderRef.current++;

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
    console.log(`useCallback - current count is ${count}`);
  }, [count]);

  const memoizedFn = useMemoizedFn(() => {
    console.log(`useMemoizedFn - current count is ${count}`);
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
      <SubComp logCount={callbackFn} />
      <br />
      <br />
      <Divider>
        Pass prop to SubComponent by <strong>useMemoizedFn</strong>
      </Divider>
      <SubComp logCount={memoizedFn} />
    </>
  );
};

export default Example;

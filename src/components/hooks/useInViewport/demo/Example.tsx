import React, { useRef, useState } from "react";
import { useInViewport, Button, Divider } from "rui-next";
import "./index.less";

// Example FC
const Example = () => {
  const [height, setHeight] = useState("auto");
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  const [isInViewport, ratio] = useInViewport(targetRef.current, {
    threshold: [0, 0.25, 0.5, 0.75, 1],
    root: containerRef.current,
  });

  const wrapStyle = {
    color: isInViewport ? "green" : "red",
  };

  return (
    <>
      <Divider contentAlign="left">
        Observe the visible area ratio of element target
      </Divider>
      <Button
        type="default"
        inline
        size="small"
        onClick={() => setHeight("500px")}
      >
        Test scroll within viewport
      </Button>
      <br />
      <br />
      <div ref={containerRef} className="viewport-example-wrapper">
        The root container
        <div style={{ height }}>
          <div ref={targetRef} className="viewport-example-target">
            target element
          </div>
        </div>
      </div>
      <Divider contentAlign="left">
        <div style={wrapStyle}>
          in viewport: {isInViewport ? "visible" : "hidden"}
        </div>
      </Divider>
      <Divider contentAlign="left">
        <div style={wrapStyle}>ratio: {ratio}</div>
      </Divider>
    </>
  );
};

export default Example;

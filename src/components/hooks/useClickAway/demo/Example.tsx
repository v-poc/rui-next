import React, { useRef, useState } from "react";
import { useClickAway, Button, Divider } from "rui-next";
import { logInfo, OnePiece } from "../../../experimental";
import "./index.less";

// Example FC
const Example = () => {
  const [count, setCount] = useState(0);
  const demoImgRef = useRef(null);

  const arrIds = ["btnB", "opC", "opD", "opE"].map((item) => () => document.getElementById(item));

  useClickAway(
    () => {
      logInfo(`click outside count: ${count}`);
      setCount((n) => n + 1);
    },
    [
      demoImgRef,
      ...arrIds,
    ],
  );
  
  return (
    <>
      <Divider contentAlign="left">
        Multiple DOM elements
      </Divider>
      <img
        ref={demoImgRef}
        src="https://nikoni.top/images/others/mj.png"
        alt="Test A img"
      />
      <br /><br />
      <span id="btnB">
        <Button
          type="primary"
          size="small"
          inline
          round
        >
          Test B button
        </Button>
      </span>
      <br /><br />
      <div className="clickaway-example-op">
        <div id="opC">
          <OnePiece
            scale={0.5}
          />
        </div>
        <div id="opD">
          <OnePiece />
        </div>
        <div id="opE">
          <OnePiece
            scale={0.5}
          />
        </div>
      </div>
      <br /><br />
      <Divider contentAlign="left">
        Click outside count: <strong>{count}</strong>
      </Divider>
      <br />
    </>
  );
};

export default Example;

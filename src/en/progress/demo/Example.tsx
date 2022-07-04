import React, { useState } from "react";
import { Progress, Divider } from "../../index";
import "./index.less";

// Example FC
const Example = () => {
  const [percent, setPercent] = useState(50);

  // add percent
  const add = () => {
    let p = percent + 10;
    p = percent >= 100 ? 0 : p;
    setPercent(p);
  };

  return (
    <>
      <Divider contentAlign="left">ProgressCircle mode</Divider>
      <Progress mode="circle" percent={percent} size={80} trackWidth={8}>
        {percent}%
      </Progress>

      <Divider contentAlign="left">ProgressBar mode</Divider>
      <Progress percent={30} position="fixed" />
      <br />
      <Progress
        percent={40}
        position="normal"
        unfilled={false}
        appearTransition
      />
      <div className="show-info">
        <div className="progress">
          <Progress percent={percent} position="normal" />
        </div>
        <div aria-hidden="true">{percent}%</div>
      </div>
      <br />
      <button onClick={add}>[Click to add percent]</button>
      <br />
      <br />
    </>
  );
};

export default Example;

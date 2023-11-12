import React, { useState } from "react";
import { Slider, Divider } from "../../index";
import { XButton, logInfo } from "../../experimental";
import "./index.less";

const handleClick = () => logInfo("So cool, nice feeling!");

// Example FC
const Example = () => {
  const [scaleVal, setScaleVal] = useState(0.5);

  return (
    <div className="x-button-example-wrapper">
      <Divider contentAlign="left">
        Let your imagination run wild and be creative
      </Divider>
      <img src="https://nikoni.top/images/others/cg.jpg" />
      <XButton scale={0.6} className="btn-lt" callback={handleClick} />
      <XButton scale={0.6} className="btn-rt" callback={handleClick} />

      <Divider contentAlign="left">Slider with XButton</Divider>
      <Slider defaultValue={50} onChange={(v: any) => setScaleVal(v / 100)} />
      <XButton scale={scaleVal} callback={handleClick} />
    </div>
  );
};

export default Example;

import React from "react";
import { Slider, Divider } from "../../index";
import { logInfo } from "../../experimental";

const marksSample = { 0: "0", 25: "25%", 50: "50%", 75: "75%", 100: "100%" };

const handleSlider = (v) => {
  let res = "";
  if (typeof v === "number") {
    res = String(v);
  } else if (Array.isArray(v)) {
    res = `[${v.join(",")}]`;
  }
  logInfo(`[onAfterChange] the current value is: ${res}`);
};

// Example FC
const Example = () => (
  <>
    <Divider contentAlign="left">
      Basic Slider (refer `RUI-log` in Console log)
    </Divider>
    <Slider defaultValue={10} onAfterChange={handleSlider} />

    <Divider contentAlign="left">
      Slider with Ticks and Marks (refer `RUI-log` in Console log)
    </Divider>
    <Slider marks={marksSample} ticks onAfterChange={handleSlider} />

    <Divider contentAlign="left">Slider with disabled status</Divider>
    <Slider value={50} marks={marksSample} ticks disabled />

    <Divider contentAlign="left">
      Slider with double Thumb (refer `RUI-log` in Console log)
    </Divider>
    <Slider
      defaultValue={[10, 40]}
      onChange={(v) => logInfo(`[onChange] the changing value: [${v}]`)}
      onAfterChange={handleSlider}
      range
      step={5}
      ticks
    />
  </>
);

export default Example;

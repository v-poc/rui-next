import React from "react";
import { Divider } from "../../index";
import { CubeAnim } from "../../experimental";

// Example FC
const Example = () => (
  <>
    <Divider contentAlign="left">Simple Cube Animation</Divider>
    <CubeAnim
      scale={1.2}
      front="React"
      back="Vite"
      top="UI"
      bottom="Less"
      left="Hello"
      right="RUI"
    />
  </>
);

export default Example;

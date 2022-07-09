import React from "react";
import { OnePiece } from "../../experimental";
import "./index.less";

// Example FC
const Example = () => (
  <div className="example-container">
    <OnePiece scale={0.5} />
    <OnePiece />
    <OnePiece scale={0.5} />
  </div>
);

export default Example;

import React from "react";
import { OnePiece } from "../../experimental";

const wrapStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

// Example FC
const Example = () => (
  <div style={wrapStyle}>
    <OnePiece scale={0.5} />
    <OnePiece />
    <OnePiece scale={0.5} />
  </div>
);

export default Example;

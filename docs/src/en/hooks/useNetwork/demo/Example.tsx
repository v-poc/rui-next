import React from "react";
import { useNetwork, Divider } from "../../../index";

// Example FC
const Example = () => {
  const networkState = useNetwork();
  const isOnline = networkState.online;

  return (
    <>
      <Divider contentAlign="left">Network state</Divider>
      {`Detect current state: ${isOnline ? "online" : "offline"}`}
    </>
  );
};

export default Example;

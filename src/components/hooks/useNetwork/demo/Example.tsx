import React from "react";
import { useNetwork, Result, Icon, Divider } from "../../../index";

// Example FC
const Example = () => {
  const networkState = useNetwork();
  const isOnline = networkState.online;

  const imgEl = isOnline ? (
    <Icon type="check-circle" size="lg" color="green" />
  ) : (
    <Icon type="exclamation-circle" size="lg" color="red" />
  );

  return (
    <>
      <Divider contentAlign="left">
        Network state - {isOnline ? "online" : "offline"}
      </Divider>
      <Result
        img={imgEl}
        title="Network state"
        message={`Detect current state: ${isOnline ? "online" : "offline"}`}
      />
    </>
  );
};

export default Example;

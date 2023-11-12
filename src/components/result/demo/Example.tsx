import React from "react";
import { useNetwork, Result, Icon, Divider } from "../../index";
import "./index.less";

// Example FC
const Example = () => {
  const networkState = useNetwork();
  const isOnline = networkState.online;

  const imgEl = isOnline ? (
    <Icon type="check-circle-o" size="lg" color="green" />
  ) : (
    <Icon type="exclamation-circle" size="lg" color="red" />
  );

  const handlePrimaryBtnClick = () => {
    location.href = "https://vitejs.dev/guide/";
  };

  const handleGhostBtnClick = () => {
    location.href = "https://vitejs.dev/guide/why.html";
  };

  return (
    <div className="example-result-container">
      <Divider contentAlign="left">Result with image url</Divider>
      <Result
        imgUrl="https://vitejs.dev/logo.svg"
        title="Vite"
        message="Next Generation Frontend Tooling"
        buttonType="primary"
        buttonText="Get Started"
        onButtonClick={handlePrimaryBtnClick}
      />
      <br />
      <br />
      <Divider contentAlign="left">Result with icon</Divider>
      <Result
        img={imgEl}
        title="Network state"
        message={`Detect current state: ${isOnline ? "online" : "offline"}`}
        buttonType="ghost"
        buttonText="Learn More"
        onButtonClick={handleGhostBtnClick}
      />
    </div>
  );
};

export default Example;

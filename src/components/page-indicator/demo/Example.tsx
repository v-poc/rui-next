import React from "react";
import { Divider, PageIndicator } from "rui-next";
import "./index.less";

// Example FC
const Example = () => (
  <>
    <Divider contentAlign="left">Simple usage</Divider>
    <PageIndicator total={8} current={1} />

    <Divider contentAlign="left">PageIndicator with Vertical mode</Divider>
    <PageIndicator total={5} current={0} vertical />

    <Divider contentAlign="left">Customize PageIndicator</Divider>
    <PageIndicator
      total={5}
      current={0}
      style={{
        "--item-color": "rgba(0, 0, 0, 0.4)",
        "--active-item-color": "#36C",
        "--item-size": "10px",
        "--active-item-size": "30px",
        "--item-border-radius": "50%",
        "--active-item-border-radius": "15px",
        "--item-spacing": "10px",
      }}
    />

    <Divider contentAlign="left">PageIndicator with White color mode</Divider>
    <div className="page-indicator-example-wrapper">
      <PageIndicator total={6} current={3} color="white" />
    </div>
  </>
);

export default Example;

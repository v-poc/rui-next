import React from "react";
import { Divider } from "../../index";
import { PageIndicator } from "../../experimental";
import "./index.less";

// Example FC
const Example = () => (
  <>
    <Divider contentAlign="left">
      Simple usage
    </Divider>
    <PageIndicator
      total={6}
      current={1}
    />

    <Divider contentAlign="left">
      White color mode
    </Divider>
    <div className="page-indicator-wrapper">
      <PageIndicator
        total={5}
        current={0}
        color="white"
      />
    </div>
  </>
);

export default Example;

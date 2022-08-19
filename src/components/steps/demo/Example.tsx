import React from "react";
import { Steps, Divider } from "rui-next";

// Example FC
const Example = () => (
  <>
    <Divider contentAlign="left">
      Basic Steps with status (horizontal)
    </Divider>
    <Steps
      currentIndex={1}
    >
      <Steps.Item
        title="Title 1"
      />
      <Steps.Item
        title="Title 2"
      />
      <Steps.Item
        title="Title 3"
        status="error"
      />
      <Steps.Item
        title="Title 4"
      />
    </Steps>
    <Divider contentAlign="left">
      Basic Steps with status (vertical)
    </Divider>
    <Steps
      vertical
    >
      <Steps.Item
        title="Step one"
        status="process"
      />
      <Steps.Item
        title="Step two"
        status="wait"
      />
      <Steps.Item
        title="Step three"
        status="wait"
      />
    </Steps>
  </>
);

export default Example;

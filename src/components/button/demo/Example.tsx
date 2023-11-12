import React from "react";
import { ActivityIndicator, Button, Divider } from "../../index";
import "./index.less";

// Example FC
const Example = () => (
  <>
    <Divider contentAlign="left">Basic Buttons</Divider>
    <Button>default state</Button>
    <br />
    <Button disabled>default disabled</Button>
    <br />
    <br />
    <Button type="warning">warning state</Button>
    <br />
    <Button type="warning" disabled>
      warning disabled
    </Button>
    <br />
    <br />
    <Button type="primary" round>
      primary state
    </Button>
    <br />
    <Button type="primary" disabled>
      primary disabled
    </Button>
    <br />
    <Button type="primary" inline>
      button inline primary
    </Button>
    <Button type="ghost" inline className="button-example-space">
      button inline ghost
    </Button>
    <Button
      type="primary"
      inline
      round
      size="small"
      className="button-example-space"
    >
      inline primary small button
    </Button>
    <Button inline size="small" className="button-example-space">
      <ActivityIndicator carousel="rect" />
    </Button>
    <br />
    <br />
    <Button loading>loading state</Button>
    <br />
    <Button icon="search">button with icon</Button>
  </>
);

export default Example;

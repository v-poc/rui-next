import React from "react";
import { Divider } from "../../index";
import "./index.less";

// Example FC
const Example = () => (
  <>
    <p className="divider-example-title">
      Basic Divider with pure line (horizontal mode)
    </p>
    <Divider />

    <p className="divider-example-title">Basic Divider (vertical mode)</p>
    <>
      one
      <Divider vertical />
      two
      <Divider vertical />
      three
      <Divider vertical />
      four
    </>
    <br />
    <br />
    <p className="divider-example-title">Divider with content</p>
    <Divider>center content</Divider>
    <br />
    <Divider contentAlign="left">left content</Divider>
    <br />
    <Divider contentAlign="right">right content</Divider>

    <p className="divider-example-title">Divider with customized styles</p>
    <Divider
      style={{
        color: "orange",
        borderColor: "#36C",
        borderStyle: "dashed",
      }}
    >
      some content
    </Divider>
  </>
);

export default Example;

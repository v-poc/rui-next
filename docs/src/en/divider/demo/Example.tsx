import React from "react";
import { Divider } from "../../index";

const titleStyle = {
  color: "#888",
  fontSize: "90%",
};

// Example FC
const Example = () => (
  <>
    <p style={titleStyle}>Basic Divider with pure line (horizontal mode)</p>
    <Divider />

    <p style={titleStyle}>Basic Divider (vertical mode)</p>
    <>
      one
      <Divider vertical />
      two
      <Divider vertical />
      three
      <Divider vertical />
      four
    </>

    <p style={titleStyle}>Divider with content</p>
    <Divider>center content</Divider>
    <br />
    <br />
    <Divider contentAlign="left">left content</Divider>
    <br />
    <br />
    <Divider contentAlign="right">right content</Divider>

    <p style={titleStyle}>Divider with customized styles</p>
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

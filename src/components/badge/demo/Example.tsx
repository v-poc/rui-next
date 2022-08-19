import React from "react";
import { Badge, Divider } from "rui-next";
import "./index.less";

// Example FC
const Example = () => (
  <>
    <Divider contentAlign="left">Dot badge</Divider>
    <Badge dot>
      <span className="dot-section" />
    </Badge>

    <Divider contentAlign="left">Numberic badge</Divider>
    <Badge text={99} overflowcount={66} />

    <Divider contentAlign="left">Corner badge</Divider>
    <Badge text="HOT" className="corner-section" corner />

    <Divider contentAlign="left">Marketing badge</Divider>
    <Badge text="HOT" className="mr" hot />

    <Divider contentAlign="left">Customize badge</Divider>
    <Badge text="NEW" className="bg-section" />
    <Badge text="Promotion" className="plain-section" />
  </>
);

export default Example;

import React from "react";
import { WhiteSpace, Divider } from "../../index";
import "./index.less";

// PlaceHolder FC
const PlaceHolder = ({
  className = "",
  ...restProps
}) => (
  <div className={`${className} white-space-placeholder`} {...restProps}>
    Block
  </div>
);

// Example FC
const Example = () => (
  <>
    <Divider contentAlign="left">
      WhiteSpace vertical
    </Divider>
    <WhiteSpace size="xs" />
    <PlaceHolder />

    <WhiteSpace size="sm" />
    <PlaceHolder />

    <WhiteSpace />
    <PlaceHolder />

    <WhiteSpace size="lg" />
    <PlaceHolder />
    
    <WhiteSpace size="xl" />
    <PlaceHolder />

    <br />
    <Divider contentAlign="left">
      WhiteSpace horizontal
    </Divider>
    <WhiteSpace vertical={false}><PlaceHolder /></WhiteSpace>
    <br />
    <WhiteSpace vertical={false} size="md"><PlaceHolder /></WhiteSpace>
    <br />
    <WhiteSpace vertical={false} size="sm"><PlaceHolder /></WhiteSpace>
  </>
);

export default Example;

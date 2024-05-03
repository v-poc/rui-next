import React from "react";
import { Skeleton, Divider } from "../../index";
import "./index.less";

// Example FC
const Example = () => (
  <>
    <Divider contentAlign="left">
      Skeleton basic usage (without animation)
    </Divider>
    <Skeleton.Title />
    <Skeleton.Paragraph />

    <Divider contentAlign="left">Custom Skeleton</Divider>
    <Skeleton animated className="skeleton-custom-example" />

    <Divider contentAlign="left">
      Skeleton with animated effect (line count is 6)
    </Divider>
    <Skeleton.Title animated />
    <Skeleton.Paragraph animated lineCount={6} />
  </>
);

export default Example;

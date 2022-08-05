import React from "react";
import { Skeleton, Divider } from "../../index";

// Example FC
const Example = () => (
  <>
    <Divider contentAlign="left">
      Skeleton Title placeholders
    </Divider>
    <Skeleton
      title
    />

    <Divider contentAlign="left">
      Skeleton Avatar placeholders
    </Divider>
    <Skeleton
      title
      avatar
      avatarSize="lg"
    />
  </>
);

export default Example;

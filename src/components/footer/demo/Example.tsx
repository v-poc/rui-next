import React from "react";
import { Footer, Divider, Icon } from "rui-next";

// Example FC
const Example = () => (
  <>
    <Divider contentAlign="left">Footer content</Divider>
    <Footer content="Copyright @ 2021-present RUI.next (MIT License)." />

    <Divider contentAlign="left">Customize footer label</Divider>
    <Footer
      label={
        <>
          <Icon type="left" />
          <Icon type="star" />
          <Icon type="right" />
        </>
      }
    />
  </>
);

export default Example;

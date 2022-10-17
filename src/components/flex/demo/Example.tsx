import React from "react";
import { Flex, Divider } from "rui-next";
import "./index.less";

// PlaceHolder FC
const PlaceHolder = ({ className = "", ...restProps }) => (
  <div className={`${className} flex-example-placeholder`} {...restProps}>
    Block
  </div>
);

// Example FC
const Example = () => (
  <>
    <Divider contentAlign="left">Basic</Divider>
    <Flex>
      <Flex.Item>
        <PlaceHolder />
      </Flex.Item>
      <Flex.Item>
        <PlaceHolder />
      </Flex.Item>
    </Flex>
    <br />
    <Flex>
      <Flex.Item>
        <PlaceHolder />
      </Flex.Item>
      <Flex.Item>
        <PlaceHolder />
      </Flex.Item>
      <Flex.Item>
        <PlaceHolder />
      </Flex.Item>
    </Flex>
    <br />
    <Flex>
      <Flex.Item>
        <PlaceHolder />
      </Flex.Item>
      <Flex.Item>
        <PlaceHolder />
      </Flex.Item>
      <Flex.Item>
        <PlaceHolder />
      </Flex.Item>
      <Flex.Item>
        <PlaceHolder />
      </Flex.Item>
    </Flex>

    <Divider contentAlign="left">
      Wrap (resize window to view the wrap items)
    </Divider>
    <Flex wrap="wrap">
      <PlaceHolder className="flex-example-inline" />
      <PlaceHolder className="flex-example-inline" />
      <PlaceHolder className="flex-example-inline" />
      <PlaceHolder className="flex-example-inline" />
      <PlaceHolder className="flex-example-inline" />
      <PlaceHolder className="flex-example-inline" />
      <PlaceHolder className="flex-example-inline" />
    </Flex>

    <Divider contentAlign="left">Align</Divider>
    <Flex justify="center">
      <PlaceHolder className="flex-example-inline" />
      <PlaceHolder className="flex-example-inline" />
      <PlaceHolder className="flex-example-inline" />
    </Flex>

    <Flex justify="end">
      <PlaceHolder className="flex-example-inline" />
      <PlaceHolder className="flex-example-inline" />
      <PlaceHolder className="flex-example-inline" />
    </Flex>

    <Flex justify="between">
      <PlaceHolder className="flex-example-inline" />
      <PlaceHolder className="flex-example-inline" />
      <PlaceHolder className="flex-example-inline" />
    </Flex>

    <Flex align="start">
      <PlaceHolder className="flex-example-inline" />
      <PlaceHolder className="flex-example-inline flex-example-small" />
      <PlaceHolder className="flex-example-inline" />
    </Flex>

    <Flex align="end">
      <PlaceHolder className="flex-example-inline" />
      <PlaceHolder className="flex-example-inline flex-example-small" />
      <PlaceHolder className="flex-example-inline" />
    </Flex>

    <Flex align="baseline">
      <PlaceHolder className="flex-example-inline" />
      <PlaceHolder className="flex-example-inline flex-example-small" />
      <PlaceHolder className="flex-example-inline" />
    </Flex>
  </>
);

export default Example;

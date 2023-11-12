import React from "react";
import { Space, Divider } from "../../index";
import "./index.less";

// PlaceHolder FC
const PlaceHolder = ({ className = "", children = "", ...restProps }) => (
  <div className={`${className} space-example-placeholder`} {...restProps}>
    Block{children ? ` ${children}` : ""}
  </div>
);

// Example FC
const Example = () => (
  <>
    <Divider contentAlign="left">Space horizontal</Divider>
    <Space>
      <PlaceHolder>1</PlaceHolder>
      <PlaceHolder>2</PlaceHolder>
      <PlaceHolder>3</PlaceHolder>
      <PlaceHolder>4</PlaceHolder>
    </Space>

    <Divider contentAlign="left">Space vertical</Divider>
    <Space vertical>
      <PlaceHolder>1</PlaceHolder>
      <PlaceHolder>2</PlaceHolder>
      <PlaceHolder>3</PlaceHolder>
      <PlaceHolder>4</PlaceHolder>
    </Space>

    <Divider contentAlign="left">Space horizontal - customize gap</Divider>
    <Space gap={30}>
      <PlaceHolder>1</PlaceHolder>
      <PlaceHolder>2</PlaceHolder>
      <PlaceHolder>3</PlaceHolder>
      <PlaceHolder>4</PlaceHolder>
    </Space>

    <Divider contentAlign="left">Space vertical - customize gap</Divider>
    <Space gap={30} vertical>
      <PlaceHolder>1</PlaceHolder>
      <PlaceHolder>2</PlaceHolder>
      <PlaceHolder>3</PlaceHolder>
      <PlaceHolder>4</PlaceHolder>
    </Space>
  </>
);

export default Example;

import React from "react";
import { Toast, Button, Divider, Icon, Space } from "rui-next";

// Example FC
const Example = () => (
  <>
    <Divider contentAlign="left">Toast with icon display</Divider>
    <Space vertical>
      <Button
        size="small"
        inline
        onClick={() => {
          Toast.show({
            icon: "success",
            content: "Publish done",
          });
        }}
      >
        Click to show toast with success icon
      </Button>
      <Button
        size="small"
        inline
        onClick={() => {
          Toast.show({
            icon: "fail",
            content: "Game over",
          });
        }}
      >
        Click to show toast with fail icon
      </Button>
      <Button
        size="small"
        inline
        onClick={() => {
          Toast.show({
            icon: "loading",
            content: "Loading data...",
          });
        }}
      >
        Click to show toast with loading icon
      </Button>
      <Button
        size="small"
        inline
        onClick={() => {
          Toast.show({
            icon: <Icon type="star" />,
            content: "Starry night",
          });
        }}
      >
        Click to show toast with customizable icon
      </Button>
    </Space>

    <Divider contentAlign="left">Toast with position</Divider>
    <Space vertical>
      <Button
        size="small"
        inline
        onClick={() => {
          Toast.show({
            content: "Top message",
            position: "top",
          });
        }}
      >
        Click to show toast with top position
      </Button>
      <Button
        size="small"
        inline
        onClick={() => {
          Toast.show({
            content: "Bottom message",
            position: "bottom",
          });
        }}
      >
        Click to show toast with bottom position
      </Button>
    </Space>

    <Divider contentAlign="left">Toast with mask not clickable</Divider>
    <Button
      size="small"
      inline
      onClick={() => {
        Toast.show({
          content: "Hold on (for 3s) please",
          maskClickable: false,
          duration: 3000,
        });
      }}
    >
      Click to show toast with bg mask not clickable
    </Button>
  </>
);

export default Example;

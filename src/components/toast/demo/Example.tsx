import React from "react";
import { Toast, Button, Divider } from "rui-next";
import { logInfo } from "../../experimental";

// Example FC
const Example = () => (
  <>
    <Divider contentAlign="left">Basic Toast</Divider>
    <Button size="small" inline onClick={() => Toast.show("Hello RUI")}>
      Click to show simple toast
    </Button>

    <Divider contentAlign="left">
      Toast with Callback function (`RUI-log` in Console log)
    </Divider>
    <Button
      size="small"
      inline
      onClick={() => {
        Toast.show({
          content: "Hello RUI + callback",
          afterClose: () => logInfo("callback: Toast afterClose"),
        });
      }}
    >
      Click to show toast with callback
    </Button>
  </>
);

export default Example;

import React from "react";
import { Tag, Divider } from "rui-next";
import { logInfo } from "../../experimental";

// Example FC
const Example = () => {
  const handleChange = (selected: boolean) => {
    logInfo(`Tag selected state: ${selected}`);
  };

  return (
    <>
      <Divider contentAlign="left">
        Tag with `data-seed` attr (Selectable type)
      </Divider>
      <Tag data-seed="seedId">DataSeed</Tag>

      <Divider contentAlign="left">
        Selected tag (Selectable type)
      </Divider>
      <Tag selected>Selected</Tag>

      <Divider contentAlign="left">
        Disabled tag
      </Divider>
      <Tag disabled>Disabled</Tag>

      <Divider contentAlign="left">
        Tag with Callback function (`RUI-log` in Console log)
      </Divider>
      <Tag onChange={handleChange}>Callback</Tag>

      <Divider contentAlign="left">
        Closable tag with Callback function (`RUI-log` in Console log)
      </Divider>
      <Tag
        closable
        onClose={() => logInfo("onClose")}
        afterClose={() => logInfo("afterClose")}
      >
        Closable
      </Tag>

      <Divider contentAlign="left">
        Small tag (Readonly type)
      </Divider>
      <Tag small>Small size</Tag>
    </>
  );
};

export default Example;

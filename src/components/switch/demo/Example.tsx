import React, { useState } from "react";
import { Switch, Divider } from "../../index";
import { logInfo } from "../../experimental";

// Example FC
const Example = () => {
  const [checked, setChecked] = useState(true);

  const handleChange = () => {
    setChecked(!checked);
    logInfo(`Switch checked state: ${!checked}`);
  };

  return (
    <>
      <Divider contentAlign="left">Default switch (Style for iOS)</Divider>
      <Switch checked={checked} onChange={() => handleChange()} />

      <Divider contentAlign="left">Disabled off</Divider>
      <Switch checked={false} disabled />

      <Divider contentAlign="left">Disabled on</Divider>
      <Switch checked disabled />

      <Divider contentAlign="left">Style for android</Divider>
      <Switch
        checked={checked}
        onChange={() => handleChange()}
        platform="android"
        color="orange"
      />
    </>
  );
};

export default Example;

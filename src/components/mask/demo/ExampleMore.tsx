import React, { useState } from "react";
import { Mask, Button, Divider } from "rui-next";

// Example FC
const Example = () => {
  const [darkVisible, setDarkVisible] = useState(false);
  const [whiteVisible, setWhiteVisible] = useState(false);

  return (
    <>
      <Divider contentAlign="left">
        Dark mask (click screen to close mask)
      </Divider>
      <Button
        size="small"
        inline
        onClick={() => setDarkVisible(true)}
      >
        Click to show dark mask
      </Button>
      <Mask
        visible={darkVisible}
        onClickMask={() => setDarkVisible(false)}
        opacity={0.9}
      />
      
      <Divider contentAlign="left">
        White mask (click screen to close mask)
      </Divider>
      <Button
        size="small"
        inline
        onClick={() => setWhiteVisible(true)}
      >
        Click to show white mask
      </Button>
      <Mask
        visible={whiteVisible}
        onClickMask={() => setWhiteVisible(false)}
        color="white"
      />
    </>
  );
};

export default Example;

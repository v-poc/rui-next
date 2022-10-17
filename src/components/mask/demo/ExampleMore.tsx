import React, { useState } from "react";
import { Mask, Button, Divider } from "rui-next";

// Example FC
const Example = () => {
  const [thinVisible, setThinVisible] = useState(false);
  const [thickVisible, setThickVisible] = useState(false);
  const [customVisible, setCustomVisible] = useState(false);
  const [whiteVisible, setWhiteVisible] = useState(false);

  return (
    <>
      <Divider contentAlign="left">
        Dark mask - `opacity: 35%` (click screen to close mask)
      </Divider>
      <Button size="small" inline onClick={() => setThinVisible(true)}>
        Click to show dark mask with thin opacity
      </Button>
      {thinVisible && (
        <Mask
          visible={thinVisible}
          onClickMask={() => setThinVisible(false)}
          opacity="thin"
        />
      )}

      <Divider contentAlign="left">
        Dark mask - `opacity: 75%` (click screen to close mask)
      </Divider>
      <Button size="small" inline onClick={() => setThickVisible(true)}>
        Click to show dark mask with thick opacity
      </Button>
      {thickVisible && (
        <Mask
          visible={thickVisible}
          onClickMask={() => setThickVisible(false)}
          opacity="thick"
        />
      )}

      <Divider contentAlign="left">
        Dark mask - `opacity: 90%` (click screen to close mask)
      </Divider>
      <Button size="small" inline onClick={() => setCustomVisible(true)}>
        Click to show dark mask with 90% opacity
      </Button>
      {customVisible && (
        <Mask
          visible={customVisible}
          onClickMask={() => setCustomVisible(false)}
          opacity={0.9}
        />
      )}

      <Divider contentAlign="left">
        White mask (click screen to close mask)
      </Divider>
      <Button size="small" inline onClick={() => setWhiteVisible(true)}>
        Click to show white mask
      </Button>
      {whiteVisible && (
        <Mask
          visible={whiteVisible}
          onClickMask={() => setWhiteVisible(false)}
          color="white"
        />
      )}
    </>
  );
};

export default Example;

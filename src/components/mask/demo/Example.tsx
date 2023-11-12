import React, { useState } from "react";
import { Mask, Avatar, Button, Divider } from "../../index";
import "./index.less";

// Example FC
const Example = () => {
  const [bgVisible, setBgVisible] = useState(false);
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Divider contentAlign="left">
        Basic mask with default 55% opacity and bodyScroll disabled
      </Divider>
      <Button size="small" inline onClick={() => setBgVisible(true)}>
        Click to show background mask
      </Button>
      <Mask visible={bgVisible} onClickMask={() => setBgVisible(false)} />

      <Divider contentAlign="left">
        Mask with content and bodyScroll enabled
      </Divider>
      <Button size="small" inline onClick={() => setVisible(true)}>
        Click to show mask with content
      </Button>
      <Mask
        visible={visible}
        onClickMask={() => setVisible(false)}
        disableBodyScroll={false}
      >
        <div className="mask-example-content">
          <Avatar
            src="https://nikoni.top/images/others/img04.png"
            shape="circle"
            size={200}
          />
        </div>
      </Mask>
    </>
  );
};

export default Example;

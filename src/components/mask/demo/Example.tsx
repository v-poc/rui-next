import React, { useState } from "react";
import { Mask, Avatar, Button, Divider } from "rui-next";
import "./index.less";

// Example FC
const Example = () => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Divider contentAlign="left">
        Basic background mask (click screen to close mask)
      </Divider>
      <Button
        size="small"
        inline
        onClick={() => setVisible(true)}
      >
        Click to show background mask
      </Button>
      <Mask
        visible={visible}
        onClickMask={() => setVisible(false)}
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

import React, { Fragment } from "react";
import { Image, Divider } from "../../index";
import "./index.less";

const IMG_SRC = "https://nikoni.top/images/rui-next/big-picture.jpg";

// Example FC
const Example = () => (
  <div className="image-example-wrapper">
    <Divider contentAlign="left">Image lazy load (big picture - 2.6M)</Divider>
    <Image lazy src={IMG_SRC} width={320} height={320} style={{ margin: 0 }} />

    <Divider contentAlign="left">
      Image load failed (display fallback broken image)
    </Divider>
    <Image src="/NOTHINGBUT404" width={120} height={120} />
  </div>
);

export default Example;

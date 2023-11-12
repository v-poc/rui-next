import React, { Fragment } from "react";
import { Image, Divider } from "../../index";
import "./index.less";

const IMG_SRC = "https://nikoni.top/images/rui-next/big-picture.jpg";

// Example FC
const Example = () => (
  <div className="image-example-wrapper">
    {["contain", "cover", "fill", "none", "scale-down"].map(
      (fillMode: string) => (
        <Fragment key={`${fillMode}fragment`}>
          <Divider key={`${fillMode}divider`} contentAlign="left">
            Image fill mode - {fillMode}
          </Divider>
          <Image
            key={`${fillMode}img`}
            src={IMG_SRC}
            width={100}
            height={100}
            fit={fillMode}
          />
        </Fragment>
      )
    )}
  </div>
);

export default Example;

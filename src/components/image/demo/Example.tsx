import React, { Fragment } from "react";
import { Image, Divider } from "rui-next";
import "./index.less";

const IMG_SRC = "https://res.vmallres.com/cmscdn/CN/2022-09/58ecf55a84bd4290b45dc978fcbf9357.png";

// Example FC
const Example = () => (
  <div className="image-example-wrapper">
    <Divider contentAlign="left">
      Image lazy load
    </Divider>
    <Image
      lazy
      src="https://vitejs.dev/logo.svg"
      width={180}
      height={180}
      style={{ margin: 0 }}
    />

    <Divider contentAlign="left">
      Image load failed
    </Divider>
    <Image
      src="/NOTHINGBUT404"
      width={80}
      height={80}
    />

    {["contain", "cover", "fill", "none", "scale-down"].map((fillMode: string) => (
      <Fragment key={`${fillMode}fragment`}>
        <Divider
          key={`${fillMode}divider`}
          contentAlign="left"
        >
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
    ))}
  </div>
);

export default Example;

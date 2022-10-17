import React from "react";
import { Empty, Icon, Divider } from "rui-next";

// Example FC
const Example = () => {
  const imgEl = (
    <Icon
      type="exclamation-circle"
      style={{
        width: "100%",
        height: "100%",
        color: "#36C",
      }}
    />
  );

  return (
    <>
      <Divider contentAlign="left">Empty without message</Divider>
      <Empty />
      <br />
      <br />
      <Divider contentAlign="left">Empty with message</Divider>
      <Empty message="No result" />
      <br />
      <br />
      <Divider contentAlign="left">
        Empty with customized style and image
      </Divider>
      <Empty
        img="https://nikoni.top/images/others/mj.png"
        imgStyle={{
          width: "100%",
        }}
        message="Data Not Found"
      />
      <br />
      <br />
      <Divider contentAlign="left">
        Empty with customized Icon (ReactNode)
      </Divider>
      <Empty img={imgEl} message="Customize Description" />
    </>
  );
};

export default Example;

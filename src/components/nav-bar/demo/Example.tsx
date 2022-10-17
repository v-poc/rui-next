import React from "react";
import { NavBar, Icon, Divider } from "rui-next";
import "./index.less";

// Example FC
const Example = () => {
  const handleBtnClick = () => {
    location.href = "https://nikoni.top/rui-next/";
  };

  return (
    <>
      <Divider contentAlign="left">Dark mode</Divider>
      <NavBar
        icon={<Icon type="left" />}
        onLeftClick={() => handleBtnClick()}
        rightContent={<Icon type="search" />}
      >
        Dark mode title
      </NavBar>
      <br />
      <br />
      <Divider contentAlign="left">Light mode</Divider>
      <NavBar
        mode="light"
        className="nav-bar-bg-section"
        leftContent="Back"
        onLeftClick={() => handleBtnClick()}
        rightContent={[
          <Icon key="search" type="search" className="nav-bar-mr" />,
          <Icon key="ellipsis" type="ellipsis" />,
        ]}
      >
        Light mode title
      </NavBar>
    </>
  );
};

export default Example;

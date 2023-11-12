import React, { useState } from "react";
import classnames from "classnames";
import { SideBar, Divider } from "../../index";
import "./index.less";

const arrItems = [
  {
    key: "wechat",
    title: "Wechat",
  },
  {
    key: "alipay",
    title: "Alipay",
  },
  {
    key: "afdian",
    title: "Afdian",
  },
  {
    key: "key3",
    title: "item3",
    disabled: true,
    badge: "666",
  },
];

// Example FC
const Example = () => {
  const [activeKey, setActiveKey] = useState("wechat");

  return (
    <>
      <Divider contentAlign="left">SideBar (badge and disabled state)</Divider>
      <div className="side-bar-example-wrapper">
        <div className="side-bar-example-inner">
          <div className="side-bar-example-side">
            <SideBar activeKey={activeKey} onChange={setActiveKey}>
              {arrItems.map((item: any, i: number) => (
                <SideBar.Item
                  key={item.key}
                  title={item.title}
                  disabled={item.disabled}
                  badge={item.badge}
                />
              ))}
            </SideBar>
          </div>
          <div className="side-bar-example-main">
            <div
              className={classnames("side-bar-example-content", {
                "side-bar-example-active": activeKey === "alipay",
              })}
            >
              <img src="https://nikoni.top/images/alipay-qrcode.png" />
            </div>
            <div
              className={classnames("side-bar-example-content", {
                "side-bar-example-active": activeKey === "wechat",
              })}
            >
              <img src="https://nikoni.top/images/niko-reward-qrcode.png" />
            </div>
            <div
              className={classnames("side-bar-example-content", {
                "side-bar-example-active": activeKey === "afdian",
              })}
            >
              <img src="https://nikoni.top/images/afdian-qrcode.jpeg" />
            </div>
            <div className="side-bar-example-content">Three content</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Example;

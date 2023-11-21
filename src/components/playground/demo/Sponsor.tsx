import React, { useState } from "react";
import classnames from "classnames";
import { Avatar, List, SideBar } from "../../index";
import { logInfo } from "../../experimental";
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
    title: "爱发电",
  },
];

// Example FC
const Example = () => {
  const [activeKey, setActiveKey] = useState("wechat");

  return (
    <div className="playground-example-wrapper">
      <div className="playground-example-inner">
        <div className="playground-example-side">
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
        <div className="playground-example-main">
          <div
            className={classnames("playground-example-content", {
              "playground-example-active": activeKey === "alipay",
            })}
          >
            <img src="https://nikoni.top/images/alipay-qrcode.png" />
          </div>
          <div
            className={classnames("playground-example-content", {
              "playground-example-active": activeKey === "wechat",
            })}
          >
            <img src="https://nikoni.top/images/niko-reward-qrcode.png" />
            <br />
            <br />
            <p>Sponsors</p>
            <List>
              <List.Item
                prefix={<Avatar src="/" shape="circle" />}
                onClick={() => logInfo("感谢打赏鼓励")}
              >
                小马、打印复印、大, and others.
              </List.Item>
            </List>
          </div>
          <div
            className={classnames("playground-example-content", {
              "playground-example-active": activeKey === "afdian",
            })}
          >
            <img src="https://nikoni.top/images/afdian-qrcode.jpeg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Example;

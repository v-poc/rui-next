import React, { useState } from "react";
import classnames from "classnames";
import { SideBar } from "rui-next";
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Example;

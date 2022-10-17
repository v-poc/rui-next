import React from "react";
import { SideBar, Divider } from "rui-next";
import "./index.less";

const arrItems = [
  {
    key: "key1",
    title: "item one",
  },
  {
    key: "key2",
    title: "item two",
    badge: "6",
  },
  {
    key: "key3",
    title: "item three",
    disabled: true,
  },
];

// Example FC
const Example = () => (
  <>
    <Divider contentAlign="left">SideBar (badge and disabled state)</Divider>
    <div className="side-bar-example-wrapper">
      <div className="side-bar-example-inner">
        <SideBar>
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
    </div>
  </>
);

export default Example;

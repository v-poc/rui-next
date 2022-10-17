import React from "react";
import { Avatar, Divider, Space } from "rui-next";
import "./index.less";

const arrUsers = [
  {
    index: 0,
    avatar: "https://nikoni.top/images/others/img01.png",
    name: "Sara Visto",
    desc: "Animi eius expedita",
  },
  {
    index: 1,
    avatar: "https://nikoni.top/images/others/img02.png",
    name: "Edith Koen",
    desc: "Commodi earum exercitationem id numquam visto",
  },
  {
    index: 2,
    avatar: "https://nikoni.top/images/others/img12.png",
    name: "Marco Gregg",
    desc: "Ab animi cumque eveniet ex harum nam odio",
  },
];

// Example FC
const Example = () => (
  <div className="avatar-example-wrapper">
    <Divider contentAlign="left">Avatar shape</Divider>
    <Space wrap>
      <Avatar src={arrUsers[0].avatar} shape="circle" />
      <Avatar src={arrUsers[1].avatar} />
      <Avatar src={arrUsers[2].avatar} shape="circle" />
    </Space>

    <Divider contentAlign="left">Customize avatar size</Divider>
    <Space wrap>
      <Avatar src={arrUsers[0].avatar} size={64} />
      <Avatar src={arrUsers[1].avatar} size={96} />
      <Avatar src={arrUsers[2].avatar} size={72} />
    </Space>

    <Divider contentAlign="left">Avatar with fallback image</Divider>
    <Avatar src="/NOTHINGBUT404" />
  </div>
);

export default Example;

import React from "react";
import { List, Icon, Divider } from "../../index";
import { logInfo } from "../../experimental";
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
  <>
    <Divider contentAlign="left">Default mode</Divider>
    <List>
      {new Array(4).fill("").map((item, i) => (
        <List.Item key={`basic${i}`}>{`Content ${i + 1}`}</List.Item>
      ))}
    </List>

    <Divider contentAlign="left">Card mode</Divider>
    <div className="list-card-wrapper">
      <List mode="card">
        {new Array(3).fill("").map((item, i) => (
          <List.Item
            key={`card${i}`}
            title={`Content title ${i + 1}`}
            onClick={() => logInfo(`Click item ${i + 1}`)}
          >
            {`Content information ${i + 1}`}
          </List.Item>
        ))}
      </List>
    </div>

    <Divider contentAlign="left">With icon and disabled state</Divider>
    <List>
      <List.Item
        prefix={<Icon type="voice" />}
        onClick={() => logInfo("Click voice item")}
      >
        Voice item
      </List.Item>
      <List.Item prefix={<Icon type="info-circle" />} disabled>
        Info item
      </List.Item>
    </List>

    <Divider contentAlign="left">Users list</Divider>
    <List>
      {arrUsers.map((item, i) => {
        const { index, avatar, name, desc } = item;
        const renderImage = <img className="list-avatar-item" src={avatar} />;
        return (
          <List.Item
            key={`user${index}`}
            prefix={renderImage}
            description={desc}
            onClick={() => logInfo(`name: ${name}, description: ${desc}`)}
          >
            {name}
          </List.Item>
        );
      })}
    </List>
  </>
);

export default Example;

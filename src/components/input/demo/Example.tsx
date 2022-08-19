import React from "react";
import { Input, List, Divider } from "rui-next";
import "./index.less";

// Example FC
const Example = () => (
  <>
    <Divider contentAlign="left">
      List card mode with Input
    </Divider>
    <div className="input-card-wrapper">
      <List
        mode="card"
      >
        {new Array(3).fill("").map((item, i) => (
          <List.Item
            key={`card${i}`}
          >
            <Input
              placeholder={`Content information ${i + 1}${i === 1 ? " (disabled)" : "" }`}
              clearable
              disabled={i === 1}
            />
          </List.Item>
        ))}
        <List.Item>
          <Input
            value="Content information 4 (readonly)"
            readOnly
          />
        </List.Item>
      </List>
    </div>
  </>
);

export default Example;

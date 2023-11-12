import React from "react";
import { CheckList, Divider } from "../../index";
import { logInfo } from "../../experimental";
import "./index.less";

// Example FC
const Example = () => (
  <>
    <Divider contentAlign="left">
      Card mode (the 2nd item is checked by default)
    </Divider>
    <div className="check-list-card-wrapper">
      <CheckList defaultValue={["1"]} mode="card">
        {new Array(5).fill("").map((item, i) => {
          const isDisabled = i === 2;
          const isReadOnly = i === 3;
          return (
            <CheckList.Item
              key={`basic${i}`}
              value={String(i)}
              disabled={isDisabled}
              readOnly={isReadOnly}
              onClick={() => logInfo(`Click item - Content ${i + 1}`)}
            >
              {`Content ${i + 1}`}
              {isDisabled ? " (disabled)" : isReadOnly ? " (readonly)" : ""}
            </CheckList.Item>
          );
        })}
      </CheckList>
    </div>
  </>
);

export default Example;

import React from "react";
import { Icon, Divider } from "../../index";
import "./index.less";

const defaultList = [
  "check-circle", "check", "check-circle-o",
  "cross-circle", "cross", "cross-circle-o",
  "up", "down", "left", "right",
  "search", "ellipsis", "ellipsis-circle",
  "loading", "exclamation-circle", "info-circle", "question-circle",
  "voice", "minus", "plus" 
];

const sizeList = ["xxs", "xs", "sm", "md", "lg"];

// Example FC
const Example = () => (
  <>
    <Divider contentAlign="left">
      Basic Icons
    </Divider>
    <div className="example-icon-wrapper">
      {defaultList.map((type, index) => (
        <div key={`iconWrapper${index}`} className="item-wrapper">
          <Icon key={`icon${index}`} type={type} size="lg" />
          <p key={`iconText${index}`}>{type}</p>
        </div>
      ))}
    </div>

    <Divider contentAlign="left">
      Icon Size
    </Divider>
    <div className="example-icon-wrapper">
      {sizeList.map((size: any, i: number) => (
        <div key={`sizeWrapper${i}`} className="item-wrapper">
          <Icon key={`size${i}`} type="search" color="orange" size={size} />
          <p key={`sizeText${i}`}>{size}</p>
        </div>
      ))}
    </div>
  </>
);

export default Example;

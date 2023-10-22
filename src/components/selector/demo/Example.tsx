import React from "react";
import { Selector, Divider } from "rui-next";
import { logInfo } from "../../experimental";

const sampleData = [
  {
    label: "Wechat",
    value: "1",
  },
  {
    label: "Alipay",
    value: "2",
  },
  {
    label: "Afdian",
    value: "3",
  },
];

const handleLog = (arr: any, ext: any) => {
  console.log(arr, ext);
  if (arr && arr.length) {
    logInfo(`Selector option value: [${arr}]`);
  }
};

// Example FC
const Example = () => (
  <>
    <Divider contentAlign="left">Basic Selector (single mode)</Divider>
    <Selector
      options={sampleData}
      defaultValue={["1"]}
      onChange={(arr: any, ext: any) => handleLog(arr, ext)}
    />
    <br />
    <Divider contentAlign="left">Selector with multiple mode</Divider>
    <Selector
      options={sampleData}
      defaultValue={["1", "2"]}
      onChange={(arr: any, ext: any) => handleLog(arr, ext)}
      multiple
    />
    <br />
  </>
);

export default Example;

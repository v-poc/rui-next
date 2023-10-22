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

const sampleDisable = [
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
    disabled: true,
  },
];

const customData = [
  {
    name: "Option 1",
    code: "one",
    closable: false,
  },
  {
    name: "Option 2",
    code: "two",
    closable: false,
  },
  {
    name: "Option 3",
    code: "three",
    closable: false,
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
    <Divider contentAlign="left">Basic Selector with single mode</Divider>
    <Selector
      options={sampleData}
      defaultValue={["1"]}
      onChange={(arr: any, ext: any) => handleLog(arr, ext)}
    />
    <br />
    <Divider contentAlign="left">Selector with multiple mode</Divider>
    <Selector
      options={sampleData}
      defaultValue={["2", "3"]}
      onChange={(arr: any, ext: any) => handleLog(arr, ext)}
      multiple
    />
    <br />
    <Divider contentAlign="left">Selector with disabled option</Divider>
    <Selector
      options={sampleDisable}
      defaultValue={["2"]}
      onChange={(arr: any, ext: any) => handleLog(arr, ext)}
    />
    <br />
    <Divider contentAlign="left">Selector with disabled state</Divider>
    <Selector options={sampleData} defaultValue={["1"]} disabled />
    <br />
    <Divider contentAlign="left">Selector with custom fieldName</Divider>
    <Selector
      options={customData}
      fieldNames={{
        label: "name",
        value: "code",
        disabled: "closable",
      }}
      defaultValue={["one", "two"]}
      onChange={(arr: any, ext: any) => handleLog(arr, ext)}
      multiple
    />
    <br />
  </>
);

export default Example;

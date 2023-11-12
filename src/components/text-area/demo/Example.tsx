import React from "react";
import { TextArea, Divider } from "../../index";

// Example FC
const Example = () => (
  <>
    <Divider contentAlign="left">
      TextArea autoSize feature - Boolean autoSize (start from 2 rows)
    </Divider>
    <TextArea placeholder="Please input content" autoSize={true} />

    <Divider contentAlign="left">
      TextArea autoSize feature - Customize autoSize config (minRows: 3,
      maxRows: 6)
    </Divider>
    <TextArea
      placeholder="Please input content"
      autoSize={{ minRows: 3, maxRows: 6 }}
    />

    <Divider contentAlign="left">TextArea with 3 rows</Divider>
    <TextArea placeholder="Please input content" rows={3} />

    <Divider contentAlign="left">TextArea showCount feature</Divider>
    <TextArea
      placeholder="Please input content"
      defaultValue={"These are demo lines\nshowing different words."}
      showCount
      maxLength={50}
    />

    <Divider contentAlign="left">TextArea with disabled mode</Divider>
    <TextArea value={"This TextArea demo \nis disabled mode."} disabled />

    <Divider contentAlign="left">TextArea with readonly mode</Divider>
    <TextArea value={"This TextArea demo \nis readonly mode."} readOnly />
  </>
);

export default Example;

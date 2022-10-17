import React from "react";
import { Rate, Icon, Divider } from "rui-next";
import { logInfo } from "../../experimental";

// Example FC
const Example = () => (
  <>
    <Divider contentAlign="left">
      Basic Rate with Callback function (`RUI-log` in Console log)
    </Divider>
    <Rate onChange={(v: number) => logInfo(`rate-content: ${v}`)} />
    <Divider contentAlign="left">Readonly mode</Divider>
    <Rate readonly value={3} count={10} />
    <Divider contentAlign="left">Allow half-star</Divider>
    <Rate
      allowHalf
      defaultValue={3.5}
      character={<Icon type="star" size="lg" />}
    />
    <Divider contentAlign="left">Customized character and styles</Divider>
    <Rate defaultValue={3} character="R" activeColor="red" />
    <br />
    <br />
    <Rate
      allowHalf
      defaultValue={2.5}
      character="加"
      activeColor="#36C"
      size={48}
      onChange={(v: number) => logInfo(`rate-content: ${v}`)}
    />
  </>
);

export default Example;

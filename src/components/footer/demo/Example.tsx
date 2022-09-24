import React from "react";
import { Footer, Divider } from "rui-next";

// Example FC
const Example = () => (
  <>
    <Divider contentAlign="left">
      Footer combination
    </Divider>
    <Footer
      label="The extra information"
      links={[
        { text: "docs", url: "https://nikoni.top/rui-next/" },
        { text: "demos", url: "https://nikoni.top/rui-next/" },
        { text: "playground", url: "https://nikoni.top/rui-next/en/playground" },
      ]}
      content="@ 2022-present RUI.next (MIT License)."
      chips={[
        { content: "react-hooks" },
        { content: "vite 3" },
        { content: "typescript" },
      ]}
    />
  </>
);

export default Example;

import React from "react";
import { Footer, Divider } from "../../index";

// Example FC
const Example = () => (
  <>
    <Divider contentAlign="left">Footer combination</Divider>
    <Footer
      label="The extra information"
      links={[
        { text: "docs", url: "https://nikoni.top/rui-next/" },
        { text: "demos", url: "https://nikoni.top/rui-next/" },
        {
          text: "playground",
          url: "https://nikoni.top/rui-next/components/playground/playground.html",
        },
      ]}
      content="Copyright @ 2021-present RUI.next. Built with Vite & React."
      chips={[
        { content: "react-hooks" },
        { content: "vite 5" },
        { content: "typescript" },
      ]}
    />
  </>
);

export default Example;

import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, Divider } from "rui-next";
import "./index.less";

// Example FC
const Example = () => {
  let closeTimer: ReturnType<typeof setTimeout>;
  const [animating, setAnimating] = useState(false);

  const wrapperStyle = {
    color: "orange",
    fontSize: 36,
  };

  // useEffect hook - clear timer when unmount
  useEffect(() => () => clearTimeout(closeTimer), []);

  // show toast with animating
  const showToast = () => {
    setAnimating(true);
    closeTimer = setTimeout(() => setAnimating(false), 2000);
  };

  return (
    <>
      <Divider contentAlign="left">Carousel Circle loading style</Divider>
      <div className="loading-example">
        <ActivityIndicator carousel="circle" size={16} />
      </div>

      <Divider contentAlign="left">
        Carousel Rect loading style (auto adapt to the color/font-size of
        wrapper)
      </Divider>
      <div className="loading-example" style={wrapperStyle}>
        <ActivityIndicator carousel="rect" color="currentColor" />
      </div>

      <Divider contentAlign="left">Without text</Divider>
      <div className="loading-example">
        <ActivityIndicator animating />
      </div>

      <Divider contentAlign="left">With text</Divider>
      <div className="loading-example">
        <ActivityIndicator text="Loading..." />
      </div>

      <Divider contentAlign="left">
        With large size and customized text alignment
      </Divider>
      <div className="loading-example">
        <div className="alignment">
          <ActivityIndicator sizeType="large" />
          <span>Loading content</span>
        </div>
      </div>

      <Divider contentAlign="left">Toast mode of activity-indicator</Divider>
      <Button size="small" inline onClick={() => showToast()}>
        Click to show Toast
      </Button>
      <ActivityIndicator toast text="Loading..." animating={animating} />
    </>
  );
};

export default Example;

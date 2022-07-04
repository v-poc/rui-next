import React from "react";
import { Divider } from "../../index";
import { LikeButton, logInfo } from "../../experimental";

const handleClick = () => logInfo("So cool, nice feeling!");

// Example FC
const Example = () => (
  <>
    <Divider contentAlign="left">
      LikeButton with Callback function (`RUI-log` in Console log)
    </Divider>
    <LikeButton scale={0.4} callback={handleClick} />

    <Divider contentAlign="left">Customize LikeButton</Divider>
    <LikeButton
      scale={0.8}
      callback={handleClick}
      heartColor="#03a9f4"
      lineColors={[
        "#9c27b0",
        "#3f51b5",
        "#00bcd4",
        "#009688",
        "#4caf50",
        "#cddc39",
        "#ffeb3b",
        "#ffc107",
        "#ff9800",
        "#795548",
        "#9e9e9e",
        "#000000",
      ]}
    />
  </>
);

export default Example;

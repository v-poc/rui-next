import React from "react";
import { Divider } from "rui-next";
import { Chart } from "../../experimental";

// Example FC
const Example = () => (
  <>
    <Divider contentAlign="left">
      Line and Area-fill Chart
    </Divider>
    <Chart
      size={["8rem", "5rem"]}
      max={60}
      min={0}
      step={10}
      format={(val: number) => `${val}%`}
      labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
      datasets={[
        {
          width: 0.2,
          values: [9, 16, 21, 24, 21, 31, 33, 39, 37, 41, 51, 56, 53],
        },
        {
          color: "#5e64ff",
          width: 0.5,
          theme: "region",
          values: [4, 11, 16, 13, 16, 26, 22, 34, 32, 30, 46, 51, 55],
        }        
      ]}
    />

    <Divider contentAlign="left">
      Gradient-line Chart
    </Divider>
    <Chart
      size={["8rem", "5rem"]}
      max={60}
      min={0}
      step={10}
      labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
      datasets={[
        {
          color: "#3366cc",
          width: 1,
          theme: "heat",
          values: [3, 10, 15, 12, 15, 25, 21, 33, 31, 29, 45, 50, 54],
        }        
      ]}
    />
  </>
);

export default Example;

import React from "react";
import { Grid, Divider } from "../../index";
import "./index.less";

// PlaceHolder FC
const PlaceHolder = ({
  className = "",
  ...restProps
}) => (
  <div className={`${className} placeholder`} {...restProps}>
    Block
  </div>
);

// Example FC
const Example = () => (
  <>
    <Divider
      contentAlign="left"
    >
      Grid with item Span
    </Divider>
    <Grid
      columns={3}
      gap={3}
    >
      <Grid.Item span={3}>
        <PlaceHolder />
      </Grid.Item>
      <Grid.Item span={2}>
        <PlaceHolder />
      </Grid.Item>
      <Grid.Item>
        <PlaceHolder />
      </Grid.Item>
      <Grid.Item>
        <PlaceHolder />
      </Grid.Item>
      <Grid.Item span={2}>
        <PlaceHolder />
      </Grid.Item>
    </Grid>
  </>
);

export default Example;

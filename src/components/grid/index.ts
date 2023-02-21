import Grid from "./Grid";
import GridItem from "./GridItem";
import { attachPropsToComp } from "../utils/index";

import "../styles/index";
import "./index.less";

export type { GridProps } from "./Grid";
export type { GridItemProps } from "./GridItem";

export default attachPropsToComp(Grid, { Item: GridItem });

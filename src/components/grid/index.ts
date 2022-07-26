import Grid from "./Grid";
import GridItem from "./GridItem";
import { attachPropsToComp } from "../utils/index";

import "../styles/index";
import "./index.less";

export default attachPropsToComp(Grid, { Item: GridItem });

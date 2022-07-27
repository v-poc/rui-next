import List from "./List";
import ListItem from "./ListItem";
import { attachPropsToComp } from "../utils/index";

import "../styles/index";
import "./index.less";

export default attachPropsToComp(List, { Item: ListItem });

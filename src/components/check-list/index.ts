import CheckList from "./CheckList";
import CheckListItem from "./CheckListItem";
import { attachPropsToComp } from "../utils/index";

import "../styles/index";
import "./index.less";

export type { CheckListProps } from "./CheckList";
export type { CheckListItemProps } from "./CheckListItem";

export default attachPropsToComp(CheckList, { Item: CheckListItem });

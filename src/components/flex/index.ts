import Flex from "./Flex";
import FlexItem from "./FlexItem";
import { attachPropsToComp } from "../utils/index";

import "../styles/index";
import "./index.less";

export type { FlexProps } from "./Flex";
export type { FlexItemProps } from "./FlexItem";

export default attachPropsToComp(Flex, { Item: FlexItem });

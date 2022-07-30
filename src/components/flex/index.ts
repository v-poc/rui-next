import Flex from "./Flex";
import FlexItem from "./FlexItem";
import { attachPropsToComp } from "../utils/index";

import "../styles/index";
import "./index.less";

export default attachPropsToComp(Flex, { Item: FlexItem });

import { SideBar } from "./SideBar";
import { SideBarItem } from "./SideBarItem";
import { attachPropsToComp } from "../utils/index";

// import "../styles/index";
import "./index.less";

export type { SideBarProps } from "./SideBar";
export type { SideBarItemProps } from "./SideBarItem";

export default attachPropsToComp(SideBar, { Item: SideBarItem });

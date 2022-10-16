import { show, clear, config } from "./ToastUtils";

// import "../styles/index";
import "./index.less";

export type { ToastShowProps, ToastHandler } from "./ToastUtils";

const Toast = {
  show,
  clear,
  config,
};

export default Toast;

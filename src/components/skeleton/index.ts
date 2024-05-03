import { Skeleton, SkeletonTitle, SkeletonParagraph } from "./Skeleton";
import { attachPropsToComp } from "../utils/index";

import "../styles/index";
import "./index.less";

export type { SkeletonProps, SkeletonTitleProps } from "./Skeleton";

export default attachPropsToComp(Skeleton, {
  Title: SkeletonTitle,
  Paragraph: SkeletonParagraph,
});

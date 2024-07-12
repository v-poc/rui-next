import React from "react";
import classnames from "classnames";
import CardHeader from "./Header";
import CardBody from "./Body";
import CardFooter from "./Footer";
import { attachPropsToComp } from "../utils/index";

// CardProps Type
export type CardProps = React.HTMLProps<HTMLDivElement> & {
  prefixCls?: string;
  full?: boolean;
};

// Card FC
const Card: React.FC<CardProps> = (props) => {
  const {
    prefixCls = "r-card",
    full = false,
    className,
    ...resetProps
  } = props;

  const wrapCls = classnames(prefixCls, className, {
    [`${prefixCls}-full`]: full,
  });

  return <div className={wrapCls} {...resetProps} />;
};

// Card.Header = CardHeader;
// Card.Body = CardBody;
// Card.Footer = CardFooter;

export default attachPropsToComp(Card, {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
});

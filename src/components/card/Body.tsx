import React from "react";
import classnames from "classnames";

// CardBodyProps Type
export type CardBodyProps = React.HTMLProps<HTMLDivElement> & {
  prefixCls?: string;
  className?: string;
};

// CardBody FC
const CardBody: React.FC<CardBodyProps> = (props) => {
  const { prefixCls = "r-card", className, ...restProps } = props;

  const wrapCls = classnames(`${prefixCls}-body`, className);

  return <div className={wrapCls} {...restProps} />;
};

export default CardBody;

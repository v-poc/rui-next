import React, { ReactNode } from "react";
import classnames from "classnames";

// ListProps Type
export type ListProps = {
  prefixCls?: string;
  children?: ReactNode;
  mode?: "default" | "card";
};

// List FC
const List: React.FC<ListProps> = (props) => {
  const { prefixCls = "r-list", children, mode = "default" } = props;

  const wrapCls = classnames(prefixCls, `${prefixCls}-${mode}`);

  return (
    <div className={wrapCls}>
      <div className={`${prefixCls}-inner`}>{children}</div>
    </div>
  );
};

export default List;

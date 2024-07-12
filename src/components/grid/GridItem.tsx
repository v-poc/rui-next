import React from "react";
import type { CSSProperties, ReactNode } from "react";

type StyleProps = CSSProperties & {
  "--item-span"?: string;
};

// GridItemProps Type
export type GridItemProps = {
  prefixCls?: string;
  span?: number;
  onClick?: (e: React.MouseEvent) => void;
  children?: ReactNode;
};

// GridItem FC
const GridItem: React.FC<GridItemProps> = (props) => {
  const { prefixCls = "r-grid", span = 1, onClick, children } = props;

  const itemStyle: StyleProps = {
    "--item-span": span?.toString(),
  };

  return (
    <div className={`${prefixCls}-item`} style={itemStyle} onClick={onClick}>
      {children}
    </div>
  );
};

export default GridItem;

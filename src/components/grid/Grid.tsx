import React from "react";
import type { CSSProperties, ReactNode } from "react";
import { getCSSLength } from "../utils/index";

type StyleProps = CSSProperties & {
  "--columns"?: string;
};

// GridProps Type
export type GridProps = {
  prefixCls?: string;
  columns: number;
  gap?: number | string | [number | string, number | string];
  children?: ReactNode;
};

// Grid FC
const Grid: React.FC<GridProps> = (props) => {
  const { prefixCls, columns, gap, children } = props;

  const wrapStyle: StyleProps = {
    "--columns": columns.toString(),
  };

  if (gap !== undefined) {
    if (Array.isArray(gap)) {
      const gapH = gap[0];
      const gapV = gap[1];
      wrapStyle["columnGap"] = getCSSLength(gapH);
      wrapStyle["rowGap"] = getCSSLength(gapV);
    } else {
      const g = getCSSLength(gap);
      wrapStyle["columnGap"] = g;
      wrapStyle["rowGap"] = g;
    }
  }

  return (
    <div className={prefixCls} style={wrapStyle}>
      {children}
    </div>
  );
};

Grid.defaultProps = {
  prefixCls: "r-grid",
  gap: 0,
};

export default Grid;

import React from "react";
import classnames from "classnames";

// TicksProps type
export type TicksProps = {
  prefixCls?: string;
  min: number;
  max: number;
  points: number[];
  rangeLeft: number;
  rangeRight: number;
};

// Ticks FC
export const Ticks: React.FC<TicksProps> = (props) => {
  const {
    prefixCls = "r-slider",
    min,
    max,
    points,
    rangeRight,
    rangeLeft,
  } = props;

  return (
    <div className={`${prefixCls}-ticks`}>
      {points.length > 0 &&
        points.map((pItem: any) => {
          const offset = `${(100 * Math.abs(pItem - min)) / (max - min)}%`;
          const isActive = pItem <= rangeRight && pItem >= rangeLeft;
          const itemCls = classnames(`${prefixCls}-tick`, {
            [`${prefixCls}-tick-active`]: isActive,
          });

          return (
            <span
              key={`point${pItem}`}
              className={itemCls}
              style={{
                left: offset,
              }}
            ></span>
          );
        })}
    </div>
  );
};

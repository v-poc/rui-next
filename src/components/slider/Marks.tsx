import React, { ReactNode } from "react";
import classnames from "classnames";

// SliderMarks type
export type SliderMarks = {
  [key: number]: ReactNode;
};

// MarksProps type
export type MarksProps = {
  prefixCls?: string;
  marks: SliderMarks;
  min: number;
  max: number;
  rangeLeft: number;
  rangeRight: number;
};

// Marks FC
export const Marks: React.FC<MarksProps> = (props) => {
  const {
    prefixCls,
    marks,
    min,
    max,
    rangeLeft,
    rangeRight,
  } = props;

  const marksKeys = Object.keys(marks)
    .map(parseFloat)
    .sort((a, b) => a - b)
    .filter((point) => point >= min && point <= max);

  return (
    <div className={`${prefixCls}-mark`}>
      {marksKeys.length > 0 && marksKeys.map((pItem: any) => {
        const markPoint = marks[pItem];

        const offset = `${100 * Math.abs(pItem - min) / (max - min)}%`;
        const isActive = pItem <= rangeRight && pItem >= rangeLeft;
        const itemCls = classnames(
          `${prefixCls}-mark-text`,
          {
            [`${prefixCls}-mark-text-active`]: isActive,
          }
        );

        return (markPoint || markPoint === 0) && (
          <span
            key={`markPoint${pItem}`}
            className={itemCls}
            style={{
              left: offset,
            }}
          >
            {markPoint}
          </span>
        );
      })}
    </div>
  );
};

Marks.defaultProps = {
  prefixCls: 'r-slider',
};

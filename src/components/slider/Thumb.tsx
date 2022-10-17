import React, { ReactNode, useRef } from "react";
import { useGestureDrag } from "../hooks/useGestureDrag/index";

const ThumbIcon = (
  <svg viewBox="0 0 20 20">
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g transform="translate(-604.000000, -656.000000)" fill="#999999">
        <g transform="translate(592.000000, 644.000000)">
          <g transform="translate(12.000000, 12.000000)">
            <polygon points="0 3.33333333 2.22222222 3.33333333 2.22222222 17.7777778 0 17.7777778" />
            <polygon points="17.7777778 3.33333333 20 3.33333333 20 17.7777778 17.7777778 17.7777778" />
            <path d="M10.8888889,0 L9.11111111,0 C8.98888889,0 8.88888889,0.107142857 8.88888889,0.238095238 L8.88888889,19.7619048 C8.88888889,19.8928571 8.98888889,20 9.11111111,20 L10.8888889,20 C11.0111111,20 11.1111111,19.8928571 11.1111111,19.7619048 L11.1111111,0.238095238 C11.1111111,0.107142857 11.0111111,0 10.8888889,0 Z" />
          </g>
        </g>
      </g>
    </g>
  </svg>
);

// ThumbProps type
export type ThumbProps = {
  prefixCls?: string;
  value: number;
  min: number;
  max: number;
  disabled: boolean;
  icon?: ReactNode;
  trackRef: React.MutableRefObject<HTMLDivElement | null>;
  onDrag: (value: number, first: boolean, last: boolean) => void;
};

// Thumb FC
export const Thumb: React.FC<ThumbProps> = (props) => {
  const { prefixCls, value, min, max, disabled, icon, trackRef, onDrag } =
    props;

  const valueRef = useRef(value);

  const wrapStyle = () => ({
    left: `${(100 * (value - min)) / (max - min)}%`,
    right: "auto",
  });

  const dragProps = useGestureDrag(
    (_state) => {
      if (disabled) {
        return;
      }

      const offsetW = trackRef.current?.offsetWidth;
      if (!offsetW) {
        return;
      }

      if (_state.first) {
        valueRef.current = value;
      }

      const x = _state.xy[0] - _state.initial[0];
      const delta = ((max - min) * x) / Math.ceil(offsetW);
      onDrag(valueRef.current + delta, _state.first, _state.last);
    },
    {
      axis: "x",
      pointer: { touch: true },
    }
  );

  return (
    <div
      className={`${prefixCls}-thumb-container`}
      style={wrapStyle()}
      {...dragProps()}
    >
      <div className={`${prefixCls}-thumb`}>
        {icon ? (
          icon
        ) : (
          <div className={`${prefixCls}-thumb-icon`}>{ThumbIcon}</div>
        )}
      </div>
    </div>
  );
};

Thumb.defaultProps = {
  prefixCls: "r-slider",
};

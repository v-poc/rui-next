import React, { ReactNode, useMemo, useRef } from "react";
import classnames from "classnames";
import { Thumb } from "./Thumb";
import { Ticks } from "./Ticks";
import { Marks, SliderMarks } from "./Marks";
import { getNearest, sortValue } from "../utils/index";
import usePropsValue from "../hooks/usePropsValue/index";

// SliderValue type
export type SliderValue = number | [number, number];

// SliderProps type
export type SliderProps = {
  prefixCls?: string;
  className?: string;
  defaultValue?: SliderValue;
  value?: SliderValue;
  min?: number;
  max?: number;
  disabled?: boolean;
  icon?: ReactNode;
  range?: boolean;
  step?: number;
  marks?: SliderMarks;
  ticks?: boolean;
  onChange?: (v: SliderValue) => void;
  onAfterChange?: (v: SliderValue) => void;
};

// Slider FC
export const Slider: React.FC<SliderProps> = (props) => {
  const {
    prefixCls = "r-slider",
    className,
    defaultValue,
    value,
    min = 0,
    max = 100,
    disabled = false,
    icon,
    marks,
    ticks = false,
    range = false,
    step = 1,
    onChange,
    onAfterChange,
  } = props;

  const trackRef = useRef<HTMLDivElement>(null);
  const dragLockRef = useRef(0);
  const valueBeforeDragRef = useRef<[number, number]>();

  const [rawValue, setRawValue] = usePropsValue<SliderValue>({
    value,
    defaultValue: defaultValue ?? (range ? [min, min] : min),
    onChange,
  });

  const convertValue = (val: SliderValue): [number, number] => {
    return (range ? val : [min, val]) as any;
  };

  const reverseValue = (val: [number, number]): SliderValue => {
    return range ? val : val[1];
  };

  const doAfterChange = (val: [number, number]) => {
    onAfterChange?.(reverseValue(val));
  };

  const sliderValue = sortValue(convertValue(rawValue));

  const setSliderValue = (val: [number, number]) => {
    const next = sortValue(val);
    const current = sliderValue;
    if (next[0] === current[0] && next[1] === current[1]) {
      return;
    }
    setRawValue(reverseValue(next));
  };

  const pointsList = useMemo(() => {
    if (marks) {
      return Object.keys(marks)
        .map(parseFloat)
        .sort((a, b) => a - b);
    }

    const res: number[] = [];
    for (let i = min; i <= max; i += step) {
      res.push(i);
    }
    return res;
  }, [marks, min, max, step]);

  const getValueByPosition = (pos: number) => {
    const newPos = pos < min ? min : pos > max ? max : pos;
    let val = min;

    if (pointsList.length) {
      // Move to the tick point if the Ticks are displayed.
      val = getNearest(pointsList, newPos);
    } else {
      const lenPerStep = 100 / ((max - min) / step);
      const steps = Math.round(newPos / lenPerStep);
      val = steps * lenPerStep * (max - min) * 0.01 + min;
    }

    return val;
  };

  const onClickTrack = (e: React.MouseEvent) => {
    if (dragLockRef.current > 0) {
      return;
    }

    e.stopPropagation();

    if (disabled || !trackRef.current) {
      return;
    }

    const offsetL = trackRef.current?.getBoundingClientRect().left;
    const pos =
      ((max - min) * (e.clientX - offsetL)) /
        Math.ceil(trackRef.current.offsetWidth) +
      min;
    const targetValue = getValueByPosition(pos);
    let nextSliderValue: [number, number] = [min, targetValue];
    if (range) {
      if (
        Math.abs(targetValue - sliderValue[0]) >
        Math.abs(targetValue - sliderValue[1])
      ) {
        nextSliderValue = [sliderValue[0], targetValue];
      } else {
        nextSliderValue = [targetValue, sliderValue[1]];
      }
    }

    setSliderValue(nextSliderValue);
    doAfterChange(nextSliderValue);
  };

  const fillW = `${(100 * (sliderValue[1] - sliderValue[0])) / (max - min)}%`;

  const fillL = `${(100 * (sliderValue[0] - min)) / (max - min)}%`;

  const wrapCls = classnames(prefixCls, className, {
    [`${prefixCls}-disabled`]: disabled,
  });

  const renderThumb = (index: number) => (
    <Thumb
      key={`thumb${index}`}
      value={sliderValue[index]}
      min={min}
      max={max}
      disabled={!!disabled}
      icon={icon}
      trackRef={trackRef}
      onDrag={(pos, first, last) => {
        if (first) {
          dragLockRef.current += 1;
          valueBeforeDragRef.current = sliderValue;
        }
        const val = getValueByPosition(pos);
        if (!valueBeforeDragRef.current) {
          return;
        }
        const next: [number, number] = [...valueBeforeDragRef.current];
        next[index] = val;
        setSliderValue(next);
        if (last) {
          doAfterChange(next);
          setTimeout(() => {
            dragLockRef.current -= 1;
          }, 100);
        }
      }}
    />
  );

  return (
    <div className={wrapCls}>
      <div className={`${prefixCls}-track-container`} onClick={onClickTrack}>
        <div
          ref={trackRef}
          className={`${prefixCls}-track`}
          onClick={onClickTrack}
        >
          <div
            className={`${prefixCls}-fill`}
            style={{
              width: fillW,
              left: fillL,
            }}
          ></div>
          {ticks && (
            <Ticks
              min={min}
              max={max}
              points={pointsList}
              rangeLeft={sliderValue[0]}
              rangeRight={sliderValue[1]}
            />
          )}
          {range && renderThumb(0)}
          {renderThumb(1)}
        </div>
      </div>
      {marks && (
        <Marks
          marks={marks}
          min={min}
          max={max}
          rangeLeft={sliderValue[0]}
          rangeRight={sliderValue[1]}
        />
      )}
    </div>
  );
};

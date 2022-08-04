import React, { Fragment, useEffect, useState } from "react";
import useEventListener from '../hooks/useEventListener/index';

// ChartProps type
export type ChartProps = {
  prefixCls?: string;
  labels: any[]; // The labels of X-Axis
  datasets: any[]; // The chart data
  size: number[] | string[]; // The size of chart
  max: number; // The maximum in Y-Axis
  min: number; // The minimum in Y-Axis
  lines: number; // The number of lines in Y-Axis
  step: number; // The decreasing step in Y-Axis
  shift: number; // The shift in Y-Axis
  format: (val: any) => any; // The labels formatting function in Y-Axis
};

// Chart FC
export const Chart: React.FC<ChartProps> = (props) => {
  const {
    labels,
    datasets,
    size,
    max,
    min,
    lines,
    step,
    shift,
    format,
    prefixCls,
  } = props;

  // get Max
  const getMax = () => {
    let max = Math.max.apply(
      Math,
      datasets.map((data) => Math.max.apply(Math, data.values)),
    )
    let multiply = 1;
    while (max > 10) {
      multiply *= 10;
      max /= 10;
    }
    max = Math.ceil(max) * multiply;
    return max;
  };

  // get Min
  const getMin = () => {
    let min = Math.min.apply(
      Math,
      datasets.map((data) => Math.min.apply(Math, data.values)),
    )
    let multiply = 1;
    while (min > 10) {
      multiply *= 10;
      min /= 10;
    }
    min = Math.floor(min) * multiply;
    return min;
  };

  // get Step
  const getStep = () => (getMax() - getMin()) / lines;

  // params state
  const [params, setParams] = useState({
    unit: 16,
    max: max || getMax(),
    min: min || getMin(),
    step: step || getStep(),
  });

  // get stop style
  const getStopStyle = (color: string) => {
    return {
      stopColor: color,
    }
  };

  // get offset
  const getOffset = () => {
    const unit = params.unit;
    return {
      top: 0.2 * unit,
      bottom: 0.5 * unit,
      left: shift * unit,
      right: 0.2 * unit,
    }
  };

  // get width
  const getWidth = () => {
    if (
      typeof size[0] === "string" &&
      size[0].indexOf("rem") !== -1
    ) {
      return parseFloat(size[0]) * params.unit;
    } else {
      return parseFloat(size[0] as string);
    }
  };

  // get height
  const getHeight = () => {
    if (
      typeof size[1] === "string" &&
      size[1].indexOf("rem") !== -1
    ) {
      return parseFloat(size[1]) * params.unit;
    } else {
      return parseFloat(size[1] as string);
    }
  };

  // get innerWidth
  const getInnerWidth = () => {
    const offset = getOffset();
    return getWidth() - offset.left - offset.right;
  };

  // get innerHeight
  const getInnerHeight = () => {
    const offset = getOffset();
    return getHeight() - offset.top - offset.bottom;
  };

  // get x axis
  const xAxis = () => {
    const deltaX = getInnerWidth() / (labels.length - 1);
    const items = labels.map((label, index) => {
      return {
        offset: index * deltaX,
        label,
      }
    });
    return items;
  };

  // get y axis
  const yAxis = () => {
    const items: any = [];
    const deltaY = getInnerHeight() / lines;

    for (let i = 0; i < lines; i++) {
      items.push({
        offset: i * deltaY,
        label: format(params.max - i * params.step),
      });
    }

    items.push({
      offset: getInnerHeight(),
      label: format(params.min),
    });
    return items;
  };

  // get lower
  const getLower = () => params.max - (lines - 1) * params.step;

  // get paths
  const getPaths = () => {
    return datasets.map((data) => {
      const deltaX = getInnerWidth() / (data.values.length - 1);
      const deltaY = getInnerHeight() / lines;
      const points = data.values.map((value: number, index: number) => {
        const lowerVal = getLower();
        if (value < lowerVal) {
          return {
            x: index * deltaX,
            y:
              getInnerHeight() -
              (1 - (lowerVal - value) / (lowerVal - params.min)) * deltaY,
          };
        } else {
          return {
            x: index * deltaX,
            y:
              (1 - (value - lowerVal) / (params.max - lowerVal)) *
              (getInnerHeight() - deltaY),
          };
        }
      });

      const ret: any = {
        style: {
          fill: "none",
          stroke: data.color || "#fa8919",
          strokeWidth: data.width || 1,
        },
      };

      if (data.theme === "heat") {
        ret.style.stroke = `url(#path-fill-gradient-${data.color})`;
      } else if (data.theme === "region") {
        ret.area = {
          value:
            `M0,${getInnerHeight()} ` +
            points.map((point: { x?: number; y?: number; }) => `L${point.x},${point.y}`).join(" ") +
            ` L${points[points.length - 1].x},${getInnerHeight()}`,
          style: {
            fill: `url(#path-fill-gradient-${data.color})`,
            stroke: "none",
          },
        };
      }

      ret.value =
        `M0,${points.shift().y} ` +
        points.map((point: { x?: number; y?: number; }) => `L${point.x},${point.y}`).join(" ");
      return ret;
    });
  };

  // get colors
  const getColors = () => {
    const uniqueColors: string[] = [];
    datasets.forEach((data) => {
      if (data?.color && uniqueColors.indexOf(data?.color) === -1) {
        uniqueColors.push(data?.color);
      }
    });
    return uniqueColors;
  };

  // resize event
  const handleResize = () => {    
    setParams({
      ...params,
      unit: parseFloat(
        window
          .getComputedStyle(document.getElementsByTagName("html")[0])
          .getPropertyValue("font-size")
      ),
    });
  };

  // useEffect hook
  useEffect(() => {
    if (document.readyState !== 'loading') {
      handleResize();
    }
  }, []);

  // useEventListener hook
  useEventListener(
    "DOMContentLoaded",
    handleResize,
    {
      target: () => document,
    }
  );

  useEventListener(
    "resize",
    handleResize,
    {
      target: () => window,
    }
  );

  return (
    <svg
      className={prefixCls}
      viewBox={`0 0 ${getWidth()} ${getHeight()}`}
    >
      <defs>
        {getColors().map((color) => (
          <linearGradient
            key={color}
            id={`path-fill-gradient-${color}`}
            x1={0}
            x2={0}
            y1={0}
            y2={1}
          >
            <stop
              offset={"0%"}
              stopOpacity={0.4}
              style={getStopStyle(color)}
            ></stop>
            <stop
              offset={"50%"}
              stopOpacity={0.3}
              style={getStopStyle(color)}
            ></stop>
            <stop
              offset={"100%"}
              stopOpacity={0.1}
              style={getStopStyle(color)}
            ></stop>
          </linearGradient>
        ))}
      </defs>
      <g
        transform={`translate(${getOffset().left}, ${getOffset().top})`}
      >
        <g className={`${prefixCls}-axis-y`}>
          {yAxis().map((item: { offset?: number; label?: string; }, index: number) => (
            <g
              key={`y-axis-${index}`}
              transform={`translate(0, ${item.offset})`}
            >
              <line
                x1={0}
                x2={getInnerWidth()}
                y1={0}
                y2={0}
              />
              <text
                x={0}
                y={0}
                dx={"-0.6em"}
                dy={0.5}
              >
                { item.label }
              </text>
            </g>
          ))}
        </g>
        <g
          className={`${prefixCls}-axis-x`}
          transform={`translate(0, ${getInnerHeight()})`}
        >
          {xAxis().map((item, index) => (
            <g
              key={`x-axis-${index}`}
              transform={`translate(${item.offset}, 0)`}
            >
              <line
                x1={0}
                x2={0}
                y1={0}
                y2={2}
              />
              <text
                x={0}
                y={0}
                dy={5}
              >
                { item.label }
              </text>
            </g>
          ))}
        </g>
        <g>
          {getPaths().map((path, index) => (
            <Fragment
              key={`${path.area ? 'area' : 'line'}-${index}`}
            >
              <path
                style={path.style}
                d={path.value}
              />
              {path.area && (
                <path
                  style={path.area.style}
                  d={path.area.value}
                />
              )}
            </Fragment>
          ))}
        </g>
      </g>
    </svg>
  );
};

Chart.defaultProps = {
  prefixCls: "r-chart",
  labels: [],
  datasets: [],
  size: [480, 320],
  max: 0,
  min: 0,
  lines: 5,
  step: 0,
  shift: 0.6,
  format: (val) => val,
};

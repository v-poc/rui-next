import React from "react";

const circleAnimateValues = [
  [1, 0.8, 0.6, 0.6, 0.6, 0.8, 1],
  [0.6, 0.8, 1, 0.8, 0.6, 0.6, 0.6],
  [0.6, 0.6, 0.6, 0.8, 1, 0.8, 0.6],
];

// CarouselCircleProps Type
export type CarouselCircleProps = {
  prefixCls?: string;
  size?: number;
  color?: string;
};

// CarouselCircle FC
const CarouselCircle: React.FC<CarouselCircleProps> = (props) => {
  const { size = 0, color, prefixCls } = props;

  const viewWidth = () => {
    const len = circleAnimateValues.length;
    return len * size + ((len - 1) * size) / 2;
  };

  const containerStyle = () => {
    return {
      width: `${viewWidth()}px`,
      height: `${size}px`,
    };
  };

  const getCx = (index: number) => index * size * 1.5 + size / 2;

  const opacityValues = (animateValues: number[]) => animateValues.join(";");

  const sizeValues = (animateValues: number[]) =>
    animateValues.map((val) => (val * size) / 2).join(";");

  return (
    <div className={prefixCls}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="r-activity-indicator-svg carouseling"
        viewBox={`0 0 ${viewWidth()} ${size}`}
        fill={color}
        style={containerStyle()}
      >
        {circleAnimateValues.map((value, index) => (
          <circle
            key={`carousel-circle-${index}`}
            cx={getCx(index)}
            cy={size / 2}
            r={size / 2}
          >
            <animate
              attributeName="fill-opacity"
              attributeType="XML"
              begin="0s"
              dur="1s"
              calcMode="linear"
              repeatCount="indefinite"
              values={opacityValues(value)}
            />
            <animate
              attributeName="r"
              attributeType="XML"
              begin="0s"
              dur="1s"
              calcMode="linear"
              repeatCount="indefinite"
              values={sizeValues(value)}
            />
          </circle>
        ))}
      </svg>
    </div>
  );
};

CarouselCircle.defaultProps = {
  prefixCls: "r-activity-indicator-carousel-circle",
  size: 30,
  color: "#2F86F6",
};

export default CarouselCircle;

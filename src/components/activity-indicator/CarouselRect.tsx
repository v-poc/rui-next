import React from "react";

// CarouselRectProps Type
export type CarouselRectProps = {
  prefixCls?: string;
  color?: "default" | "primary" | "white" | string;
};

// CarouselRect FC
const CarouselRect: React.FC<CarouselRectProps> = (props) => {
  const {
    color,
    prefixCls,
  } = props;

  return (
    <div
      className={prefixCls}
      style={{
        color
      }}
    >
      <svg
        height="1em"
        viewBox="0 0 100 40"
        style={{
          verticalAlign: "-0.125em"
        }}
      >
        <g
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <g
            transform="translate(-100.000000, -71.000000)"
          >
            <g
              transform="translate(95.000000, 71.000000)"
            >
              <g
                transform="translate(5.000000, 0.000000)"
              >
                {[0, 1, 2].map((item) => (
                  <rect
                    key={`rect${item}`}
                    fill="currentColor"
                    rx={2}
                    x={20 + item * 24}
                    y={16}
                    width={8}
                    height={8}
                  >
                    <animate
                      id="dot-anim"
                      attributeName="y"
                      from={16}
                      to={16}
                      dur="2s"
                      begin={`${item * 0.2}s`}
                      repeatCount="indefinite"
                      values="16; 6; 24; 16; 16"
                      keyTimes="0; 0.1; 0.3; 0.4; 1"
                    />
                  </rect>
                ))}
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};

CarouselRect.defaultProps = {
  prefixCls: "r-activity-indicator-carousel-rect",
  color: "default",
};

export default CarouselRect;

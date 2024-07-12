import React from "react";

// OnePieceProps type
export type OnePieceProps = {
  prefixCls?: string;
  scale?: number;
};

// OnePiece FC
export const OnePiece: React.FC<OnePieceProps> = (props) => {
  const { prefixCls = "r-op", scale = 1 } = props;

  return (
    <div className={`${prefixCls}-wrapper`}>
      <div className={prefixCls} style={{ transform: `scale(${scale})` }}>
        <div className="bone"></div>
        <div className="bone"></div>
        <div className="bone"></div>
        <div className="bone"></div>
        <div className="head">
          <div className="hat">
            <div className="line-lt"></div>
            <div className="line-rt"></div>
          </div>
          <div className="eye eye-lt"></div>
          <div className="eye eye-rt"></div>
        </div>
        <div className="mouth">
          <div className="teeth"></div>
        </div>
      </div>
    </div>
  );
};

import React from "react";
import classnames from "classnames";
import Icon from "../icon/index";
import usePropsValue from "../hooks/usePropsValue/index";

type itemStyleType = {
  fontSize?: string;
  lineHeight?: string;
  color?: string;
};

// RateProps type
export type RateProps = {
  prefixCls?: string;
  className?: string;
  allowClear?: boolean;
  allowHalf?: boolean;
  character?: React.ReactNode;
  count?: number;
  defaultValue?: number;
  readonly?: boolean;
  value?: number;
  onChange?: (value: number) => void;
  activeColor?: string;
  size?: number;
};

// Rate FC
export const Rate: React.FC<RateProps> = (props) => {
  const {
    prefixCls,
    className,
    count,
    allowHalf,
    character,
    readonly,
    allowClear,
    defaultValue,
    value,
    onChange,
    activeColor,
    size,
  } = props;

  const [val, setVal] = usePropsValue(props);

  const starList = Array(count).fill("");

  const handleClick = (v: number) => {
    if (readonly) {
      return;
    }

    setVal(
      allowClear && val === v
        ? 0
        : v
    );
  };

  const renderStarItem = (
    v: number,
    isHalf: boolean
  ) => {
    const itemStyle: itemStyleType = {
      fontSize: `${size}px`,
      lineHeight: `${size}px`,
    };

    if (v <= val) {
      itemStyle["color"] = activeColor;
    }

    const itemCls = classnames(
      `${prefixCls}-star`,
      {
        [`${prefixCls}-star-active`]: v <= val,
        [`${prefixCls}-star-half`]: isHalf,
        [`${prefixCls}-star-readonly`]: readonly,
      }
    );

    return (
      <div
        className={itemCls}
        style={itemStyle}
        onClick={() => handleClick(v)}
      >
        {character}
      </div>
    );
  };

  const wrapCls = classnames(
    prefixCls,
    className,
  );

  const boxCls = classnames(`${prefixCls}-box`);

  return (
    <div
      className={wrapCls}
    >
      {starList.map((_, i) => (
        <div
          key={`starItem${i}`}
          className={boxCls}
        >
          {allowHalf && renderStarItem(i + 0.5, true)}
          {renderStarItem(i + 1, false)}
        </div>
      ))}
    </div>
  );
};

Rate.defaultProps = {
  prefixCls: "r-rate",
  count: 5,
  allowHalf: false,
  character: <Icon type="star" />,
  defaultValue: 0,
  readonly: false,
  allowClear: true,
  activeColor: "#FFD21E",
  size: 24,
};

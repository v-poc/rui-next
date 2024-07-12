import React from "react";
import type { CSSProperties } from "react";
import classnames from "classnames";
import { getDataAttr } from "../utils/index";

// SwitchProps Type
export type SwitchProps = {
  prefixCls?: string;
  className?: string;
  platform?: string;
  style?: CSSProperties;
  checked?: boolean;
  disabled?: boolean;
  color?: string;
  name?: string;
  onChange?: (checked: boolean) => void;
  onClick?: (checked?: boolean) => void;
};

// Switch FC
const Switch: React.FC<SwitchProps> = (props) => {
  const {
    prefixCls = "r-switch",
    name = "",
    checked = false,
    disabled = false,
    className,
    platform = "ios",
    color,
    style,
    onChange = () => {},
    onClick = () => {},
    ...restProps
  } = props;

  const dataAttributes = getDataAttr(restProps) || {};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  const handleClick = (e: any) => {
    if (onClick) {
      let val;
      if (e && e.target && e.target.checked !== undefined) {
        val = e.target.checked;
      } else {
        val = checked;
      }

      onClick(val);
    }
  };

  const wrapCls = classnames(prefixCls, className, {
    [`${prefixCls}-android`]: platform === "android",
  });

  const inputCls = classnames("checkbox", {
    [`checkbox-disabled`]: disabled,
  });

  const cssStyle = style || {};
  if (color && checked) {
    cssStyle.backgroundColor = color;
  }

  return (
    <label className={wrapCls}>
      <input
        {...dataAttributes}
        type="checkbox"
        name={name}
        className={`${prefixCls}-checkbox`}
        checked={checked}
        disabled={disabled}
        value={checked ? "on" : "off"}
        onChange={handleChange}
        onClick={!disabled ? handleClick : undefined}
      />
      <div
        className={inputCls}
        style={cssStyle}
        onClick={disabled ? handleClick : undefined}
      ></div>
    </label>
  );
};

export default Switch;

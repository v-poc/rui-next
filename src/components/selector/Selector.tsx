import React from "react";
import type { ReactNode } from "react";
import classnames from "classnames";
import { Grid, Space } from "../index";
import type { GridProps } from "../grid/Grid";
import usePropsValue from "../hooks/usePropsValue/index";

// CheckMark FC
const CheckMark: React.FC = () => {
  return (
    <svg
      width="17px"
      height="13px"
      viewBox="0 0 17 13"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <g
          transform="translate(-2832.000000, -1103.000000)"
          stroke="#FFFFFF"
          strokeWidth="3"
        >
          <g transform="translate(2610.000000, 955.000000)">
            <g transform="translate(24.000000, 91.000000)">
              <g transform="translate(179.177408, 36.687816)">
                <polyline points="34.2767388 22 24.797043 31.4796958 21 27.6826527" />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

// FieldNamesType
type FieldNamesType = {
  label?: string;
  value?: string;
  children?: string;
  disabled?: string;
};

// SelectorValue type
type SelectorValue = string | number;

// SelectorOption type
export type SelectorOption<V> = {
  label?: ReactNode;
  value?: V;
  disabled?: boolean;
  desc?: ReactNode; // option description
} & {
  [key: string]: any;
};

// SelectorProps type
export type SelectorProps<V> = {
  prefixCls?: string;
  columns?: GridProps["columns"];
  defaultValue?: V[];
  disabled?: boolean;
  fieldNames?: FieldNamesType;
  multiple?: boolean;
  options: SelectorOption<V>[];
  showMark?: boolean;
  value?: V[];
  onChange?: (val: V[], ext: { items: SelectorOption<V>[] }) => void;
};

// Selector FC
export const Selector = <V extends SelectorValue>(props: SelectorProps<V>) => {
  const {
    prefixCls = "r-selector",
    columns,
    defaultValue = [],
    disabled,
    fieldNames,
    multiple = false,
    options,
    showMark = true,
    value,
    onChange,
  } = props;

  const labelName = fieldNames?.label || "label";
  const valueName = fieldNames?.value || "value";
  const disabledName = fieldNames?.disabled || "disabled";

  const [val, setVal] = usePropsValue({
    value,
    defaultValue,
    onChange: (v) => {
      const ext = {
        get items() {
          return options.filter((optionItem) =>
            v.includes(optionItem[valueName])
          );
        },
      };
      onChange?.(v, ext);
    },
  });

  const items = options.map((optionItem) => {
    const isActive = (val || []).includes(optionItem[valueName]);
    const isDisabled = optionItem[disabledName] || disabled;
    const itemCls = classnames(`${prefixCls}-item`, {
      [`${prefixCls}-item-active`]: isActive && !multiple,
      [`${prefixCls}-item-multiple-active`]: isActive && multiple,
      [`${prefixCls}-item-disabled`]: isDisabled,
    });
    const onClickItem = () => {
      if (isDisabled) {
        return;
      }
      if (!multiple) {
        const v = isActive ? [] : [optionItem[valueName]];
        setVal(v);
      } else {
        const v = isActive
          ? val.filter((valItem) => valItem !== optionItem[valueName])
          : [...val, optionItem[valueName]];
        setVal(v);
      }
    };

    return (
      <div
        key={optionItem[valueName]}
        role="option"
        className={itemCls}
        onClick={onClickItem}
      >
        {optionItem[labelName]}
        {optionItem.desc && (
          <div className={`${prefixCls}-item-description`}>
            {optionItem.desc}
          </div>
        )}
        {isActive && showMark && (
          <div className={`${prefixCls}-check-mark-container`}>
            <CheckMark />
          </div>
        )}
      </div>
    );
  });

  return (
    <div className={prefixCls}>
      {columns ? (
        <Grid columns={columns}>{items}</Grid>
      ) : (
        <Space wrap>{items}</Space>
      )}
    </div>
  );
};

export default Selector;

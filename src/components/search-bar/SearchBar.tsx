import React, {
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import classnames from "classnames";
import Button from "../button/index";
import Icon from "../icon/index";
import Input from "../input/index";
import { usePropsValue } from "rui-hooks";
import type { InputProps, InputRef } from "../input/index";

// SearchBarProps type
export type SearchBarProps = Pick<
  InputProps,
  "onFocus" | "onBlur" | "onClear"
> & {
  prefixCls?: string;
  cancelText?: string;
  clearable?: boolean;
  clearOnCancel?: boolean;
  defaultValue?: string;
  icon?: ReactNode;
  maxLength?: number;
  placeholder?: string;
  showCancel?: boolean | ((focus: boolean, v: string) => boolean);
  value?: string;
  onCancel?: () => void;
  onChange?: (v: string) => void;
  onSearch?: (v: string) => void;
};

// SearchBarRef type
export type SearchBarRef = InputRef;

// SearchBar FC
export const SearchBar = forwardRef<SearchBarRef, SearchBarProps>(
  (props, ref) => {
    const {
      prefixCls,
      cancelText,
      clearable,
      clearOnCancel,
      defaultValue,
      icon,
      maxLength,
      placeholder,
      showCancel,
      value,
      onBlur,
      onClear,
      onFocus,
      onCancel,
      onChange,
      onSearch,
    } = props;

    const [val, setVal] = usePropsValue(props);

    const [isFocus, setIsFocus] = useState<boolean>(false);
    const inputRef = useRef<InputRef>(null);

    // useImperativeHandle hook
    useImperativeHandle(ref, () => ({
      blur: () => inputRef.current?.blur(),
      clear: () => inputRef.current?.clear(),
      focus: () => inputRef.current?.focus(),
      get nativeElement() {
        return inputRef.current?.nativeElement ?? null;
      },
    }));

    // render cancel button
    const renderCancel = () => {
      const isShow =
        typeof showCancel === "function"
          ? showCancel(isFocus, val)
          : showCancel && isFocus;

      return (
        isShow && (
          <div
            className={`${prefixCls}-suffix`}
            onMouseDown={(e) => e.preventDefault()}
            onTouchStart={(e) => e.preventDefault()}
          >
            <Button
              type="ghost"
              inline
              round
              size="small"
              className={`${prefixCls}-cancel-button`}
              onClick={() => {
                if (clearOnCancel) {
                  inputRef.current?.clear();
                }
                inputRef.current?.blur();
                onCancel?.();
              }}
            >
              {cancelText}
            </Button>
          </div>
        )
      );
    };

    const wrapCls = classnames(prefixCls, {
      [`${prefixCls}-active`]: isFocus,
    });

    const inputCls = classnames(`${prefixCls}-input`, {
      [`${prefixCls}-input-without-icon`]: !icon,
    });

    return (
      <div className={wrapCls}>
        <div className={`${prefixCls}-input-box`}>
          {icon && <div className={`${prefixCls}-input-box-icon`}>{icon}</div>}
          <Input
            ref={inputRef}
            type="search"
            className={inputCls}
            clearable={clearable}
            enterKeyHint="search"
            maxLength={maxLength}
            placeholder={placeholder}
            value={val}
            onBlur={(e) => {
              setIsFocus(false);
              onBlur?.(e);
            }}
            onChange={setVal}
            onClear={() => onClear?.()}
            onEnterKeyPress={() => {
              inputRef.current?.blur();
              onSearch?.(val);
            }}
            onFocus={(e) => {
              setIsFocus(true);
              onFocus?.(e);
            }}
          />
        </div>
        {renderCancel()}
      </div>
    );
  }
);

SearchBar.defaultProps = {
  prefixCls: "r-search-bar",
  cancelText: "cancel",
  clearable: true,
  clearOnCancel: true,
  defaultValue: "",
  icon: <Icon type="search" size="xs" />,
  showCancel: false,
};

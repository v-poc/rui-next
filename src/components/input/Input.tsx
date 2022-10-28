import React, {
  DetailedHTMLProps,
  InputHTMLAttributes,
  FocusEvent,
  KeyboardEvent,
  forwardRef,
  useRef,
  useState,
  useImperativeHandle,
  useLayoutEffect,
} from "react";
import classnames from "classnames";
import Icon from "../icon/index";
import { getBound } from "../utils/index";
import { usePropsValue } from "rui-hooks";

type NativeInputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

type PickNativeInputProps = Pick<
  NativeInputProps,
  | "autoCapitalize"
  | "autoComplete"
  | "autoCorrect"
  | "autoFocus"
  | "inputMode"
  | "maxLength"
  | "minLength"
  | "pattern"
  | "type"
  | "onBlur"
  | "onClick"
  | "onCompositionStart"
  | "onCompositionEnd"
  | "onFocus"
  | "onKeyDown"
  | "onKeyUp"
>;

// InputProps type
export type InputProps = PickNativeInputProps & {
  prefixCls?: string;
  className?: string;
  clearable?: boolean;
  defaultValue?: string;
  disabled?: boolean;
  enterKeyHint?:
    | "done"
    | "enter"
    | "go"
    | "next"
    | "previous"
    | "search"
    | "send";
  id?: string;
  min?: number;
  max?: number;
  placeholder?: string;
  readOnly?: boolean;
  value?: string;
  onChange?: (v: string) => void;
  onClear?: () => void;
  onEnterKeyPress?: (e: KeyboardEvent<HTMLInputElement>) => void;
  // onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
};

// InputRef type
export type InputRef = {
  blur: () => void;
  clear: () => void;
  focus: () => void;
  nativeElement: HTMLInputElement | null;
};

// Input FC
export const Input = forwardRef<InputRef, InputProps>((props, ref) => {
  const {
    prefixCls,
    className,
    autoCapitalize,
    autoComplete,
    autoCorrect,
    autoFocus,
    clearable,
    defaultValue,
    disabled,
    enterKeyHint,
    id,
    inputMode,
    max,
    min,
    maxLength,
    minLength,
    pattern,
    placeholder,
    readOnly,
    type,
    value,
    // onChange,
    onClear,
    onClick,
    onCompositionStart,
    onCompositionEnd,
    onEnterKeyPress,
    onBlur,
    onFocus,
    onKeyDown,
    onKeyUp,
  } = props;

  const [val, setVal] = usePropsValue(props);

  const [isFocus, setIsFocus] = useState<boolean>(false);
  const nativeInputRef = useRef<HTMLInputElement>(null);

  // useImperativeHandle hook
  useImperativeHandle(ref, () => ({
    blur: () => nativeInputRef.current?.blur(),
    clear: () => setVal(""),
    focus: () => nativeInputRef.current?.focus(),
    get nativeElement() {
      return nativeInputRef.current;
    },
  }));

  // useLayoutEffect hook
  useLayoutEffect(() => {
    if (!enterKeyHint) {
      return;
    }

    nativeInputRef.current?.setAttribute("enterkeyhint", enterKeyHint);

    return () => {
      nativeInputRef.current?.removeAttribute("enterkeyhint");
    };
  }, [enterKeyHint]);

  // check value
  const checkVal = () => {
    let nextVal = val;

    if (type === "number") {
      nextVal = nextVal && getBound(parseFloat(nextVal), min, max).toString();
    }

    if (nextVal !== val) {
      setVal(nextVal);
    }
  };

  // handle keydown event
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (onEnterKeyPress && (e.code === "Enter" || e.keyCode === 13)) {
      onEnterKeyPress(e);
      return;
    }
    onKeyDown?.(e);
  };

  // handle blur event
  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocus(false);
    checkVal();
    onBlur?.(e);
  };

  // handle focus event
  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocus(true);
    onFocus?.(e);
  };

  const wrapCls = classnames(prefixCls, className, {
    [`${prefixCls}-disabled`]: disabled,
  });

  return (
    <div className={wrapCls}>
      <input
        ref={nativeInputRef}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        autoCorrect={autoCorrect}
        autoFocus={autoFocus}
        className={`${prefixCls}-element`}
        disabled={disabled}
        id={id}
        inputMode={inputMode}
        max={max}
        min={min}
        maxLength={maxLength}
        minLength={minLength}
        pattern={pattern}
        placeholder={placeholder}
        readOnly={readOnly}
        type={type}
        value={val}
        onChange={(e) => setVal(e.target?.value)}
        onClick={onClick}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        onKeyUp={onKeyUp}
      />
      {clearable && !!val && !readOnly && isFocus && (
        <div
          className={`${prefixCls}-clear`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            setVal("");
            onClear?.();
          }}
        >
          <Icon type="cross-circle-o" size="xxs" />
        </div>
      )}
    </div>
  );
});

Input.defaultProps = {
  prefixCls: "r-input",
  defaultValue: "",
};

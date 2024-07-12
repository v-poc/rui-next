import React, {
  DetailedHTMLProps,
  InputHTMLAttributes,
  CompositionEvent,
  FocusEvent,
  KeyboardEvent,
  forwardRef,
  useRef,
  useState,
  useImperativeHandle,
} from "react";
import classnames from "classnames";
import Icon from "../icon/index";
import { getBound, isIOS } from "../utils/index";
import usePropsValue from "../hooks/usePropsValue/index";
import useIsomorphicLayoutEffect from "../hooks/useIsomorphicLayoutEffect/index";

type NativeInputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

type AriaProps = {
  role?: string; // only for internal usage
};

type PickNativeInputProps = Pick<
  NativeInputProps,
  | "autoCapitalize"
  | "autoComplete"
  | "autoCorrect"
  | "autoFocus"
  | "inputMode"
  | "maxLength"
  | "minLength"
  | "name"
  | "pattern"
  | "type"
  | "onBlur"
  | "onClick"
  | "onCompositionStart"
  | "onCompositionEnd"
  | "onFocus"
  | "onKeyDown"
  | "onKeyUp"
  | "step"
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
  onlyShowClearWhenFocus?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  value?: string;
  onChange?: (v: string) => void;
  onClear?: () => void;
  onEnterKeyPress?: (e: KeyboardEvent<HTMLInputElement>) => void;
  // onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
} & AriaProps;

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
    prefixCls = "r-input",
    className,
    autoCapitalize,
    autoComplete,
    autoCorrect,
    autoFocus,
    clearable,
    defaultValue = "",
    disabled,
    enterKeyHint,
    id,
    inputMode,
    max,
    min,
    maxLength,
    minLength,
    name,
    pattern,
    placeholder,
    onlyShowClearWhenFocus = true,
    readOnly,
    role,
    step,
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
  const compositionStartRef = useRef<boolean>(false);
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

  // useIsomorphicLayoutEffect hook
  useIsomorphicLayoutEffect(() => {
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

  // handle composition start event
  const handleCompositionStart = (e: CompositionEvent<HTMLInputElement>) => {
    compositionStartRef.current = true;
    onCompositionStart?.(e);
  };

  // handle composition end event
  const handleCompositionEnd = (e: CompositionEvent<HTMLInputElement>) => {
    compositionStartRef.current = false;
    onCompositionEnd?.(e);
  };

  const wrapCls = classnames(prefixCls, className, {
    [`${prefixCls}-disabled`]: disabled,
  });

  const canShowClear = () => {
    if (!clearable || !val || readOnly) {
      return false;
    }

    return onlyShowClearWhenFocus ? isFocus : true;
  };

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
        name={name}
        pattern={pattern}
        placeholder={placeholder}
        readOnly={readOnly}
        role={role}
        step={step}
        type={type}
        value={val}
        onChange={(e) => setVal(e.target?.value)}
        onClick={onClick}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        onKeyUp={onKeyUp}
      />
      {canShowClear() && (
        <div
          className={`${prefixCls}-clear`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            setVal("");
            onClear?.();

            if (isIOS() && compositionStartRef.current) {
              compositionStartRef.current = false;
              nativeInputRef.current?.blur();
            }
          }}
        >
          <Icon type="cross-circle-o" size="xxs" />
        </div>
      )}
    </div>
  );
});

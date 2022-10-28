import React, {
  DetailedHTMLProps,
  TextareaHTMLAttributes,
  ReactNode,
  FocusEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import classnames from "classnames";
import { usePropsValue } from "rui-hooks";

type NativeTextAreaProps = DetailedHTMLProps<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;

type PickNativeTextAreaProps = Pick<
  NativeTextAreaProps,
  | "autoComplete"
  | "autoFocus"
  | "disabled"
  | "readOnly"
  | "onBlur"
  | "onClick"
  | "onCompositionEnd"
  | "onCompositionStart"
  | "onFocus"
>;

type AutoSizeType =
  | boolean
  | {
      minRows?: number;
      maxRows?: number;
    };

type ShowCountType =
  | boolean
  | ((length: number, maxLength?: number) => ReactNode);

// TextAreaProps type
export type TextAreaProps = PickNativeTextAreaProps & {
  prefixCls?: string;
  className?: string;
  autoSize?: AutoSizeType;
  defaultValue?: string;
  disabled?: boolean;
  id?: string;
  maxLength?: number;
  placeholder?: string;
  readOnly?: boolean;
  rows?: number;
  showCount?: ShowCountType;
  value?: string;
  onBlur?: (e: FocusEvent) => void;
  onChange?: (v: string) => void;
  onFocus?: (e: FocusEvent) => void;
};

// TextAreaRef type
export type TextAreaRef = {
  blur: () => void;
  clear: () => void;
  focus: () => void;
  nativeElement: HTMLTextAreaElement | null;
};

// TextArea FC
export const TextArea = forwardRef<TextAreaRef, TextAreaProps>((props, ref) => {
  const {
    prefixCls,
    className,
    autoComplete,
    autoFocus,
    autoSize,
    defaultValue,
    disabled,
    id,
    maxLength,
    placeholder,
    readOnly,
    rows,
    showCount,
    value,
    onBlur,
    onChange,
    onClick,
    onCompositionEnd,
    onCompositionStart,
    onFocus,
  } = props;

  const [val, setVal] = usePropsValue({
    ...props,
    value: value === null ? "" : value,
  });

  const nativeTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const compositionRef = useRef(false);

  // useImperativeHandle hook
  useImperativeHandle(ref, () => ({
    blur: () => nativeTextAreaRef.current?.blur(),
    clear: () => setVal(""),
    focus: () => nativeTextAreaRef.current?.focus(),
    get nativeElement() {
      return nativeTextAreaRef.current;
    },
  }));

  // useEffect hook
  useEffect(() => {
    if (!autoSize) {
      return;
    }

    const textAreaNode = nativeTextAreaRef.current;
    if (!textAreaNode) {
      return;
    }
    textAreaNode.style.height = "auto";
    let h = textAreaNode.scrollHeight;
    if (typeof autoSize === "object") {
      const textAreaStyle = window.getComputedStyle(textAreaNode);
      const lh = parseFloat(textAreaStyle.lineHeight);
      if (autoSize.minRows) {
        h = Math.max(h, autoSize.minRows * lh);
      }
      if (autoSize.maxRows) {
        h = Math.min(h, autoSize.maxRows * lh);
      }
    }
    textAreaNode.style.height = `${h}px`;
  }, [val, autoSize]);

  const renderCount = () => {
    let res;

    if (typeof showCount === "function") {
      res = showCount([...val].length, maxLength);
    } else if (showCount) {
      res = (
        <div className={`${prefixCls}-count`}>
          {maxLength ? `${val.length}/${maxLength}` : val.length}
        </div>
      );
    }

    return res;
  };

  const wrapCls = classnames(`${prefixCls}-wrapper`, className);

  return (
    <div className={wrapCls}>
      <textarea
        ref={nativeTextAreaRef}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        className={`${prefixCls}-element`}
        disabled={disabled}
        id={id}
        maxLength={maxLength}
        placeholder={placeholder}
        readOnly={readOnly}
        rows={rows}
        value={val}
        onBlur={onBlur}
        onChange={(e) => {
          let v = e.target.value;
          if (maxLength && !compositionRef.current) {
            v = [...v].slice(0, maxLength).join("");
          }
          setVal(v);
        }}
        onClick={onClick}
        onCompositionEnd={(e) => {
          compositionRef.current = false;
          if (maxLength) {
            setVal([...val].slice(0, maxLength).join(""));
          }
          onCompositionEnd?.(e);
        }}
        onCompositionStart={(e) => {
          compositionRef.current = true;
          onCompositionStart?.(e);
        }}
        onFocus={onFocus}
      />
      {renderCount()}
    </div>
  );
});

TextArea.defaultProps = {
  prefixCls: "r-text-area",
  autoSize: false,
  defaultValue: "",
  rows: 2,
  showCount: false,
};

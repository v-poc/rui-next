import React from "react";
import type { CSSProperties, ReactNode } from "react";
import classnames from "classnames";
import Button from "../button/index";

// ResultProps type
export type ResultProps = {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  img?: ReactNode;
  imgUrl?: string;
  title?: ReactNode;
  message?: ReactNode;
  buttonText?: string;
  buttonType?: "primary" | "ghost";
  onButtonClick?: () => void;
};

// Result FC
export const Result: React.FC<ResultProps> = (props) => {
  const {
    style,
    img,
    imgUrl,
    title,
    message,
    buttonText,
    onButtonClick,
    buttonType,
    prefixCls,
    className,
  } = props;

  let imgEl;
  if (img) {
    imgEl = (
      <div className={`${prefixCls}-pic`}>
        {img}
      </div>
    );
  } else if (imgUrl) {
    imgEl = (
      <div
        className={`${prefixCls}-pic`}
        style={{ backgroundImage: `url(${imgUrl})` }}
      />
    );
  }

  const wrapCls = classnames(
    prefixCls,
    className
  );

  return (
    <div
      role="alert"
      className={wrapCls}
      style={style}
    >
      {imgEl}
      {title && (
        <div className={`${prefixCls}-title`}>
          {title}
        </div>
      )}
      {message && (
        <div className={`${prefixCls}-message`}>
          {message}
        </div>
      )}
      {buttonText && (
        <div className={`${prefixCls}-button`}>
          <Button
            type={buttonType}
            size="small"
            inline
            onClick={onButtonClick}
          >
            {buttonText}
          </Button>
        </div>
      )}
    </div>
  );
};

Result.defaultProps = {
  prefixCls: "r-result",
  buttonType: "primary",
  onButtonClick: () => {},
};

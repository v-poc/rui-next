import React, { useState } from "react";
import type {
  ReactNode,
  CSSProperties,
  ImgHTMLAttributes,
  MouseEvent,
  SyntheticEvent,
} from "react";
import classnames from "classnames";
import { useIsomorphicLayoutEffect } from "rui-hooks";
import { Lazyload } from "../utils/Lazyload";
import { getCSSLength } from "../utils/index";
import createUpdateEffect from "../utils/createUpdateEffect";

const useIsomorphicLayoutEffectHook = createUpdateEffect(
  useIsomorphicLayoutEffect
);

const DefaultImage = () => (
  <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M41.396 6.234c1.923 0 3.487 1.574 3.487 3.505v29.14c0 1.937-1.568 3.51-3.491 3.51H6.604c-1.923 0-3.487-1.573-3.487-3.51V9.745c0-1.936 1.564-3.51 3.487-3.51Zm0 2.847H6.604c-.355 0-.654.3-.654.658V34.9l5.989-8.707a2.373 2.373 0 0 1 1.801-1.005 2.405 2.405 0 0 1 1.933.752l4.182 4.525 7.58-11.005a2.374 2.374 0 0 1 1.96-1.01c.79 0 1.532.38 1.966 1.01L42.05 34.89V9.74a.664.664 0 0 0-.654-.658Zm-28.305 2.763a3.119 3.119 0 0 1 3.117 3.117 3.119 3.119 0 0 1-3.117 3.117 3.122 3.122 0 0 1-3.117-3.117 3.119 3.119 0 0 1 3.117-3.117Z"
      fill="#DBDBDB"
      fillRule="nonzero"
    />
  </svg>
);

const BrokenImage = () => (
  <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M19.233 6.233 17.42 9.08l-10.817.001a.665.665 0 0 0-.647.562l-.007.096V34.9l5.989-8.707a2.373 2.373 0 0 1 1.801-1.005 2.415 2.415 0 0 1 1.807.625l.126.127 4.182 4.525 2.267-3.292 5.461 7.841-4.065 7.375H6.604c-1.86 0-3.382-1.47-3.482-3.317l-.005-.192V9.744c0-1.872 1.461-3.405 3.296-3.505l.19-.005h12.63Zm22.163 0c1.86 0 3.382 1.472 3.482 3.314l.005.192v29.14a3.507 3.507 0 0 1-3.3 3.505l-.191.006H27.789l3.63-6.587.06-.119a1.87 1.87 0 0 0-.163-1.853l-6.928-9.949 3.047-4.422a2.374 2.374 0 0 1 1.96-1.01 2.4 2.4 0 0 1 1.86.87l.106.14L42.05 34.89V9.74a.664.664 0 0 0-.654-.658H21.855l1.812-2.848h17.73Zm-28.305 5.611c.794 0 1.52.298 2.07.788l-.843 1.325-.067.114a1.87 1.87 0 0 0 .11 1.959l.848 1.217c-.556.515-1.3.83-2.118.83a3.122 3.122 0 0 1-3.117-3.116 3.119 3.119 0 0 1 3.117-3.117Z"
      fill="#DBDBDB"
      fillRule="nonzero"
    />
  </svg>
);

type StyleProps = CSSProperties & {
  "--width"?: number | string;
  "--height"?: number | string;
};

type NativeProps = Pick<
  ImgHTMLAttributes<HTMLImageElement>,
  | "crossOrigin"
  | "decoding"
  | "loading"
  | "referrerPolicy"
  | "sizes"
  | "srcSet"
  | "useMap"
>;

export type ImageProps = {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  alt?: string;
  draggable?: boolean;
  fallback?: ReactNode;
  fit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  height?: number | string;
  lazy?: boolean;
  placeholder?: ReactNode;
  src?: string;
  width?: number | string;
  onClick?: (e: MouseEvent<HTMLImageElement, Event>) => void;
  onContainerClick?: (e: MouseEvent<HTMLDivElement, Event>) => void;
  onError?: (e: SyntheticEvent<HTMLImageElement, Event>) => void;
  onLoad?: (e: SyntheticEvent<HTMLImageElement, Event>) => void;
} & NativeProps;

export const Image: React.FC<ImageProps> = (props) => {
  const {
    prefixCls,
    className,
    style,
    alt,
    crossOrigin,
    decoding,
    draggable,
    fit,
    height,
    lazy,
    loading,
    referrerPolicy,
    sizes,
    useMap,
    width,
    onClick,
    onContainerClick,
    onError,
    onLoad,
  } = props;

  let { fallback, placeholder, src, srcSet } = props;
  if (!fallback) {
    fallback = (
      <div className={`${prefixCls}-tip`}>
        <BrokenImage />
      </div>
    );
  }
  if (!placeholder) {
    placeholder = (
      <div className={`${prefixCls}-tip`}>
        <DefaultImage />
      </div>
    );
  }

  const [isLoaded, setIsLoaded] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [isInit, setIsInit] = useState(!lazy);

  src = isInit ? src : undefined;
  srcSet = isInit ? srcSet : undefined;

  useIsomorphicLayoutEffectHook(() => {
    setIsLoaded(false);
    setIsFailed(false);
  }, [src]);

  const wrapStyle: StyleProps = style ? { ...style } : {};
  if (width) {
    wrapStyle["--width"] = getCSSLength(width);
    wrapStyle["width"] = getCSSLength(width);
  }
  if (height) {
    wrapStyle["--height"] = getCSSLength(height);
    wrapStyle["height"] = getCSSLength(height);
  }

  return (
    <div
      className={classnames(prefixCls, className)}
      style={wrapStyle}
      onClick={onContainerClick}
    >
      {lazy && !isInit && <Lazyload onActive={() => setIsInit(true)} />}
      {isFailed ? (
        fallback
      ) : (
        <>
          {!isLoaded && placeholder}
          <img
            className={`${prefixCls}-img`}
            style={{
              objectFit: fit,
              display: isLoaded ? "block" : "none",
            }}
            src={src}
            alt={alt}
            crossOrigin={crossOrigin}
            decoding={decoding}
            draggable={draggable}
            loading={loading}
            referrerPolicy={referrerPolicy}
            sizes={sizes}
            srcSet={srcSet}
            useMap={useMap}
            onClick={onClick}
            onError={(e) => {
              setIsFailed(true);
              onError?.(e);
            }}
            onLoad={(e) => {
              setIsLoaded(true);
              onLoad?.(e);
            }}
          />
        </>
      )}
    </div>
  );
};

Image.defaultProps = {
  prefixCls: "r-image",
  draggable: false,
  fit: "fill",
  lazy: false,
};

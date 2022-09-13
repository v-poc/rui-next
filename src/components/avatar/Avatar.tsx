import React from "react";
import type { CSSProperties } from "react";
import { Image } from "../index";
import type { ImageProps } from "../image/index";
import { getCSSLength } from "../utils/index";

const FallbackImage = () => (
  <svg
    className="r-avatar-fallback"
    width="88px"
    height="88px"
    viewBox="0 0 88 88"
    version="1.1"
  >
    <defs>
      <polygon id="path-1" points="0 0 88 0 88 88 0 88" />
    </defs>
    <g id="page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g id="pagetool" transform="translate(-495.000000, -71.000000)">
        <g id="group-3" transform="translate(495.000000, 71.000000)">
          <mask id="mask-2" fill="white">
            <use xlinkHref="#path-1" />
          </mask>
          <use
            id="Mask"
            fill="#EEEEEE"
            fillRule="nonzero"
            xlinkHref="#path-1"
          />
          <path
            d="M44.5707528,16 L43.4292117,16 L42.9575197,16.0086403 L42.9575195,16.0086403 C36.5215787,16.2615464 31.4341803,21.5678078 31.4344832,28.0273864 L31.4344832,34.7776551 L31.4495601,35.3716788 L31.4495593,35.3716628 C31.599687,38.5368723 32.9422041,41.5269327 35.2058513,43.7376716 L38.2147759,46.6775505 L38.4086219,46.8913989 C38.7747759,47.3385365 38.9750835,47.9001589 38.9750835,48.4833848 L38.9750835,48.8938006 L38.9556989,49.1897326 L38.9556989,49.1897325 C38.8577746,49.9812662 38.3754713,50.67284 37.667703,51.036605 L18.7375269,60.7440265 L18.4101421,60.9276334 L18.4101423,60.9276333 C16.9141658,61.8418636 16.0009389,63.4714674 16,65.2283758 L16,66.070809 L16.0129231,66.3948217 C16.1766149,68.4123376 17.860922,70 19.91569,70 L68.0843101,70 L68.08431,70 C70.2460467,70 71.9988087,68.243122 72,66.0751224 L72,65.2326893 C72,63.3382982 70.9446194,61.6037466 69.2624598,60.7440295 L50.3322837,51.036608 L50.3322835,51.0366079 C49.5291218,50.6249082 49.0240448,49.7962466 49.024903,48.8916436 L49.024903,48.4812278 C49.024903,47.8029608 49.3005955,47.1527756 49.7852106,46.6775603 L52.7941352,43.7376813 L52.7941354,43.7376811 C55.204308,41.3832325 56.5636029,38.151975 56.5633606,34.7776456 L56.5633606,28.0273769 L56.5633606,28.0273774 C56.5633606,21.3848531 51.1940878,16 44.5707524,16 L44.5707528,16 Z"
            id="shape"
            fill="#CCCCCC"
            fillRule="nonzero"
            mask="url(#mask-2)"
          />
        </g>
      </g>
    </g>
  </svg>
);

type StyleProps = CSSProperties & {
  "--size"?: string;
};

// AvatarProps type
export type AvatarProps = {
  prefixCls?: string;
  size?: number;
} & Pick<
  ImageProps,
  | "alt"
  | "fallback"
  | "fit"
  | "lazy"
  | "src"
  | "onClick"
  | "onError"
>;

// Avatar FC
export const Avatar: React.FC<AvatarProps> = (props) => {
  const {
    prefixCls,
    alt,
    fallback,
    fit,
    lazy,
    size,
    src,
    onClick,
    onError,
  } = props;

  const wrapStyle: StyleProps = {};
  if (size) {
    wrapStyle["--size"] = getCSSLength(size);
  }

  return (
    <Image
      className={prefixCls}
      style={wrapStyle}
      alt={alt}
      fallback={fallback}
      fit={fit}
      lazy={lazy}
      placeholder={fallback}
      src={src}
      onClick={onClick}
      onError={onError}
    />
  );
};

Avatar.defaultProps = {
  prefixCls: "r-avatar",
  fallback: <FallbackImage />,
  fit: "cover",
};

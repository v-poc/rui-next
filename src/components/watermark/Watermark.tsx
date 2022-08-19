import React, { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import classnames from "classnames";
import { canUseDOM } from '../utils/index';

// WatermarkProps Type
export type WatermarkProps = {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  gapX?: number;
  gapY?: number;
  zIndex?: number;
  width?: number;
  height?: number;
  rotate?: number;
  content?: string;
  image?: string;
  imageW?: number;
  imageH?: number;
  fontColor?: string;
  fontFamily?: string;
  fontSize?: number | string;
  fontStyle?: "none" | "normal" | "italic" | "oblique";
  fontWeight?: "normal" | "light" | "bold" | number;
};

// Watermark FC
const Watermark: React.FC<WatermarkProps> = (props) => {
  const {
    prefixCls,
    style,
    className,
    gapX = 0,
    gapY = 0,
    zIndex,
    width = 0,
    height = 0,
    rotate = 0,
    content,
    image,
    imageW = 0,
    imageH = 0,
    fontColor = "rgba(0, 0, 0, .15)",
    fontFamily,
    fontSize,
    fontStyle,
    fontWeight,
  } = props;

  const [base64DataURL, setBase64DataURL] = useState("");

  useEffect(() => {
    if (!canUseDOM) {
      return;
    }
    
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas is not supported!");
    }

    const ratio = window.devicePixelRatio;
    const canvasW = `${(gapX + width) * ratio}px`;
    const canvasH = `${(gapY + height) * ratio}px`;
    const containerW = width * ratio;
    const containerH = height * ratio;

    canvas.setAttribute("width", canvasW);
    canvas.setAttribute("height", canvasH);

    ctx.translate(containerW / 2, containerH / 2);
    ctx.rotate((Math.PI / 180) * rotate);

    if (content && !image) {
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";

      ctx.font = `${fontStyle} normal ${fontWeight} ${Number(fontSize) * ratio}px/${containerH}px ${fontFamily}`;
      ctx.fillStyle = fontColor;

      ctx.fillText(content, 0, 0);
      ctx.restore();
      setBase64DataURL(canvas.toDataURL());
    }

    if (image && !content) {
      const tmpImage = new Image();
      tmpImage.crossOrigin = "anonymous";
      tmpImage.referrerPolicy = "no-referrer";
      tmpImage.src = image;
      tmpImage.onload = () => {
        ctx.drawImage(
          tmpImage,
          (-1 * imageW * ratio) / 2,
          (-1 * imageH * ratio) / 2,
          imageW * ratio,
          imageH * ratio,
        );
        ctx.restore();
        setBase64DataURL(canvas.toDataURL());
      };
    }
  }, [
    gapX,
    gapY,
    width,
    height,
    rotate,
    content,
    image,
    imageW,
    imageH,
    fontColor,
    fontFamily,
    fontSize,
    fontStyle,
    fontWeight,
  ]);

  const wrapCls = classnames(
    prefixCls,
    className,
  );

  return (
    <div
      className={wrapCls}
      style={{
        zIndex,
        backgroundSize: `${gapX + width}px`,
        backgroundImage: `url("${base64DataURL}")`,
        ...style,
      }}
    ></div>
  );
};

Watermark.defaultProps = {
  prefixCls: "r-watermark",
  gapX: 24,
  gapY: 48,
  zIndex: 1100,
  width: 120,
  height: 64,
  rotate: -22,
  imageW: 120,
  imageH: 64,
  fontColor: "rgba(0, 0, 0, .15)",
  fontFamily: "sans-serif",
  fontSize: 14,
  fontStyle: "normal",
  fontWeight: "normal",
};

export default Watermark;

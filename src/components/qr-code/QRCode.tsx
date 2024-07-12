import React from "react";
import classnames from "classnames";
import qrcode from "v-qr-code-next";

// QRCodeProps Type
export type QRCodeProps = {
  prefixCls?: string;
  className?: string;
  value: string; // the value of qr-code
  num?: number; // the type number
  level?: "L" | "M" | "Q" | "H"; // the error Correction Level
  mode?: "image" | "svg" | "table" | "dataurl";
  border?: boolean;
  color?: string;
};

// QRCode FC
export const QRCode: React.FC<QRCodeProps> = (props) => {
  const {
    value,
    num = 8,
    level = "L",
    mode = "image",
    border = false,
    color,
    prefixCls = "r-qr-code",
    className,
  } = props;

  const qr = qrcode(
    num, // the type number
    level // the error Correction Level
  );
  qr.addData(value).make();

  let res = "";
  if (mode === "svg") {
    res = qr.createSvgTag();
  } else if (mode === "table") {
    res = qr.createTableTag();
  } else if (mode === "dataurl") {
    res = `<img src="${qr.createDataURL()}" />`;
  } else {
    res = qr.createImgTag();
  }

  if (color) {
    res = qr.createSvgTag(0, border ? 8 : 0, "", "", color);
  }

  const content = { __html: res };

  const wrapCls = classnames(prefixCls, className, {
    [`${prefixCls}-wrapper`]: !!border,
  });

  return <div className={wrapCls} dangerouslySetInnerHTML={content} />;
};

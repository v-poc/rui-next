import React, { useRef, useState } from "react";
import { QRCode, Divider } from "../../index";
import "./index.less";

type ParamsType = {
  value: string;
  num: number;
  level: string; // "L" | "M" | "Q" | "H"
  mode: string; // "image" | "table" | "svg" | "dataurl"
  border: boolean;
  color: string;
};

// Example FC
const Example = () => {
  const modeRef = useRef<HTMLSelectElement>(null);
  const wrapperRef = useRef<HTMLSelectElement>(null);
  const typeNumberRef = useRef<HTMLSelectElement>(null);
  const levelRef = useRef<HTMLSelectElement>(null);
  const colorRef = useRef<HTMLSelectElement>(null);
  const [params, setParams] = useState<ParamsType>({
    value: "",
    num: 8,
    level: "L",
    mode: "image",
    border: false,
    color: "",
  });

  const onInputContent = (e: any) => {
    let val = e.target.value.trim();
    let limitLen = params.num * 18;
    if (params.num === 2) {
      limitLen -= 4;
    }
    if (e.target.value.length >= limitLen) {
      val = e.target.value.substring(0, limitLen - 1);
    }
    setParams({
      ...params,
      value: val,
    });
  };

  const onSelectTypeNumber = () => {
    const valNum = parseInt(typeNumberRef.current!.value, 10);
    let val = params.value;
    let limitLen = valNum * 18;
    if (valNum === 2) {
      limitLen -= 4;
    }
    if (val.length >= limitLen) {
      val = val.substring(0, limitLen - 1);
    }
    setParams({
      ...params,
      num: valNum,
      value: val,
    });
  };

  const onSelectLevel = () =>
    setParams({
      ...params,
      level: levelRef.current!.value,
    });

  const onSelectMode = () =>
    setParams({
      ...params,
      mode: modeRef.current!.value,
    });

  const onSelectWrapper = () =>
    setParams({
      ...params,
      border: wrapperRef.current!.value === "1",
    });

  const onSelectColor = () => {
    const val = colorRef.current!.value;
    if (val) {
      modeRef.current!.value = "svg";
    }
    setParams({
      ...params,
      color: val,
      mode: modeRef.current!.value,
    });
  };

  return (
    <>
      <h1>RUI.next</h1>
      <h3>
        Please scan the QR code to access the examples on mobile/tablet device:
      </h3>
      <QRCode value="https://nikoni.top/rui-next/" border color="#21b8a3" />
      <br />
      <Divider>Simple qr-code generator</Divider>
      TypeNumber:
      <select
        ref={typeNumberRef}
        value={params.num}
        onChange={onSelectTypeNumber}
      >
        {new Array(40).fill("").map((_, i) => (
          <option key={`num${i}`} value={i + 1}>
            {i + 1}
          </option>
        ))}
      </select>
      <br />
      ErrorCorrectionLevel:
      <select ref={levelRef} onChange={onSelectLevel}>
        <option value="L">L (7%)</option>
        <option value="M">M (15%)</option>
        <option value="Q">Q (25%)</option>
        <option value="H">H (30%)</option>
      </select>
      <br />
      Mode:
      <select ref={modeRef} onChange={onSelectMode}>
        <option value="image">Image</option>
        <option value="svg">SVG</option>
        <option value="table">Table</option>
        <option value="dataurl">DataURL</option>
      </select>
      <br />
      Wrapper:
      <select ref={wrapperRef} onChange={onSelectWrapper}>
        <option value="0">Without Border</option>
        <option value="1">With Border</option>
      </select>
      <br />
      Color:
      <select ref={colorRef} onChange={onSelectColor}>
        <option value="">N/A</option>
        <option value="#f44336">red</option>
        <option value="#e91e63">pink</option>
        <option value="#9c27b0">purple</option>
        <option value="#3f51b5">indigo</option>
        <option value="#2196f3">blue</option>
        <option value="#00bcd4">cyan</option>
        <option value="#009688">teal</option>
        <option value="#4caf50">green</option>
        <option value="#cddc39">lime</option>
        <option value="#ffc107">amber</option>
        <option value="#ff9800">orange</option>
        <option value="#795548">brown</option>
        <option value="#9e9e9e">grey</option>
      </select>
      <br />
      <input
        type="text"
        placeholder="Please input content"
        className="qrcode-example-input"
        value={params.value}
        onChange={(e) => onInputContent(e)}
      />
      {params.value && (
        <QRCode
          className="qrcode-example-wrapper"
          value={params.value}
          num={params.num}
          level={params.level}
          mode={params.mode}
          border={params.border}
          color={params.color}
        />
      )}
    </>
  );
};

export default Example;

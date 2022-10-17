import React, { useRef, useState } from "react";
import { QRCode, Divider } from "rui-next";
import "./index.less";

type RefType = any;

type ParamsType = {
  value: string;
  num: number;
  level: "L" | "M" | "Q" | "H";
  mode: "image" | "table" | "svg" | "dataurl";
  border: boolean;
};

// Example FC
const Example = () => {
  const selectModeRef = useRef<RefType>();
  const selectWrapperRef = useRef<RefType>();
  const selectTypeNumberRef = useRef<RefType>();
  const selectLevelRef = useRef<RefType>();
  const [params, setParams] = useState<ParamsType>({
    value: "",
    num: 8,
    level: "L",
    mode: "image",
    border: false,
  });

  const handleInputContent = (e: any) => {
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

  const handleSelectTypeNumber = () => {
    const valNum = parseInt(selectTypeNumberRef.current!.value, 10);
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

  const handleSelectLevel = () =>
    setParams({
      ...params,
      level: selectLevelRef.current!.value,
    });

  const handleSelectMode = () =>
    setParams({
      ...params,
      mode: selectModeRef.current!.value,
    });

  const handleSelectWrapper = () =>
    setParams({
      ...params,
      border: selectWrapperRef.current!.value === "1",
    });

  return (
    <>
      <h1>RUI.next</h1>
      <h3>
        Please scan the QR code to access the examples on mobile/tablet device:
      </h3>
      <QRCode value="https://nikoni.top/rui-next/" border />
      <br />
      <Divider>Simple qr-code generator</Divider>
      TypeNumber:
      <select
        ref={selectTypeNumberRef}
        value={params.num}
        onChange={() => handleSelectTypeNumber()}
      >
        {new Array(40).fill("").map((item, i) => (
          <option key={`num${i}`} value={i + 1}>
            {i + 1}
          </option>
        ))}
      </select>
      <br />
      ErrorCorrectionLevel:
      <select ref={selectLevelRef} onChange={() => handleSelectLevel()}>
        <option value="L">L (7%)</option>
        <option value="M">M (15%)</option>
        <option value="Q">Q (25%)</option>
        <option value="H">H (30%)</option>
      </select>
      <br />
      Mode:
      <select ref={selectModeRef} onChange={() => handleSelectMode()}>
        <option value="image">Image</option>
        <option value="svg">SVG</option>
        <option value="table">Table</option>
        <option value="dataurl">DataURL</option>
      </select>
      <br />
      Wrapper:
      <select ref={selectWrapperRef} onChange={() => handleSelectWrapper()}>
        <option value="0">Without Border</option>
        <option value="1">With Border</option>
      </select>
      <br />
      <input
        type="text"
        placeholder="Please input content"
        className="qrcode-example-input"
        value={params.value}
        onChange={(e) => handleInputContent(e)}
      />
      {params.value && (
        <QRCode
          className="qrcode-example-wrapper"
          value={params.value}
          num={params.num}
          level={params.level}
          mode={params.mode}
          border={params.border}
        />
      )}
    </>
  );
};

export default Example;

import React, { useRef, useState } from "react";
import { QRCode, Divider } from "../../index";

const textfieldStyle = {
  margin: "15px 0",
  width: "100%",
  height: "24px",
  border: "1px solid #000",
};

// Example FC
const Example = () => {
  const selectModeRef = useRef<any>();
  const selectWrapperRef = useRef<any>();
  const selectTypeNumberRef = useRef<any>();
  const selectLevelRef = useRef<any>();
  const [params, setParams] = useState({
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
      <QRCode value="https://nikoni.top/rui-next/docs/" border />
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
        style={textfieldStyle}
        value={params.value}
        onChange={e => handleInputContent(e)}
      />
      {params.value && (
        <QRCode
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

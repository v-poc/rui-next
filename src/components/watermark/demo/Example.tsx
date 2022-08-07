import React, { useState } from "react";
import { Watermark, Button } from "../../index";
import "./index.less";

type TxtType = {
  content?: string;
};

type ImgType = {
  image?: string;
  imageW?: number;
  imageH?: number;
  width?: number;
  height?: number;
};

// Example FC
const Example = () => {
  const defaultImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAIAAAC0Ujn1AAAACXBIWXMAAAsSAAALEgHS3X78AAABDklEQVR4nGP4dfz4OyOj12xsrxgY8KBbfBKB7U88+z4QRL4TP+Yu+Xz92R+GdwYG+A2FoKesHFmF+4kxGoKyF39meMXKSozRrxgYukN6iTfaZ8IHogyFoP1qjsQb7dlHitFP2Dh9u17SxOhXDAz5uTtoZfRU73paGb1Dx9uz7/2o0RQZ/R8bgJsI5yIbDRFEZiMDAkbDTSdoNFYRdHdhunTQG012WJNmNFYfUBogNHE11oCmidGYInCjMc0lOYVgtQ+Xe9Fkh3QZMvBGz3UuItJcko2uSF1FE6NfMjIFtT0mxWiimzinZAyIN9dnwgdiG2avGBime1YTb3T24s8MRDYnnzGzFuRsI8ZQeHMSAOD2kiUX84lOAAAAAElFTkSuQmCC";

  const txtProps = {
    content: "RUI next",
  };

  const imgProps = {
    image: defaultImage,
    imageW: 30,
    imageH: 30,
    width: 120,
    height: 120,
  };

  const [props, setProps] = useState<TxtType | ImgType>(txtProps);

  return (
    <div className="example-watermark-wrapper">
      <Button
        type="primary"
        size="small"
        inline
        onClick={() => setProps(txtProps)}
      >
        Test Text Watermark
      </Button>
      <br />
      <Button
        type="primary"
        size="small"
        inline
        onClick={() => setProps(imgProps)}
      >
        Test Image Watermark
      </Button>
      <br />
      <div className="watermark-wrapper">
        <Watermark
          {...props}
        />
      </div>
    </div>
  )
};

export default Example;

import React, { useRef } from "react";
import { useFullscreen, Button, Divider } from "rui-next";
import { logInfo } from "../../../experimental";
import "./index.less";

// Example FC
const Example = () => {
  const rootRef = useRef(null);
  const imgRef = useRef(null);

  const [isFullscreen, { setFull, exitFull, toggleFull }] = useFullscreen(
    rootRef,
    {
      onExitFull: () => logInfo('onExitFull'),
      onFull: () => logInfo('onFull'),
    },
  );

  const [, { setFull: setFullImage }] = useFullscreen(
    imgRef,
    {
      onExitFull: () => logInfo('image-onExitFull'),
      onFull: () => logInfo('image-onFull'),
    },
  );

  return (
    <>
      <Divider contentAlign="left">
        Default usage
      </Divider>
      <div ref={rootRef}>
        <div style={{ color: isFullscreen ? 'white' : 'black' }}>
          Fullscreen state: {isFullscreen ? 'Fullscreen' : 'Not Fullscreen'}
        </div>
        <br />
        <Button
          inline
          size="small"
          onClick={setFull}
        >
          Click to setFull
        </Button><br /><br />
        <Button
          inline
          size="small"
          onClick={exitFull}
        >
          Click to exitFull
        </Button><br /><br />
        <Button
          inline
          size="small"
          onClick={toggleFull}
        >
          Click to toggleFull
        </Button>
      </div>

      <Divider contentAlign="left">
        Image full-screen usage
      </Divider>
      <img
        ref={imgRef}
        className="fullscreen-example-img"
        src="https://vitejs.dev/logo.svg"
      />
      <br /><br />
      <Button
        inline
        size="small"
        onClick={setFullImage}
      >
        Click to setFull image
      </Button>
    </>
  );
};

export default Example;

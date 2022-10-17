import React, { useState } from "react";
import { Button, Skeleton, Divider } from "rui-next";
import { useLazyload } from "../../../experimental";

// Example FC
const Example = () => {
  const [showContent, setShowContent] = useState(false);
  const [callbackRef, isLoaded] = useLazyload();

  const startContentLoading = () => setShowContent(true);

  return (
    <>
      <Divider contentAlign="left">Skeleton Content loading image</Divider>
      <Button
        size="small"
        inline
        round
        disabled={showContent && !isLoaded}
        onClick={startContentLoading}
      >
        Test Content loading
      </Button>
      {showContent && (
        <>
          <Skeleton title titleWidth="80%" row={4} loading={!isLoaded} />
          <img ref={callbackRef} data-src="https://vitejs.dev/logo.svg" />
        </>
      )}
    </>
  );
};

export default Example;

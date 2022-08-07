import React, { useEffect, useState } from "react";
import { useVisibilityChange, Result, Icon, Divider } from "../../../index";
import { canUseDOM, logInfo } from "../../../experimental";

// Get visibility
const getVisibility = () => {
  return canUseDOM ? document.visibilityState : "visible";
};

// Example FC
const Example = () => {
  const [visible, setVisible] = useState(false); // whether visible (boolean)
  const [docVisibility, setDocVisibility] = useState(() => getVisibility()); // document visibility state

  const delaySetVisible = (v: boolean) => {
    setTimeout(() => setVisible(v), 800);
  };

  const delaySetDocVisibility = (v: DocumentVisibilityState) => {
    setTimeout(() => setDocVisibility(v), 800);
  };
  
  // useVisibilityChange hook
  useVisibilityChange((v: boolean) => {
    logInfo(`visibilityChange - visible: ${v}`);

    if (v) {
      delaySetVisible(v);
    } else {
      setVisible(false);
    }
  });

  // useVisibilityChange hook
  useVisibilityChange(() => {
    const docV = getVisibility();
    logInfo(`visibilityChange - document visibility state: ${docV}`);
    if (docV === "visible") {
      delaySetDocVisibility(docV);
    } else {
      setDocVisibility(docV);
    }
  });

  // useEffect hook
  useEffect(() => {
    delaySetVisible(true);
    delaySetDocVisibility("visible");
  }, []);

  const imgEl = visible
    ? <Icon type="check-circle" size="lg" color="green" />
    : <Icon type="ellipsis-circle" size="lg" color="grey" />;

  return (
    <>
      <Divider
        contentAlign="left"
      >
        Visibility change detection (switch browser tab to have a look)
      </Divider>
      <Result
        img={imgEl}
        title="Document visibility"
        message={`Detect visible result: ${visible ? "true" : "-"}, document visibility state: ${docVisibility}`}
      />
    </>
  );
};

export default Example;

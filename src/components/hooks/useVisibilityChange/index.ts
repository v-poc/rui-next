import { useRef } from "react";
import useEventListener from "../useEventListener/index";
import { canUseDOM } from "../../utils/index";

// useVisibilityChange hook
const useVisibilityChange = function (
  callback?: (v: boolean) => void,
  delay?: number,
) {
	const timeoutId = useRef<ReturnType<typeof setTimeout>>(); // timeout timer

  // browser compatible API
	const browserCompatApi = () => {
		let hidden, visibilityChange;
    // feature detection
		if ("hidden" in document) {
			hidden = "hidden";
			visibilityChange = "visibilitychange";
		} else if ("mozHidden" in document) {
			// Firefox up to v17
			hidden = "mozHidden";
			visibilityChange = "mozvisibilitychange";
		} else if ("webkitHidden" in document) {
			// Chrome up to v32, Android up to v4.4, Blackberry up to v10
			hidden = "webkitHidden";
			visibilityChange = "webkitvisibilitychange";
		}

		return {
			hidden,
			visibilityChange,
		};
	};

  // cleanup timeout timer
	const cleanupTimeout = () => clearTimeout(timeoutId.current);

  const {
    hidden,
    visibilityChange = "visibilitychange",
  } = browserCompatApi();

  // handle visibility change
  const handleVisibilityChange = () => {
    if (typeof callback !== "function") {
      throw new Error("callback must be a function");
    }
    // @ts-ignore
    const res = canUseDOM ? document[hidden] : false;
    if (delay) {
      if (typeof delay !== "number" || delay < 0) {
        throw new Error("delay must be a positive integer");
      }

      if (timeoutId.current) {
        cleanupTimeout();
      }
      timeoutId.current = setTimeout(() => callback(!res), delay);
    } else {
      callback(!res);
    }
  };

  useEventListener(
    visibilityChange,
    handleVisibilityChange,
    {
      target: () => document,
    }
  );
}

export default useVisibilityChange;

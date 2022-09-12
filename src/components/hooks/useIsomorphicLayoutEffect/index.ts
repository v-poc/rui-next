import { useEffect, useLayoutEffect } from "react";
import { canUseDOM } from "../../utils/index";

const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;

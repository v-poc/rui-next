import useInitialized from "../useInitialized/index";

const useShouldRender = (
  active?: boolean,
  forceRender?: boolean,
  destroyOnClose?: boolean
) => {
  if (forceRender || active) {
    return true;
  }

  const initialized = useInitialized(active);
  if (!initialized) {
    return false;
  }

  return !destroyOnClose;
};

export default useShouldRender;

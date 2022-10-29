import { useCallback, useState } from "react";

const useUpdate = () => {
  const [_, setState] = useState({});

  const callback = useCallback(() => setState({}), []);

  return callback;
};

export default useUpdate;

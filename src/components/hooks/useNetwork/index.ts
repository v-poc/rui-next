import { useEffect, useState } from "react";

export type NetworkState = {
  since?: Date; // Online/offline last change date
  online?: boolean; // Effective online
  rtt?: number; // Round-trip time
  type?: string; // Type of connection that a device is using to communicate with the network
  downlink?: number; // Effective bandwidth estimate in megabits per second
  downlinkMax?: number; // The maximum downlink speed
  saveData?: boolean; // Whether the user agent has set the option to reduce data usage
  effectiveType?: string; // The effective type of the connection
};

const getConnection = () => {
  const nav = navigator as any;
  if (typeof nav !== "object") {
    return null;
  }
  return nav.connection || nav.mozConnection || nav.webkitConnection;
};

const getConnectionProperty = (): NetworkState => {
  const c = getConnection();
  if (!c) {
    return {};
  }
  const { rtt, type, downlink, downlinkMax, saveData, effectiveType } = c;
  return {
    rtt,
    type,
    downlink,
    downlinkMax,
    saveData,
    effectiveType,
  };
};

const useNetwork = (): NetworkState => {
  const [state, setState] = useState<NetworkState>(() => {
    return {
      since: undefined,
      online: navigator.onLine,
      ...getConnectionProperty(),
    };
  });

  useEffect(() => {
    const onOnline = () => {
      setState((prevState: NetworkState) => {
        return {
          ...prevState,
          online: true, // online true
          since: new Date(),
        };
      });
    };

    const onOffline = () => {
      setState((prevState: NetworkState) => {
        return {
          ...prevState,
          online: false, // online false
          since: new Date(),
        };
      });
    };

    const onConnectionChange = () => {
      setState((prevState: NetworkState) => {
        return {
          ...prevState,
          ...getConnectionProperty(),
        };
      });
    };

    const connection = getConnection();
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    connection?.addEventListener("change", onConnectionChange);

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
      connection?.removeEventListener("change", onConnectionChange);
    };
  }, []);

  return state;
};

export default useNetwork;

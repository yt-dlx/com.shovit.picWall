// src/utils/useVersionCheck.tsx
import Constants from "expo-constants";
import { useState, useEffect, useMemo } from "react";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
export const useVersionCheck = () => {
  const [serverVersion, setServerVersion] = useState<String>("");
  const [currentVersion, setCurrentVersion] = useState<String>("");
  const [updateRequired, setUpdateRequired] = useState<Boolean>(false);
  useEffect(() => {
    const checkVersion = async () => {
      const response = await fetch("https://picwall-server.netlify.app/api/version", { headers: { "Content-Type": "application/json", "Cache-Control": "no-cache" } });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const current = Constants.expoConfig?.version || "";
      const receivedVersion = data?.version || data?.data?.version;
      setUpdateRequired(receivedVersion !== current);
      setServerVersion(receivedVersion);
      setCurrentVersion(current);
    };
    checkVersion();
    const interval = setInterval(checkVersion, 300000);
    return () => clearInterval(interval);
  }, []);
  return useMemo(() => ({ updateRequired, currentVersion, serverVersion }), [updateRequired, currentVersion, serverVersion]);
};
/* ============================================================================================================================== */
/* ============================================================================================================================== */

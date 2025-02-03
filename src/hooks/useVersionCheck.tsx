// src/utils/useVersionCheck.tsx
import Constants from "expo-constants";
import { useState, useEffect, useMemo } from "react";
/* ============================================================================================================================== */
/* ============================================================================================================================== */
export const useVersionCheck = () => {
  const [serverVersion, setServerVersion] = useState("");
  const [currentVersion, setCurrentVersion] = useState("");
  const [updateRequired, setUpdateRequired] = useState(false);
  useEffect(() => {
    const checkVersion = async () => {
      try {
        const response = await fetch("https://picwall-server.netlify.app/api/version", { headers: { "Content-Type": "application/json", "Cache-Control": "no-cache" } });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const receivedVersion = data?.version || data?.data?.version;
        const current = Constants.expoConfig?.version || "";
        setCurrentVersion(current);
        setServerVersion(receivedVersion);
        setUpdateRequired(receivedVersion !== current);
      } catch (error) {
        console.error("Version check failed:", error);
        setUpdateRequired(false);
      }
    };
    checkVersion();
    const interval = setInterval(checkVersion, 300000);
    return () => clearInterval(interval);
  }, []);
  return useMemo(() => ({ updateRequired, currentVersion, serverVersion }), [updateRequired, currentVersion, serverVersion]);
};
/* ============================================================================================================================== */
/* ============================================================================================================================== */

import React, { createContext, useContext, useEffect, useState } from "react";
import baseAPI from "../api/axios";

export interface Setting {
  _id: string;
  title: string;
  address: string;
  project: string;
  client: string;
  phone: string;
  email: string;
  logo: string;
  xlink?: string;
  linkedinlink?: string;
  instagramlink?: string;
  facebooklink?: string;
  deliveryFee?: number;
}

interface SettingsContextType {
  settings: Setting | null;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const defaultSettings: Setting = {
  _id: "",
  title: "CrackersSiva",
  project: "CrackersSiva",
  client: "Siva",
  phone: "+91 98765 43210",
  email: "info@crackerssiva.com",
  address: "Sivakasi, Tamil Nadu",
  logo: "",
  deliveryFee: 0,
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Setting | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    baseAPI.get("/settings")
      .then((res) => {
        if (res.data && res.data.success) {
          setSettings(res.data.result);
        }
      })
      .catch((err) => {
        console.error("Failed to load site settings:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return {
    settings: ctx.settings || defaultSettings,
    loading: ctx.loading
  };
};

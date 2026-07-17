import React from "react";
import { useAppSelector } from "../store/hooks";
import type { Setting } from "../store/slices/settingsSlice";
import { defaultSettings } from "../store/slices/settingsSlice";

export type { Setting };

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const useSettings = () => {
  const settings = useAppSelector((state) => state.settings.settings);
  const loading = useAppSelector((state) => state.settings.loading);

  return {
    settings: settings || defaultSettings,
    loading,
  };
};

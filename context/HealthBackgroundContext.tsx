"use client";

import React, { createContext, useState, type ReactNode } from "react";

interface HealthData {
  weight?: number;
  height?: number;
  // thêm các trường khác nếu cần
}

interface HealthBackgroundContextType {
  data: HealthData;
  setData: React.Dispatch<React.SetStateAction<HealthData>>;
}

export const HealthBackgroundContext = createContext<HealthBackgroundContextType | null>(null);

interface HealthBackgroundProviderProps {
  children: ReactNode;
}

export const HealthBackgroundProvider: React.FC<HealthBackgroundProviderProps> = ({ children }) => {
  const [data, setData] = useState<HealthData>({});

  return (
    <HealthBackgroundContext.Provider value={{ data, setData }}>
      {children}
    </HealthBackgroundContext.Provider>
  );
};
export const useHealthBackground = () => {
  const context = React.useContext(HealthBackgroundContext);
  if (!context) {
    throw new Error("useHealthBackground must be used within a HealthBackgroundProvider");
  }
  return context;
};
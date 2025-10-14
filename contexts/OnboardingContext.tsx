import * as React from "react";
import { createContext, useContext, useState } from "react";

interface OnboardingData {
  name?: string;
  dob?: string;
  gender?: string;
  medNo?: string;
  medDate?: string;
  medFac?: string;
  underlyingDiseases?: string[];
  hasInsurance?: boolean;
  avatar?: string; // Avatar URL - mặc định sẽ được set khi khởi tạo
}

interface OnboardingContextType {
  data: OnboardingData;
  setData: (fields: Partial<OnboardingData>) => void;
  reset: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Khởi tạo với avatar mặc định
  const defaultAvatar =
    "https://i.pinimg.com/736x/e9/e0/7d/e9e07de22e3ef161bf92d1bcf241e4d0.jpg";
  const [data, setDataState] = useState<OnboardingData>({
    avatar: defaultAvatar,
  });

  const setData = (fields: Partial<OnboardingData>) => {
    setDataState((prev) => ({ ...prev, ...fields }));
  };

  const reset = () => setDataState({});

  return (
    <OnboardingContext.Provider value={{ data, setData, reset }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const ctx = useContext(OnboardingContext);
  if (!ctx)
    throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
};

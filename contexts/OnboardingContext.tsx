import React, { createContext, useContext, useState } from "react";

interface OnboardingData {
  name?: string;
  dob?: string;
  gender?: string;
  medNo?: string;
  medDate?: string;
  medFac?: string;
  // bổ sung field nếu có bước khác
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
}) => {
  const [data, setDataState] = useState<OnboardingData>({});

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

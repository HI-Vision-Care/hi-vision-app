// hooks/useOnboardingNavigation.ts
import { usePathname, useRouter } from "expo-router";
import React from "react";

const ONBOARDING_ROUTES = [
  "/patient-name",
  "/patient-gender",
  "/patient-medicalcard",
];

export const useOnboardingNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentIndex = ONBOARDING_ROUTES.indexOf(pathname);
  const totalSteps = ONBOARDING_ROUTES.length;

  const progress = currentIndex >= 0 ? (currentIndex + 1) / totalSteps : 0;

  const handleContinue = React.useCallback(() => {
    const next = currentIndex + 1;
    if (next < ONBOARDING_ROUTES.length) {
      router.replace(ONBOARDING_ROUTES[next] as any);
    } else {
      router.replace("/(root)/(tabs)/home");
    }
  }, [currentIndex, router]);

  const handleBack = React.useCallback(() => {
    const prev = currentIndex - 1;
    if (prev >= 0) {
      router.replace(ONBOARDING_ROUTES[prev] as any);
    } else {
      console.warn("No previous onboarding screen to go back to.");
    }
  }, [currentIndex, router]);

  const handleSkip = React.useCallback(
    () => router.push("/(root)/(tabs)/home"),
    [router]
  );

  return { handleContinue, handleBack, handleSkip, progress };
};

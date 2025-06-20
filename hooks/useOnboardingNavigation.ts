// hooks/useOnboardingNavigation.ts
import { usePathname, useRouter } from "expo-router";
import React from "react";

const ONBOARDING_ROUTES = [
  "/patient-goal",
  "/patient-gender",
  "/patient-weight",
  "/patient-age",
  "/patient-blood",
  "/patient-eating",
  "/patient-medication",
  "/patient-symptoms",
];

export const useOnboardingNavigation = () => {
  const router = useRouter();
  const pathname = usePathname(); // e.g. "/patient-goal"
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

  const handleBack = React.useCallback(() => router.back(), [router]);
  const handleSkip = React.useCallback(
    () => router.push("/(root)/(tabs)/home"),
    [router]
  );

  return { handleContinue, handleBack, handleSkip, progress };
};

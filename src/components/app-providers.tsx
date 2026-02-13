import {
  QueryClient,
  QueryClientProvider,
  focusManager,
  onlineManager,
} from "@tanstack/react-query";
import * as Network from "expo-network";
import { HeroUINativeConfig, HeroUINativeProvider } from "heroui-native";
import { useEffect } from "react";
import { AppState, Platform } from "react-native";
import type { AppStateStatus } from "react-native";

// ── HeroUI Native ────────────────────────────────────────────────
const heroUINativeConfig: HeroUINativeConfig = {
  devInfo: { stylingPrinciples: false },
};

// ── TanStack Query ------------------------------------------------
export const queryClient = new QueryClient();

onlineManager.setEventListener((setOnline) => {
  const eventSubscription = Network.addNetworkStateListener((state) => {
    setOnline(!!state.isConnected);
  });
  return eventSubscription.remove;
});

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

// --- Final Providers Setup ------------------------------------------

export function AppProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);
    return () => subscription.remove();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <HeroUINativeProvider config={heroUINativeConfig}>{children}</HeroUINativeProvider>
    </QueryClientProvider>
  );
}

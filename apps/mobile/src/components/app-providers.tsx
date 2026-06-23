import { QueryClient, QueryClientProvider, focusManager, onlineManager } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import * as Network from "expo-network";
import { HeroUINativeConfig, HeroUINativeProvider } from "heroui-native";
import { useEffect, useState } from "react";
import { AppState, Platform } from "react-native";
import type { AppStateStatus } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";

import type { AppRouter } from "@repo/api";
import { superjsonTransformer } from "@repo/rpc";

import { ENV } from "@/lib/env";
import { TRPCProvider } from "@/lib/trpc";

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
  return () => eventSubscription.remove();
});

function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

function subscribeToAppStateFocus() {
  const subscription = AppState.addEventListener("change", onAppStateChange);

  return () => subscription.remove();
}

// --- Providers Setup -----------------------------------------------

export function AppProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    return subscribeToAppStateFocus();
  }, []);

  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: `${ENV.API_URL}/api/trpc`,
          transformer: superjsonTransformer,
        }),
      ],
    }),
  );

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <KeyboardProvider>
        <QueryClientProvider client={queryClient}>
          <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
            <HeroUINativeProvider config={heroUINativeConfig}>{children}</HeroUINativeProvider>
          </TRPCProvider>
        </QueryClientProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}

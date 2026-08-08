import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink, loggerLink } from "@trpc/client";
import { HeroUINativeConfig, HeroUINativeProvider } from "heroui-native";
import { useEffect, useState } from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";

import type { AppRouter } from "@repo/api";
import { superjsonTransformer } from "@repo/rpc";

import { ENV } from "@/lib/env";
import { subscribeToAppStateFocus } from "@/lib/react-query-runtime";
import { TRPCProvider } from "@/lib/trpc";

// ── HeroUI Native ────────────────────────────────────────────────
const heroUINativeConfig: HeroUINativeConfig = {
  devInfo: { stylingPrinciples: false },
};

// --- Providers Setup -----------------------------------------------

export function AppProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    return subscribeToAppStateFocus();
  }, []);

  const [queryClient] = useState(() => new QueryClient());

  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        loggerLink({ enabled: () => __DEV__ }),
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

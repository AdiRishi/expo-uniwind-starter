import type { ErrorBoundaryProps } from "expo-router";
import { Stack } from "expo-router";
import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AppProviders } from "@/components/app-providers";
import "@/global.css";
import { GenericErrorScreen } from "@/screens/error/generic-error-screen";

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider>
        <GenericErrorScreen
          title="Something went wrong"
          message="We encountered an unexpected issue while processing your request. The application has logged this event."
          errorDetails={{ status: error.message }}
          onRetry={retry}
        />
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProviders>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </AppProviders>
    </GestureHandlerRootView>
  );
}

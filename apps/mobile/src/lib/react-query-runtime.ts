import { focusManager, onlineManager } from "@tanstack/react-query";
import * as Network from "expo-network";
import { AppState, Platform } from "react-native";
import type { AppStateStatus } from "react-native";

// React Query detects online/focus via `window` events that never fire in React Native.
// These are the documented replacements, and they are global rather than per-QueryClient.
// https://tanstack.com/query/latest/docs/framework/react/react-native

onlineManager.setEventListener((setOnline) => {
  const eventSubscription = Network.addNetworkStateListener((state) => {
    setOnline(!!state.isConnected);
  });

  return () => eventSubscription.remove();
});

function onAppStateChange(status: AppStateStatus) {
  // Web already has working visibility detection.
  if (Platform.OS !== "web") {
    focusManager.setFocused(status === "active");
  }
}

export function subscribeToAppStateFocus() {
  const subscription = AppState.addEventListener("change", onAppStateChange);

  return () => subscription.remove();
}

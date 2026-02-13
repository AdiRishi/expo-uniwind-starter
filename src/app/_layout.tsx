import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AppProviders } from "@/components/app-providers";
import { AppTabs } from "@/components/app-tabs";
import "@/global.css";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProviders>
        <AppTabs />
      </AppProviders>
    </GestureHandlerRootView>
  );
}

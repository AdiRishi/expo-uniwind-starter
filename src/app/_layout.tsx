import { HeroUINativeConfig, HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { AppTabs } from "@/components/app-tabs";
import "@/global.css";

const heroUINativeConfig: HeroUINativeConfig = {
  devInfo: { stylingPrinciples: false },
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider config={heroUINativeConfig}>
        <AppTabs />
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}

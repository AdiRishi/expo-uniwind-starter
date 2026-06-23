import { AppTabs } from "@/components/app-tabs";
import { ScreenContainerScopeProvider } from "@/components/ui/screen-containers/screen-container-scope";

export default function TabsLayout() {
  return (
    <ScreenContainerScopeProvider scope="tabs">
      <AppTabs />
    </ScreenContainerScopeProvider>
  );
}

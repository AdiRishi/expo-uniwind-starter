import { Image } from "expo-image";
import { Accordion, Button } from "heroui-native";
import { View } from "react-native";

import { ExternalLink } from "@/components/external-link";
import { StandardScrollView } from "@/components/ui/screen-containers/standard-scroll-view";
import { Typography } from "@/components/ui/typography";

export function ExploreScreen() {
  return (
    <StandardScrollView className="flex-1" contentContainerClassName="gap-8 pt-12">
      <View className="items-center gap-3">
        <Typography variant="h2" align="center">
          Explore
        </Typography>
        <Typography variant="small" tone="muted" align="center">
          Learn about the key features and patterns in this template.
        </Typography>

        <ExternalLink href="https://docs.expo.dev" asChild>
          <Button variant="tertiary" size="sm">
            Expo documentation
          </Button>
        </ExternalLink>
      </View>

      <View className="px-4 pb-8">
        <Accordion selectionMode="multiple" variant="surface">
          <Accordion.Item value="routing">
            <Accordion.Trigger>
              <Typography variant="small">File-based routing</Typography>
              <Accordion.Indicator />
            </Accordion.Trigger>
            <Accordion.Content>
              <View className="gap-2">
                <Typography variant="small">
                  Screens live in <Typography variant="code">src/app/</Typography> — each file
                  becomes a route. The layout file in{" "}
                  <Typography variant="code">src/app/_layout.tsx</Typography> sets up the tab
                  navigator.
                </Typography>
              </View>
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item value="platforms">
            <Accordion.Trigger>
              <Typography variant="small">Android, iOS, and web support</Typography>
              <Accordion.Indicator />
            </Accordion.Trigger>
            <Accordion.Content>
              <View className="gap-3">
                <Typography variant="small">
                  This project runs on Android, iOS, and the web. Press{" "}
                  <Typography variant="smallBold">w</Typography> in your terminal to launch the web
                  version.
                </Typography>
                <Image
                  source={require("@/assets/images/tutorial-web.png")}
                  className="mt-2 w-full rounded-xl"
                  style={{ aspectRatio: 296 / 171 }}
                />
              </View>
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item value="theme">
            <Accordion.Trigger>
              <Typography variant="small">Light and dark mode</Typography>
              <Accordion.Indicator />
            </Accordion.Trigger>
            <Accordion.Content>
              <Typography variant="small">
                Light and dark mode are built in. Use the{" "}
                <Typography variant="code">useColorScheme()</Typography> hook to read the current
                theme and adapt your UI.
              </Typography>
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item value="animations">
            <Accordion.Trigger>
              <Typography variant="small">Animations</Typography>
              <Accordion.Indicator />
            </Accordion.Trigger>
            <Accordion.Content>
              <Typography variant="small">
                The animated Expo logo on the Home tab is powered by{" "}
                <Typography variant="code">react-native-reanimated</Typography>, which is included
                and ready to use.
              </Typography>
            </Accordion.Content>
          </Accordion.Item>

          <Accordion.Item value="api-routes">
            <Accordion.Trigger>
              <Typography variant="small">API routes</Typography>
              <Accordion.Indicator />
            </Accordion.Trigger>
            <Accordion.Content>
              <Typography variant="small">
                Files ending in <Typography variant="code">+api.ts</Typography> inside{" "}
                <Typography variant="code">src/app/</Typography> become server-side endpoints. Try
                the interactive demos in the API tab.
              </Typography>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </View>
    </StandardScrollView>
  );
}

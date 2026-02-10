import { Image } from "expo-image";
import { Accordion, Button } from "heroui-native";
import { View } from "react-native";

import { ExternalLink } from "@/components/external-link";
import { StandardScrollView } from "@/components/ui/screen-containers/standard-scroll-view";
import { Typography } from "@/components/ui/typography";

export function ExploreScreen() {
  return (
    <StandardScrollView className="flex-1" contentContainerClassName="gap-6">
      <View className="items-center gap-3">
        <Typography variant="h2" align="center">
          Explore
        </Typography>
        <Typography variant="small" tone="muted" align="center">
          This starter app includes example{"\n"}code to help you get started.
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
                  This app has two screens:{" "}
                  <Typography variant="code">src/app/index.tsx</Typography> and{" "}
                  <Typography variant="code">src/app/explore.tsx</Typography>
                </Typography>
                <Typography variant="small">
                  The layout file in <Typography variant="code">src/app/_layout.tsx</Typography>{" "}
                  sets up the tab navigator.
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
                  You can open this project on Android, iOS, and the web. To open the web version,
                  press <Typography variant="smallBold">w</Typography> in the terminal running this
                  project.
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
                This template has light and dark mode support. The{" "}
                <Typography variant="code">useColorScheme()</Typography> hook lets you inspect the
                user&apos;s current color scheme, and adjust UI colors accordingly.
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
                This template includes an example of an animated component. The{" "}
                <Typography variant="code">react-native-reanimated</Typography> library powers
                smooth animations throughout the app.
              </Typography>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </View>
    </StandardScrollView>
  );
}

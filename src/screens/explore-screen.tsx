import { Button, Card, Separator } from "heroui-native";
import { View } from "react-native";

import { ExternalLink } from "@/components/external-link";
import { StandardScrollView } from "@/components/ui/screen-containers/standard-scroll-view";
import { Typography } from "@/components/ui/typography";

const FEATURES = [
  { title: "File-based Routing", description: "Routes in src/app/ — each file becomes a screen" },
  { title: "Tailwind CSS v4", description: "Utility-first styling via Uniwind for React Native" },
  { title: "Type-safe API", description: "tRPC v11 with end-to-end TypeScript inference" },
  { title: "Form Validation", description: "Tanstack Form with Zod schemas and reusable fields" },
  { title: "Dark Mode", description: "Built-in light and dark themes via CSS variables" },
  { title: "Cross-platform", description: "Runs on iOS, Android, and web from one codebase" },
] as const;

export function ExploreScreen() {
  return (
    <StandardScrollView className="flex-1" contentContainerClassName="gap-8 pb-8 pt-12">
      <View className="items-center gap-3">
        <Typography variant="h2" align="center">
          What&apos;s Inside
        </Typography>
        <Typography variant="small" tone="muted" align="center">
          Everything you need to build production apps.
        </Typography>
      </View>

      <Card>
        <Card.Body className="p-0">
          {FEATURES.map((feature, index) => (
            <View key={feature.title}>
              {index > 0 && <Separator />}
              <View className="flex-row items-start gap-3 px-4 py-3.5">
                <View className="mt-1.5 size-2 rounded-full bg-accent" />
                <View className="flex-1 gap-0.5">
                  <Typography variant="smallBold">{feature.title}</Typography>
                  <Typography variant="caption" tone="muted">
                    {feature.description}
                  </Typography>
                </View>
              </View>
            </View>
          ))}
        </Card.Body>
      </Card>

      <View className="items-center">
        <ExternalLink href="https://docs.expo.dev" asChild>
          <Button variant="tertiary" size="sm">
            Expo Documentation
          </Button>
        </ExternalLink>
      </View>
    </StandardScrollView>
  );
}

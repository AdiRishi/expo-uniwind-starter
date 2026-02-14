import { useQuery } from "@tanstack/react-query";
import { Card, Chip, Spinner } from "heroui-native";
import { View } from "react-native";

import { BrandHeroIcon } from "@/components/brand-hero-icon/brand-hero-icon";
import { StandardScrollView } from "@/components/ui/screen-containers/standard-scroll-view";
import { Typography } from "@/components/ui/typography";
import { useRefreshOnFocus } from "@/hooks/use-refresh-on-focus";
import { useTRPC } from "@/lib/trpc";

const TECH_STACK = ["Expo SDK 55", "React 19", "Tailwind v4", "tRPC v11", "HeroUI Native", "TypeScript"] as const;

export function HomeScreen() {
  const trpc = useTRPC();
  useRefreshOnFocus(trpc.hello.pathKey());
  const { data: greeting, isError, isPending } = useQuery(trpc.hello.greet.queryOptions());

  return (
    <StandardScrollView className="flex-1" contentContainerClassName="items-center gap-10 pb-8 pt-12">
      <View className="items-center gap-6">
        <BrandHeroIcon />
        <View className="items-center gap-2">
          <Typography variant="display" align="center">
            Expo Uniwind{"\n"}Starter
          </Typography>
          <Typography variant="small" tone="muted" align="center">
            A production-ready foundation for cross-platform apps.
          </Typography>
        </View>
      </View>

      <View className="flex-row flex-wrap justify-center gap-2">
        {TECH_STACK.map((tech) => (
          <Chip key={tech} variant="primary" color="default" size="sm">
            {tech}
          </Chip>
        ))}
      </View>

      <Card className="w-full">
        <Card.Body className="gap-1 p-4">
          <View className="flex-row items-center gap-2">
            {isPending ? (
              <Spinner size="sm" />
            ) : (
              <View className={`size-2 rounded-full ${isError ? "bg-danger" : "bg-success"}`} />
            )}
            <Typography variant="smallBold">
              {isPending ? "Connecting..." : isError ? "Server Disconnected" : "Server Connected"}
            </Typography>
          </View>
          {!isPending && (
            <Typography variant="caption" tone="muted">
              {isError
                ? "Start the server with pnpm run server:dev"
                : `${greeting?.message} · Runtime: ${greeting?.runtime}`}
            </Typography>
          )}
        </Card.Body>
      </Card>

      <Typography variant="caption" tone="muted" align="center">
        Edit src/app/index.tsx to get started
      </Typography>
    </StandardScrollView>
  );
}

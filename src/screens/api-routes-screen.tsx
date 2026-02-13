import { useQuery } from "@tanstack/react-query";
import { Button, Card, Chip, Separator } from "heroui-native";
import { View } from "react-native";

import { ExternalLink } from "@/components/external-link";
import { StandardScrollView } from "@/components/ui/screen-containers/standard-scroll-view";
import { Typography } from "@/components/ui/typography";
import { useTRPC } from "@/lib/trpc";

export function ApiRoutesScreen() {
  const trpc = useTRPC();
  const { data, error, isFetching, isSuccess, isError, refetch } = useQuery(trpc.hello.greet.queryOptions());

  return (
    <StandardScrollView className="flex-1" contentContainerClassName="gap-8 pt-12">
      <View className="items-center gap-3">
        <Typography variant="h2" align="center">
          Nitro API
        </Typography>
        <Typography variant="small" tone="muted" align="center">
          Type-safe procedures in <Typography variant="code">server/trpc/routers/</Typography> with end-to-end
          TypeScript inference via tRPC.
        </Typography>

        <ExternalLink href="https://trpc.io/docs" asChild>
          <Button variant="tertiary" size="sm">
            tRPC documentation
          </Button>
        </ExternalLink>
      </View>

      <View className="gap-3 px-4 pb-8">
        <Card>
          <Card.Body className="gap-4 p-4">
            <View className="flex-row items-center justify-between">
              <Typography variant="code" tone="accent">
                trpc.hello.greet
              </Typography>
              <Chip size="sm" color={isSuccess ? "success" : isError ? "danger" : "default"} variant="soft">
                {isSuccess ? "200 OK" : isError ? "Error" : "Ready"}
              </Chip>
            </View>

            <Separator />

            {isSuccess && data ? (
              <View className="gap-2">
                <Typography variant="body" className="font-semibold">
                  {data.message}
                </Typography>
                <View className="flex-row items-center gap-2">
                  <Typography variant="caption" tone="muted">
                    {new Date(data.timestamp).toLocaleString()}
                  </Typography>
                  <Chip size="sm" variant="soft">
                    {data.runtime}
                  </Chip>
                </View>
              </View>
            ) : isError ? (
              <Typography variant="small" tone="danger">
                {error.message}
              </Typography>
            ) : (
              <Typography variant="small" tone="muted">
                Tap the button to call the tRPC procedure and see the typed response.
              </Typography>
            )}

            <Button variant="primary" size="sm" onPress={() => refetch()} isDisabled={isFetching}>
              {isFetching ? "Calling..." : isSuccess ? "Call again" : "Call procedure"}
            </Button>
          </Card.Body>
        </Card>

        <Typography variant="caption" tone="muted" align="center">
          Defined in <Typography variant="code">server/trpc/routers/hello.ts</Typography>
        </Typography>
      </View>
    </StandardScrollView>
  );
}

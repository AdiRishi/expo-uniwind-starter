import { Button, Card, Chip, Separator } from "heroui-native";
import { useState } from "react";
import { View } from "react-native";

import { ExternalLink } from "@/components/external-link";
import { StandardScrollView } from "@/components/ui/screen-containers/standard-scroll-view";
import { Typography } from "@/components/ui/typography";
import { ENV } from "@/lib/env";

type HelloResponse = {
  message: string;
  timestamp: string;
};

export function ApiRoutesScreen() {
  const [response, setResponse] = useState<HelloResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function callApi() {
    setLoading(true);
    try {
      const res = await fetch(`${ENV.API_URL}/api/hello`);
      const data: HelloResponse = await res.json();
      setResponse(data);
    } catch {
      setResponse(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <StandardScrollView className="flex-1" contentContainerClassName="gap-8 pt-12">
      <View className="items-center gap-3">
        <Typography variant="h2" align="center">
          Nitro API
        </Typography>
        <Typography variant="small" tone="muted" align="center">
          Routes in <Typography variant="code">server/routes/</Typography> become server-side
          endpoints via Nitro file-system routing.
        </Typography>

        <ExternalLink href="https://v3.nitro.build/docs/routing" asChild>
          <Button variant="tertiary" size="sm">
            Nitro routing documentation
          </Button>
        </ExternalLink>
      </View>

      <View className="gap-3 px-4 pb-8">
        <Card>
          <Card.Body className="gap-4 p-4">
            <View className="flex-row items-center justify-between">
              <Typography variant="code" tone="accent">
                GET /api/hello
              </Typography>
              <Chip size="sm" color={response ? "success" : "default"} variant="soft">
                {response ? "200 OK" : "Ready"}
              </Chip>
            </View>

            <Separator />

            {response ? (
              <View className="gap-2">
                <Typography variant="body" className="font-semibold">
                  {response.message}
                </Typography>
                <Typography variant="caption" tone="muted">
                  {new Date(response.timestamp).toLocaleString()}
                </Typography>
              </View>
            ) : (
              <Typography variant="small" tone="muted">
                Tap the button to call the API endpoint and see the response.
              </Typography>
            )}

            <Button variant="primary" size="sm" onPress={callApi} isDisabled={loading}>
              {loading ? "Calling..." : response ? "Call again" : "Call endpoint"}
            </Button>
          </Card.Body>
        </Card>

        <Typography variant="caption" tone="muted" align="center">
          Defined in <Typography variant="code">server/routes/api/hello.get.ts</Typography>
        </Typography>
      </View>
    </StandardScrollView>
  );
}

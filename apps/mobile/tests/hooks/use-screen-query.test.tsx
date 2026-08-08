import { act, waitFor } from "@testing-library/react-native";
import { renderWithTestProviders } from "@tests/testing-utils/render-with-test-providers";
import { useIsFocused } from "expo-router/react-navigation";
import { Text } from "react-native";

import { useScreenQuery } from "@/hooks/use-screen-query";
import { useTRPC } from "@/lib/trpc";

const useIsFocusedMock = useIsFocused as jest.MockedFunction<typeof useIsFocused>;

function Probe() {
  const trpc = useTRPC();
  const { data } = useScreenQuery(trpc.tasks.list.queryOptions());

  return <Text>{data ? `count:${data.length}` : "loading"}</Text>;
}

describe("useScreenQuery", () => {
  afterEach(() => {
    useIsFocusedMock.mockReturnValue(true);
  });

  test("fetches while the screen is focused", async () => {
    useIsFocusedMock.mockReturnValue(true);

    const { findByText, trpc } = renderWithTestProviders(<Probe />, {
      trpc: { queries: { "tasks.list": [] } },
    });

    await findByText("count:0");
    expect(trpc.getCalls("tasks.list")).toHaveLength(1);
  });

  test("does not observe the cache while the screen is blurred", async () => {
    useIsFocusedMock.mockReturnValue(false);

    const { queryClient, trpc } = renderWithTestProviders(<Probe />, {
      trpc: { queries: { "tasks.list": [] } },
    });

    await act(async () => {});
    expect(trpc.getCalls("tasks.list")).toHaveLength(0);

    await act(async () => {
      queryClient.setQueryData([["tasks", "list"], { type: "query" }], []);
    });

    await waitFor(() => {
      expect(
        queryClient.getQueryCache().find({ queryKey: [["tasks", "list"], { type: "query" }] })?.observers.length,
      ).toBe(0);
    });
  });
});

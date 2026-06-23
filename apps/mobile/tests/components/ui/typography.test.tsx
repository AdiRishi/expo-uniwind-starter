import { renderWithTestProviders } from "@tests/testing-utils/render-with-test-providers";
import { StyleSheet } from "react-native";

import { Typography } from "@/components/ui/typography";

describe("<Typography />", () => {
  test("applies tabular number styling when requested", () => {
    const { getByText } = renderWithTestProviders(<Typography tabularNums>12345</Typography>);

    expect(StyleSheet.flatten(getByText("12345").props.style)).toEqual(
      expect.objectContaining({
        fontVariant: ["tabular-nums"],
      }),
    );
  });

  test("preserves caller styles with tabular number styling", () => {
    const { getByText } = renderWithTestProviders(
      <Typography tabularNums style={{ color: "red" }}>
        99
      </Typography>,
    );

    expect(StyleSheet.flatten(getByText("99").props.style)).toEqual(
      expect.objectContaining({
        color: "red",
        fontVariant: ["tabular-nums"],
      }),
    );
  });
});

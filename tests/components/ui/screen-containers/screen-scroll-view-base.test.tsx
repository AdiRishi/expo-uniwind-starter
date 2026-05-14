import { renderWithTestProviders } from "@tests/testing-utils/render-with-test-providers";
import { Text } from "react-native";

import { AnimatedHeaderScrollView } from "@/components/ui/screen-containers/animated-header-scroll-view";
import { FormScrollView } from "@/components/ui/screen-containers/form-scroll-view";
import { StandardScrollView } from "@/components/ui/screen-containers/standard-scroll-view";

describe("screen scroll containers", () => {
  test("standard scroll views use shared keyboard-aware defaults", () => {
    const { getByTestId } = renderWithTestProviders(
      <StandardScrollView testID="standard-scroll">
        <Text>Content</Text>
      </StandardScrollView>,
    );

    expect(getByTestId("standard-scroll").props).toEqual(
      expect.objectContaining({
        automaticallyAdjustsScrollIndicatorInsets: true,
        bottomOffset: 24,
        contentInsetAdjustmentBehavior: "automatic",
        mode: "layout",
        showsHorizontalScrollIndicator: false,
        showsVerticalScrollIndicator: false,
      }),
    );
  });

  test("form scroll views keep taps handled by default", () => {
    const { getByTestId } = renderWithTestProviders(
      <FormScrollView testID="form-scroll">
        <Text>Form</Text>
      </FormScrollView>,
    );

    expect(getByTestId("form-scroll").props.keyboardShouldPersistTaps).toBe("handled");
  });

  test("edge-to-edge scroll views disable automatic inset adjustment", () => {
    const { getByTestId } = renderWithTestProviders(
      <StandardScrollView edgeToEdge testID="edge-scroll">
        <Text>Full bleed</Text>
      </StandardScrollView>,
    );

    expect(getByTestId("edge-scroll").props).toEqual(
      expect.objectContaining({
        automaticallyAdjustsScrollIndicatorInsets: false,
        contentInsetAdjustmentBehavior: "never",
      }),
    );
  });

  test("animated header scroll view renders large, collapsed, and body content", () => {
    const { getAllByText, getByText } = renderWithTestProviders(
      <AnimatedHeaderScrollView title="Dashboard" subtitle="Today" headerRight={<Text>Action</Text>}>
        <Text>Metrics</Text>
      </AnimatedHeaderScrollView>,
    );

    expect(getAllByText("Dashboard")).toHaveLength(2);
    expect(getAllByText("Today")).toHaveLength(2);
    getByText("Action");
    getByText("Metrics");
  });
});

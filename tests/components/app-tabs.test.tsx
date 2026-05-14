import { render } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { AppTabs } from "@/components/app-tabs";

// Native tabs are an Expo Router runtime primitive. This local mock keeps the test
// focused on this component's contract: which tab triggers and labels it renders.
jest.mock("expo-router/unstable-native-tabs", () => {
  const React = require("react") as typeof import("react");
  const { Text, View } = require("react-native") as typeof import("react-native");

  function NativeTabs({ children }: { children?: ReactNode }) {
    return React.createElement(View, null, children);
  }

  function Trigger({ children, name }: { children?: ReactNode; name: string }) {
    return React.createElement(View, { testID: `tab.${name}` }, children);
  }

  const NativeTabsTrigger = Object.assign(Trigger, {
    Label: ({ children }: { children?: ReactNode }) => React.createElement(Text, null, children),
    Icon: () => null,
  });
  const NativeTabsRoot = Object.assign(NativeTabs, {
    Trigger: NativeTabsTrigger,
  });

  return { NativeTabs: NativeTabsRoot };
});

describe("<AppTabs />", () => {
  test("renders the app tab workspaces", () => {
    const { getByText } = render(<AppTabs />);

    getByText("Home");
    getByText("Explore");
    getByText("Tasks");
  });
});

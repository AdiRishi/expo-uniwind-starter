/* eslint-disable @typescript-eslint/no-require-imports */

// This file is intentionally limited to platform-level test doubles: native modules,
// animation runtimes, and design-system primitives that cannot run inside Jest.
// Feature-specific behavior, such as Expo Router navigation or native tabs, belongs
// in the test or harness that needs it so each test keeps its assumptions visible.

jest.mock("@tanstack/devtools-event-client", () => {
  class EventClient {
    createEventPayload(eventSuffix: string, payload: unknown) {
      return {
        type: eventSuffix,
        payload,
      };
    }

    emit() {}

    getPluginId() {
      return "mock-devtools";
    }

    on() {
      return () => {};
    }
  }

  return { EventClient };
});

jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");

  return {
    ...Reanimated,
    default: Reanimated.default,
    useReducedMotion: () => false,
  };
});

jest.mock("expo-router/react-navigation", () => {
  const React = require("react");

  return {
    DarkTheme: {
      colors: {},
    },
    DefaultTheme: {
      colors: {},
    },
    HeaderShownContext: React.createContext(false),
    ThemeProvider: ({ children }: { children?: React.ReactNode }) => children,
    useIsFocused: jest.fn(() => true),
  };
});

jest.mock("expo-network", () => ({
  addNetworkStateListener: () => ({
    remove: jest.fn(),
  }),
}));

jest.mock("expo-symbols", () => {
  const React = require("react");
  const { Text } = require("react-native");

  return {
    SymbolView: ({ name }: { name: { ios?: string; android?: string; web?: string } }) =>
      React.createElement(
        Text,
        { accessibilityElementsHidden: true },
        name.ios ?? name.android ?? name.web ?? "symbol",
      ),
  };
});

jest.mock("expo-web-browser", () => ({
  WebBrowserPresentationStyle: {
    AUTOMATIC: "automatic",
  },
  openBrowserAsync: jest.fn(),
}));

jest.mock("uniwind", () => {
  const actual = jest.requireActual("uniwind");
  const cssVariables: Record<string, string> = {
    "--info": "#2563eb",
  };

  return {
    ...actual,
    useCSSVariable: (name: string) => cssVariables[name] ?? "#111827",
  };
});

jest.mock("heroui-native", () => {
  const React = require("react");
  const { Pressable, Text, TextInput, View } = require("react-native");
  const actual = jest.requireActual("heroui-native");
  const themeColors: Record<string, string> = {
    accent: "#d9412e",
    "accent-foreground": "#ffffff",
    "accent-soft": "#fee2e2",
    background: "#f7f8fa",
    border: "#e2e8f0",
    danger: "#dc2626",
    foreground: "#111827",
    muted: "#6b7280",
    surface: "#ffffff",
    success: "#16a34a",
    warning: "#d97706",
  };

  const renderChildren = (children: React.ReactNode) =>
    typeof children === "string" || typeof children === "number" ? React.createElement(Text, null, children) : children;

  const createViewComponent = (displayName = "MockView") => {
    const Component = React.forwardRef(({ children, ...props }: { children?: React.ReactNode }, ref: unknown) =>
      React.createElement(View, { ...props, ref }, children),
    );
    Component.displayName = displayName;

    return Component;
  };

  const createTextComponent = (displayName = "MockText") => {
    const Component = React.forwardRef(({ children, ...props }: { children?: React.ReactNode }, ref: unknown) =>
      React.createElement(Text, { ...props, ref }, children),
    );
    Component.displayName = displayName;

    return Component;
  };

  const createPressableComponent = (displayName = "MockPressable") => {
    const Component = React.forwardRef(
      ({ children, isDisabled, disabled, ...props }: Record<string, unknown>, ref: unknown) =>
        React.createElement(
          Pressable,
          { ...props, ref, disabled: Boolean(disabled ?? isDisabled) },
          renderChildren(children as React.ReactNode),
        ),
    );
    Component.displayName = displayName;

    return Component;
  };

  const Alert = Object.assign(createViewComponent("MockAlert"), {
    Content: createViewComponent("MockAlertContent"),
    Indicator: createViewComponent("MockAlertIndicator"),
    Title: createTextComponent("MockAlertTitle"),
  });
  const Button = Object.assign(createPressableComponent("MockButton"), {
    Label: createTextComponent("MockButtonLabel"),
  });
  const Card = Object.assign(createViewComponent("MockCard"), {
    Body: createViewComponent("MockCardBody"),
  });
  const Checkbox = ({
    isSelected,
    onSelectedChange,
    ...props
  }: {
    isSelected?: boolean;
    onSelectedChange?: (isSelected: boolean) => void;
  }) =>
    React.createElement(Pressable, {
      accessibilityRole: "checkbox",
      accessibilityState: { checked: Boolean(isSelected) },
      onPress: () => onSelectedChange?.(!isSelected),
      ...props,
    });
  const Chip = createPressableComponent("MockChip");
  const Input = React.forwardRef((props: Record<string, unknown>, ref: unknown) =>
    React.createElement(TextInput, { ...props, ref }),
  );
  Input.displayName = "MockInput";

  function HeroUINativeProvider({ children }: { children?: React.ReactNode }) {
    return React.createElement(React.Fragment, null, children);
  }

  return {
    ...actual,
    Alert,
    Button,
    Card,
    Checkbox,
    Chip,
    FieldError: createTextComponent("MockFieldError"),
    HeroUINativeProvider,
    Input,
    Label: createTextComponent("MockLabel"),
    Separator: createViewComponent("MockSeparator"),
    Spinner: () => React.createElement(Text, { accessibilityLabel: "Loading" }, "Loading"),
    TextField: createViewComponent("MockTextField"),
    useThemeColor: (token: string | string[]) =>
      Array.isArray(token) ? token.map((item) => themeColors[item] ?? "#111827") : (themeColors[token] ?? "#111827"),
  };
});

jest.mock("react-native-keyboard-controller", () => {
  const React = require("react");
  const { ScrollView, View } = require("react-native");
  const KeyboardAwareScrollView = React.forwardRef((props: Record<string, unknown>, ref: unknown) =>
    React.createElement(ScrollView, { ...props, ref }),
  );
  KeyboardAwareScrollView.displayName = "MockKeyboardAwareScrollView";

  return {
    KeyboardAwareScrollView,
    KeyboardProvider: ({ children }: { children?: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    KeyboardStickyView: ({ children, ...props }: { children?: React.ReactNode }) =>
      React.createElement(View, props, children),
  };
});

jest.mock("react-native-worklets", () => ({
  __esModule: true,
  callMicrotasks: jest.fn(),
  createSerializable: <TValue>(value: TValue) => value,
  createSynchronizable: <TValue>(value: TValue) => value,
  createWorkletRuntime: jest.fn(),
  executeOnUIRuntimeSync: <TValue>(fn: () => TValue) => fn(),
  getRuntimeKind: () => "react-native",
  getStaticFeatureFlag: () => false,
  isSerializableRef: () => true,
  isSynchronizable: () => false,
  isWorkletFunction: () => false,
  makeShareable: <TValue>(value: TValue) => value,
  makeShareableCloneOnUIRecursive: <TValue>(value: TValue) => value,
  makeShareableCloneRecursive: <TValue>(value: TValue) => value,
  runOnJS:
    <TArgs extends unknown[]>(fn: (...args: TArgs) => unknown) =>
    (...args: TArgs) =>
      fn(...args),
  runOnRuntime: <TValue>(value: TValue) => value,
  runOnUI:
    <TArgs extends unknown[]>(fn: (...args: TArgs) => unknown) =>
    (...args: TArgs) =>
      fn(...args),
  runOnUIAsync:
    <TArgs extends unknown[], TResult>(fn: (...args: TArgs) => TResult) =>
    async (...args: TArgs) =>
      fn(...args),
  runOnUISync: <TValue>(fn: () => TValue) => fn(),
  scheduleOnRN: <TArgs extends unknown[]>(fn: (...args: TArgs) => unknown, ...args: TArgs) => fn(...args),
  scheduleOnUI: <TArgs extends unknown[]>(fn: (...args: TArgs) => unknown, ...args: TArgs) => fn(...args),
  serializableMappingCache: new Map(),
  setDynamicFeatureFlag: jest.fn(),
  shareableMappingCache: new Map(),
  unstable_eventLoopTask: jest.fn(),
  WorkletsModule: {},
}));

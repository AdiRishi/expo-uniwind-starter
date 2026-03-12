import React, { createContext, use } from "react";
import type { LayoutChangeEvent, ViewProps } from "react-native";
import { View } from "react-native";
import { KeyboardStickyView } from "react-native-keyboard-controller";

import { FormScrollView } from "./form-scroll-view";

type StickyFooterFormScrollViewContextValue = {
  footerHeight: number;
  setFooterHeight: (height: number) => void;
};

const StickyFooterFormScrollViewContext = createContext<StickyFooterFormScrollViewContextValue | null>(null);

type StickyFooterFormScrollViewRootProps = {
  children: React.ReactNode;
};

type StickyFooterFormScrollViewBodyProps = React.ComponentProps<typeof FormScrollView>;

type StickyFooterFormScrollViewFooterProps = ViewProps & {
  stickToKeyboard?: boolean;
};

function Root({ children }: StickyFooterFormScrollViewRootProps) {
  const [footerHeight, setFooterHeight] = React.useState(0);

  return (
    <StickyFooterFormScrollViewContext
      value={{
        footerHeight,
        setFooterHeight,
      }}
    >
      <View className="flex-1 bg-background">{children}</View>
    </StickyFooterFormScrollViewContext>
  );
}

function Body({
  bottomOffset = 24,
  contentContainerStyle,
  disableScrollOnKeyboardHide = true,
  extraKeyboardSpace,
  ...props
}: StickyFooterFormScrollViewBodyProps) {
  const { footerHeight } = useStickyFooterFormScrollView();

  return (
    <FormScrollView
      bottomOffset={bottomOffset}
      contentContainerStyle={[contentContainerStyle, footerHeight > 0 ? { paddingBottom: footerHeight } : null]}
      disableScrollOnKeyboardHide={disableScrollOnKeyboardHide}
      extraKeyboardSpace={extraKeyboardSpace ?? footerHeight}
      {...props}
    />
  );
}

function Footer({
  children,
  className,
  onLayout,
  stickToKeyboard = false,
  ...props
}: StickyFooterFormScrollViewFooterProps) {
  const { setFooterHeight } = useStickyFooterFormScrollView();

  const handleLayout = (event: LayoutChangeEvent) => {
    const nextHeight = Math.ceil(event.nativeEvent.layout.height);
    setFooterHeight(nextHeight);
    onLayout?.(event);
  };

  return (
    <KeyboardStickyView className="absolute right-0 bottom-0 left-0" enabled={stickToKeyboard}>
      <View className={className} onLayout={handleLayout} {...props}>
        {children}
      </View>
    </KeyboardStickyView>
  );
}

function useStickyFooterFormScrollView() {
  const context = use(StickyFooterFormScrollViewContext);

  if (!context) {
    throw new Error("StickyFooterFormScrollView components must be rendered within StickyFooterFormScrollView.Root.");
  }

  return context;
}

export const StickyFooterFormScrollView = {
  Root,
  Body,
  Footer,
};

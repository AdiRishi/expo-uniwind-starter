import { useThemeColor } from "heroui-native";
import type { Ref } from "react";
import { type StyleProp, View, type ViewStyle } from "react-native";
import {
  KeyboardAwareScrollView,
  type KeyboardAwareScrollViewProps,
  type KeyboardAwareScrollViewRef,
} from "react-native-keyboard-controller";
import { type VariantProps, tv } from "tailwind-variants";

import { useScreenContainerScrollInsets } from "./use-screen-container-insets";

const screenScrollViewVariants = tv({
  base: "flex-1 bg-background px-4",
});

export type ScreenScrollViewBaseProps = KeyboardAwareScrollViewProps &
  VariantProps<typeof screenScrollViewVariants> & {
    containerStyle?: StyleProp<ViewStyle>;
    edgeToEdge?: boolean;
    ref?: Ref<KeyboardAwareScrollViewRef>;
  };

export function ScreenScrollViewBase({
  automaticallyAdjustsScrollIndicatorInsets,
  bottomOffset = 24,
  children,
  className,
  containerStyle,
  contentInsetAdjustmentBehavior,
  contentContainerClassName,
  edgeToEdge,
  ref,
  showsHorizontalScrollIndicator = false,
  showsVerticalScrollIndicator = false,
  style,
  ...props
}: ScreenScrollViewBaseProps) {
  const safeAreaInsets = useScreenContainerScrollInsets(edgeToEdge);
  const backgroundColor = useThemeColor("background");

  return (
    <View style={[{ flex: 1, backgroundColor }, safeAreaInsets, containerStyle]}>
      <KeyboardAwareScrollView
        ref={ref}
        automaticallyAdjustsScrollIndicatorInsets={automaticallyAdjustsScrollIndicatorInsets ?? !edgeToEdge}
        bottomOffset={bottomOffset}
        className={screenScrollViewVariants({ class: className })}
        contentContainerClassName={contentContainerClassName}
        contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior ?? (edgeToEdge ? "never" : "automatic")}
        mode="layout"
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        style={style}
        {...props}
      >
        {children}
      </KeyboardAwareScrollView>
    </View>
  );
}

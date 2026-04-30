import { useThemeColor } from "heroui-native";
import { View } from "react-native";
import { KeyboardAwareScrollView, type KeyboardAwareScrollViewProps } from "react-native-keyboard-controller";
import { VariantProps, tv } from "tailwind-variants";

import { useScreenContainerScrollInsets } from "./use-screen-container-insets";

const standardScrollViewVariants = tv({
  base: "flex-1 bg-background px-4",
});

type StandardScrollViewProps = KeyboardAwareScrollViewProps &
  VariantProps<typeof standardScrollViewVariants> & {
    edgeToEdge?: boolean;
  };

export function StandardScrollView({
  automaticallyAdjustsScrollIndicatorInsets,
  className,
  contentInsetAdjustmentBehavior,
  contentContainerClassName,
  edgeToEdge,
  children,
  showsVerticalScrollIndicator = false,
  showsHorizontalScrollIndicator = false,
  style,
  bottomOffset = 24,
  ...props
}: StandardScrollViewProps) {
  const safeAreaInsets = useScreenContainerScrollInsets(edgeToEdge);
  const backgroundColor = useThemeColor("background");

  return (
    <View style={[{ flex: 1, backgroundColor }, safeAreaInsets]}>
      <KeyboardAwareScrollView
        className={standardScrollViewVariants({ class: className })}
        contentContainerClassName={contentContainerClassName}
        contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior ?? (edgeToEdge ? "never" : "automatic")}
        automaticallyAdjustsScrollIndicatorInsets={automaticallyAdjustsScrollIndicatorInsets ?? !edgeToEdge}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        style={style}
        bottomOffset={bottomOffset}
        // Use spacer-based keyboard space so screen layouts reflow and settle back
        // on keyboard dismissal instead of retaining an inset-driven scroll offset.
        mode="layout"
        {...props}
      >
        {children}
      </KeyboardAwareScrollView>
    </View>
  );
}

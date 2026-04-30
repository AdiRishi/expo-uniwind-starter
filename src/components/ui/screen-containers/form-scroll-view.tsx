import { useThemeColor } from "heroui-native";
import { View } from "react-native";
import { KeyboardAwareScrollView, type KeyboardAwareScrollViewProps } from "react-native-keyboard-controller";
import { VariantProps, tv } from "tailwind-variants";

import { useScreenContainerScrollInsets } from "./use-screen-container-insets";

const formScrollViewVariants = tv({
  base: "flex-1 bg-background px-4",
});

type FormScrollViewProps = KeyboardAwareScrollViewProps &
  VariantProps<typeof formScrollViewVariants> & {
    edgeToEdge?: boolean;
  };

export function FormScrollView({
  automaticallyAdjustsScrollIndicatorInsets,
  className,
  contentInsetAdjustmentBehavior,
  contentContainerClassName,
  edgeToEdge,
  children,
  showsVerticalScrollIndicator = false,
  showsHorizontalScrollIndicator = false,
  style,
  // KeyboardAwareScrollViewProps
  bottomOffset = 24,
  ...props
}: FormScrollViewProps) {
  const safeAreaInsets = useScreenContainerScrollInsets(edgeToEdge);
  const backgroundColor = useThemeColor("background");

  return (
    <View style={[{ flex: 1, backgroundColor }, safeAreaInsets]}>
      <KeyboardAwareScrollView
        className={formScrollViewVariants({ class: className })}
        contentContainerClassName={contentContainerClassName}
        contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior ?? (edgeToEdge ? "never" : "automatic")}
        automaticallyAdjustsScrollIndicatorInsets={automaticallyAdjustsScrollIndicatorInsets ?? !edgeToEdge}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        style={style}
        // KeyboardAwareScrollViewProps
        bottomOffset={bottomOffset}
        // Use spacer-based keyboard space so form layouts reflow and settle back
        // on keyboard dismissal instead of retaining an inset-driven scroll offset.
        mode="layout"
        {...props}
      >
        {children}
      </KeyboardAwareScrollView>
    </View>
  );
}

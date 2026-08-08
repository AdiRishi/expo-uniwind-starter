import { useThemeColor } from "heroui-native";
import { View, type ViewProps } from "react-native";
import { VariantProps, tv } from "tailwind-variants";

import { useScreenContainerInsets } from "./use-screen-container-insets";

const standardViewVariants = tv({
  base: "bg-background px-4",
});

type StandardViewProps = ViewProps &
  VariantProps<typeof standardViewVariants> & {
    edgeToEdge?: boolean;
  };

export function StandardView({ children, className, edgeToEdge, style, ...props }: StandardViewProps) {
  const safeAreaInsets = useScreenContainerInsets(edgeToEdge);
  const backgroundColor = useThemeColor("background");

  // Two views on purpose: the outer one holds the safe-area padding so the background
  // still bleeds under the notch, the inner one holds the content's own layout classes.
  return (
    <View style={[{ flex: 1, backgroundColor }, safeAreaInsets]}>
      <View className={standardViewVariants({ class: className })} style={style} {...props}>
        {children}
      </View>
    </View>
  );
}

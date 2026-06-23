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

export function StandardView({ className, edgeToEdge, style, ...props }: StandardViewProps) {
  const safeAreaInsets = useScreenContainerInsets(edgeToEdge);
  const backgroundColor = useThemeColor("background");

  return (
    <View style={[{ flex: 1, backgroundColor }, safeAreaInsets]}>
      <View className={standardViewVariants({ class: className })} style={style} {...props}></View>
    </View>
  );
}

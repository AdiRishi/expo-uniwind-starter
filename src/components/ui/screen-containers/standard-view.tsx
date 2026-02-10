import { View, type ViewProps } from "react-native";
import { VariantProps, tv } from "tailwind-variants";

const standardViewVariants = tv({
  base: "bg-background px-4",
  variants: {
    insets: {
      safe: "py-safe",
      unsafe: "",
    },
  },
  defaultVariants: {
    insets: "safe",
  },
});

type StandardViewProps = ViewProps & VariantProps<typeof standardViewVariants>;

export function StandardView({ className, insets, ...props }: StandardViewProps) {
  return <View className={standardViewVariants({ insets, class: className })} {...props}></View>;
}

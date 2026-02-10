import { ScrollView, ScrollViewProps } from "react-native";
import { VariantProps, tv } from "tailwind-variants";

const standardScrollViewVariants = tv({
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
type StandardScrollViewProps = ScrollViewProps & VariantProps<typeof standardScrollViewVariants>;

export function StandardScrollView({
  className,
  insets,
  children,
  ...props
}: StandardScrollViewProps) {
  return (
    <ScrollView
      className={standardScrollViewVariants({ insets, class: className })}
      contentInsetAdjustmentBehavior="never"
      automaticallyAdjustContentInsets={false}
      {...props}
    >
      {children}
    </ScrollView>
  );
}

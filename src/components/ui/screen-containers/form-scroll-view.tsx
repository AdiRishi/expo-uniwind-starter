import { KeyboardAvoidingView, Platform, ScrollView, ScrollViewProps } from "react-native";
import { VariantProps, tv } from "tailwind-variants";

const formScrollViewVariants = tv({
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

type FormScrollViewProps = ScrollViewProps & VariantProps<typeof formScrollViewVariants>;

export function FormScrollView({
  className,
  contentContainerClassName,
  insets,
  children,
  ...props
}: FormScrollViewProps) {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1 bg-background">
      <ScrollView
        className={formScrollViewVariants({ insets, class: className })}
        contentContainerClassName={contentContainerClassName}
        contentInsetAdjustmentBehavior="never"
        automaticallyAdjustContentInsets={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        {...props}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

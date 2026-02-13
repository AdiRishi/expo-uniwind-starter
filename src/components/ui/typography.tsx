import { Text, type TextProps } from "react-native";
import { type VariantProps, tv } from "tailwind-variants";

const typographyVariants = tv({
  base: "text-foreground",
  variants: {
    variant: {
      display: "text-4xl leading-tight font-semibold tracking-tight sm:text-5xl",
      h1: "text-3xl leading-tight font-semibold tracking-tight sm:text-4xl",
      h2: "text-2xl leading-tight font-semibold tracking-tight sm:text-3xl",
      h3: "text-xl leading-8 font-semibold sm:text-2xl sm:leading-9",
      h4: "text-lg leading-7 font-semibold sm:text-xl sm:leading-8",
      body: "text-base leading-6",
      bodyBold: "text-base leading-6 font-semibold",
      small: "text-sm leading-5",
      smallBold: "text-sm leading-5 font-semibold",
      caption: "text-xs leading-4",
      code: "font-mono text-sm leading-5",
      link: "text-base leading-6 underline",
    },
    tone: {
      default: "",
      muted: "text-muted",
      link: "text-link",
      accent: "text-accent",
      success: "text-success",
      warning: "text-warning",
      danger: "text-danger",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    truncate: {
      true: "truncate",
      false: "",
    },
  },
  compoundVariants: [
    {
      variant: "caption",
      tone: "default",
      class: "text-muted",
    },
    {
      variant: "link",
      tone: "default",
      class: "text-link",
    },
  ],
  defaultVariants: {
    variant: "body",
    tone: "default",
    align: "left",
    truncate: false,
  },
});

export type TypographyProps = TextProps & VariantProps<typeof typographyVariants>;

export function Typography({ className, variant, tone, align, truncate, ...props }: TypographyProps) {
  return <Text className={typographyVariants({ variant, tone, align, truncate, class: className })} {...props} />;
}

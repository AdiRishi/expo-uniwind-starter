import { ScreenScrollViewBase, type ScreenScrollViewBaseProps } from "./screen-scroll-view-base";

type FormScrollViewProps = ScreenScrollViewBaseProps;

export function FormScrollView({ keyboardShouldPersistTaps = "handled", ...props }: FormScrollViewProps) {
  return <ScreenScrollViewBase keyboardShouldPersistTaps={keyboardShouldPersistTaps} {...props} />;
}

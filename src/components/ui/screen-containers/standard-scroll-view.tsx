import { ScreenScrollViewBase, type ScreenScrollViewBaseProps } from "./screen-scroll-view-base";

type StandardScrollViewProps = ScreenScrollViewBaseProps;

export function StandardScrollView(props: StandardScrollViewProps) {
  return <ScreenScrollViewBase {...props} />;
}

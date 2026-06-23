import type { ReactNode } from "react";
import { type StyleProp, StyleSheet, type TextStyle, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import { useThemeColors } from "@/hooks/use-theme-colors";

import { ScreenScrollViewBase, type ScreenScrollViewBaseProps } from "./screen-scroll-view-base";
import { useScreenContainerInsets } from "./use-screen-container-insets";

const COLLAPSED_HEADER_HEIGHT = 56;
const CONTENT_HORIZONTAL_PADDING = 16;

function resolveInset(value: unknown) {
  return typeof value === "number" ? value : 0;
}

type AnimatedHeaderScrollViewProps = ScreenScrollViewBaseProps & {
  title: string;
  subtitle?: string;
  headerRight?: ReactNode;
  largeTitleStyle?: StyleProp<TextStyle>;
  largeSubtitleStyle?: StyleProp<TextStyle>;
  smallTitleStyle?: StyleProp<TextStyle>;
  smallSubtitleStyle?: StyleProp<TextStyle>;
};

export function AnimatedHeaderScrollView({
  children,
  className,
  containerStyle,
  contentContainerStyle,
  edgeToEdge,
  headerRight,
  largeSubtitleStyle,
  largeTitleStyle,
  showsHorizontalScrollIndicator = false,
  showsVerticalScrollIndicator = false,
  smallSubtitleStyle,
  smallTitleStyle,
  subtitle,
  title,
  ...props
}: AnimatedHeaderScrollViewProps) {
  const scrollY = useSharedValue(0);
  const { background, border, foreground, muted, surface } = useThemeColors();
  const contentInsets = useScreenContainerInsets(edgeToEdge);
  const topInset = edgeToEdge ? 0 : resolveInset(contentInsets.paddingTop);
  const bottomInset = edgeToEdge ? 0 : resolveInset(contentInsets.paddingBottom);
  const collapsedHeaderHeight = COLLAPSED_HEADER_HEIGHT + topInset;

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const largeTitleContainerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 72], [1, 0], Extrapolation.CLAMP),
    transform: [
      {
        translateY: interpolate(scrollY.value, [0, 96], [0, -18], Extrapolation.CLAMP),
      },
      {
        scale: interpolate(scrollY.value, [-80, 0, 96], [1.08, 1, 0.94], Extrapolation.CLAMP),
      },
    ],
  }));

  const collapsedHeaderStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [28, 84], [0, 1], Extrapolation.CLAMP),
    transform: [
      {
        translateY: interpolate(scrollY.value, [28, 84], [12, 0], Extrapolation.CLAMP),
      },
    ],
  }));

  const collapsedSubtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [72, 124], [0, 1], Extrapolation.CLAMP),
    transform: [
      {
        translateY: interpolate(scrollY.value, [72, 124], [8, 0], Extrapolation.CLAMP),
      },
    ],
  }));

  const headerBackgroundStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 88], [0, 1], Extrapolation.CLAMP),
  }));

  return (
    <View style={[styles.root, { backgroundColor: background }]}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.headerBackground,
          {
            backgroundColor: surface,
            borderBottomColor: border,
            height: collapsedHeaderHeight,
          },
          headerBackgroundStyle,
        ]}
      />

      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.collapsedHeader,
          {
            height: collapsedHeaderHeight,
            paddingTop: topInset,
          },
          collapsedHeaderStyle,
        ]}
      >
        <View style={styles.collapsedHeaderContent}>
          <View style={styles.collapsedHeaderText}>
            <Animated.Text
              className="text-center text-xl font-semibold tracking-tight"
              style={[{ color: foreground }, smallTitleStyle]}
            >
              {title}
            </Animated.Text>
            {subtitle ? (
              <Animated.Text
                className="text-center text-xs"
                style={[{ color: muted }, collapsedSubtitleAnimatedStyle, smallSubtitleStyle]}
              >
                {subtitle}
              </Animated.Text>
            ) : null}
          </View>

          {headerRight ? <View style={styles.collapsedHeaderRight}>{headerRight}</View> : null}
        </View>
      </Animated.View>

      <ScreenScrollViewBase
        {...props}
        className={className ? `${className} px-0` : "px-0"}
        containerStyle={[styles.scrollContainer, { paddingTop: 0 }, containerStyle]}
        contentContainerStyle={[
          {
            paddingTop: topInset + 20,
            paddingBottom: bottomInset,
          },
          contentContainerStyle,
        ]}
        contentInsetAdjustmentBehavior="never"
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      >
        <Animated.View style={[styles.largeTitleContainer, largeTitleContainerStyle]}>
          <Animated.Text
            className="text-4xl font-semibold tracking-tight"
            style={[{ color: foreground }, largeTitleStyle]}
          >
            {title}
          </Animated.Text>
          {subtitle ? (
            <Animated.Text className="mt-2 text-base" style={[{ color: muted }, largeSubtitleStyle]}>
              {subtitle}
            </Animated.Text>
          ) : null}
        </Animated.View>

        <View className="px-4">{children}</View>
      </ScreenScrollViewBase>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  headerBackground: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 10,
  },
  collapsedHeader: {
    justifyContent: "flex-end",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 11,
  },
  collapsedHeaderContent: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: COLLAPSED_HEADER_HEIGHT,
    paddingBottom: 10,
    paddingHorizontal: CONTENT_HORIZONTAL_PADDING,
  },
  collapsedHeaderRight: {
    bottom: 10,
    position: "absolute",
    right: CONTENT_HORIZONTAL_PADDING,
  },
  collapsedHeaderText: {
    alignItems: "center",
    justifyContent: "center",
  },
  largeTitleContainer: {
    paddingBottom: 24,
    paddingHorizontal: CONTENT_HORIZONTAL_PADDING,
  },
});

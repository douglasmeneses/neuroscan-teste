import React from "react";
import {
  View,
  StyleSheet,
  Platform,
  ScrollView,
  ViewStyle,
} from "react-native";
import { WebMaxWidth, Colors } from "@/lib/constants/theme";

type WebSize = "sm" | "md" | "lg" | "full";

interface WebContainerProps {
  readonly children: React.ReactNode;
  /** Use ScrollView instead of View (default: false) */
  readonly scroll?: boolean;
  /** Background color override */
  readonly backgroundColor?: string;
  /** Extra style for the inner content */
  readonly contentStyle?: ViewStyle;
  /**
   * Max-width variant for web (ignored on mobile).
   * - "sm"   → 600px  — welcome, terms, simple info screens
   * - "md"   → 800px  — forms, questionnaires
   * - "lg"   → 1024px — results, data-heavy screens
   * - "full" → no max-width, spans entire browser width
   * Default: "md"
   */
  readonly size?: WebSize;
}

const sizeToMaxWidth: Record<WebSize, number | undefined> = {
  sm: WebMaxWidth.sm,
  md: WebMaxWidth.md,
  lg: WebMaxWidth.lg,
  full: undefined,
};

/**
 * Responsive layout wrapper.
 * - On **mobile**: simple flex:1 View or ScrollView (zero overhead).
 * - On **web**: content is centered with a sensible max-width that uses the
 *   browser viewport intelligently, plus comfortable horizontal padding.
 */
export default function WebContainer({
  children,
  scroll = false,
  backgroundColor = Colors.background,
  contentStyle,
  size = "md",
}: WebContainerProps) {
  if (Platform.OS !== "web") {
    // Mobile: pass-through, no extra wrapper
    if (scroll) {
      return (
        <ScrollView
          style={[styles.mobileRoot, { backgroundColor }]}
          contentContainerStyle={[styles.mobileContent, contentStyle]}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      );
    }
    return (
      <View style={[styles.mobileRoot, { backgroundColor }, contentStyle]}>
        {children}
      </View>
    );
  }

  // ── Web ──────────────────────────────────────────────────────
  const maxWidth = sizeToMaxWidth[size];
  const innerMaxWidth = maxWidth ? { maxWidth } : {};

  const Inner = scroll ? ScrollView : View;
  const innerProps = scroll
    ? {
        style: [
          styles.webInner,
          innerMaxWidth,
          { backgroundColor },
          contentStyle,
        ],
        contentContainerStyle: styles.scrollContent,
        keyboardShouldPersistTaps: "handled" as const,
      }
    : {
        style: [
          styles.webInner,
          innerMaxWidth,
          { backgroundColor },
          contentStyle,
        ],
      };

  return (
    <View style={[styles.webOuter, { backgroundColor }]}>
      <Inner {...innerProps}>{children}</Inner>
    </View>
  );
}

const styles = StyleSheet.create({
  mobileRoot: {
    flex: 1,
  },
  mobileContent: {
    flexGrow: 1,
  },
  webOuter: {
    flex: 1,
    alignItems: "center",
  },
  webInner: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 32,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
});

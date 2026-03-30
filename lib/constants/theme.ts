/**
 * Shared design tokens for NeuroScan app.
 * Single source of truth for colors, spacing, and typography.
 */

export const Colors = {
  primary: "#0033A0",
  primaryDark: "#0839A2",
  accent: "#4F46E5",
  background: "#f4f4f4",
  backgroundLight: "#F9FAFB",
  card: "#DEE6F5",
  optionBg: "#DEE6F5",
  white: "#FFFFFF",
  text: "#333333",
  textSecondary: "#7189BC",
  textMuted: "#395281",
  border: "#e0e0e0",
  borderLight: "#E5E7EB",
  error: "#FF4444",
  disabled: "#A9A9A9",
  disabledText: "#D3D3D3",
  checkboxActive: "rgba(0, 123, 255, 0.1)",
  checkboxBorder: "#007BFF",
  overlay: "rgba(0, 0, 0, 0.5)",
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 30,
  xxl: 40,
} as const;

export const FontSizes = {
  sm: 13,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  pill: 28,
  circle: 30,
} as const;

/**
 * Responsive web max-widths for different content types.
 * "full" = no constraint (spans entire browser width).
 */
export const WebMaxWidth = {
  /** Narrow content: simple welcome/terms screens */
  sm: 600,
  /** Medium content: forms, questionnaires */
  md: 800,
  /** Wide content: results, data-heavy screens */
  lg: 1024,
} as const;

/** @deprecated Use WebMaxWidth instead */
export const WEB_MAX_WIDTH = 480;

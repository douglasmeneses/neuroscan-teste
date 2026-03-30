import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import {
  Colors,
  Spacing,
  FontSizes,
  BorderRadius,
} from "@/lib/constants/theme";

type ButtonProps = {
  readonly title: string;
  readonly onPress: () => void;
  readonly disabled?: boolean;
  readonly color?: string;
};

export default function BtnForm({
  title,
  onPress,
  disabled = false,
  color = Colors.primary,
}: ButtonProps) {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: disabled ? Colors.disabled : color },
        ]}
        onPress={onPress}
        disabled={disabled}
      >
        <Text
          style={[styles.buttonText, disabled && styles.buttonTextDisabled]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
  },
  button: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    marginTop: Spacing.sm,
    width: "100%",
    maxWidth: 400,
  },
  buttonText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: "bold",
  },
  buttonTextDisabled: {
    color: "#D3D3D3",
  },
});

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors, FontSizes, Spacing } from "@/lib/constants/theme";

type Option<T> = {
  label: string;
  value: T;
};

type Props<T> = {
  readonly options: Option<T>[];
  readonly value: T | null;
  readonly onChange: (value: T) => void;
  readonly label?: string;
  readonly horizontal?: boolean;
};

export default function RadioGroup<T>({
  options,
  value,
  onChange,
  label,
  horizontal = false,
}: Props<T>) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.groupLabel}>{label}</Text>}

      <View
        style={[
          styles.optionsContainer,
          horizontal && { flexDirection: "row", flexWrap: "wrap" },
        ]}
      >
        {options.map((option, index) => {
          const selected = option.value === value;

          return (
            <TouchableOpacity
              key={String(option.value)}
              style={[
                styles.radioItem,
                horizontal && { marginRight: 20, marginBottom: 10 },
              ]}
              onPress={() => onChange(option.value)}
            >
              <View
                style={[
                  styles.radioCircle,
                  selected && styles.radioCircleSelected,
                ]}
              >
                {selected && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.radioLabel}>{option.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
    alignItems: "center",
  },
  groupLabel: {
    fontSize: FontSizes.md,
    fontWeight: "600",
    marginBottom: Spacing.xs,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  optionsContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.textSecondary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.sm,
  },
  radioCircleSelected: {
    borderColor: Colors.primaryDark,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primaryDark,
  },
  radioLabel: {
    fontSize: FontSizes.md,
    color: Colors.text,
  },
});

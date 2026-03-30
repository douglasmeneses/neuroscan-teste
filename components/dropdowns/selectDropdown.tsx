import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Select, { ISelectItem } from "rn-custom-select-dropdown";
import { Colors, FontSizes, Spacing } from "@/lib/constants/theme";

type Props<T> = {
  readonly items: Array<ISelectItem<T>>;
  readonly value: ISelectItem<T> | null;
  readonly onChange: (item: ISelectItem<T>) => void;
  readonly placeholder?: string;
  readonly label?: string;
  readonly width?: any;
};

export default function CustomSelectDropdown<T>({
  items,
  value,
  onChange,
  placeholder = "Selecione uma opção",
  label,
  width = "100%",
}: Props<T>) {
  return (
    <View style={[styles.container, width ? { width } : undefined]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Select
        data={items}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
  },
  label: {
    marginBottom: Spacing.xs,
    fontSize: FontSizes.md,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
});

import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import {
  Colors,
  FontSizes,
  Spacing,
  BorderRadius,
} from "@/lib/constants/theme";

interface ISelectItem {
  label: string;
  value: string;
}

interface SearchDropdownProps {
  readonly label?: string;
  readonly data: ISelectItem[];
  readonly placeholder?: string;
  readonly searchPlaceholder?: string;
  readonly onChange?: (item: ISelectItem | null) => void;
  readonly width?: any;
}

export default function SearchDropdown({
  label,
  data,
  placeholder = "Selecione um item",
  searchPlaceholder = "Pesquisar...",
  onChange,
  width = "100%",
}: SearchDropdownProps) {
  const [value, setValue] = useState<string | null>(null);

  const handleChange = (item: ISelectItem) => {
    setValue(item.value);
    if (onChange) onChange(item);
  };

  return (
    <View style={[styles.container, { width }]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <Dropdown
        mode="modal"
        data={data}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
        value={value}
        onChange={handleChange}
        style={styles.dropdown}
        search
        selectedTextStyle={styles.selectedText}
        placeholderStyle={styles.placeholder}
        maxHeight={250}
        itemContainerStyle={styles.itemContainer}
        itemTextStyle={styles.itemText}
        activeColor="#e6f0ff"
        inputSearchStyle={styles.searchInput}
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
  dropdown: {
    height: 50,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.white,
  },
  itemContainer: {
    borderBottomColor: "#eee",
  },
  itemText: {
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  selectedText: {
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  placeholder: {
    fontSize: FontSizes.md,
    color: Colors.textMuted,
  },
  searchInput: {
    borderWidth: 0,
    backgroundColor: Colors.background,
    height: 40,
    borderRadius: BorderRadius.sm,
  },
});

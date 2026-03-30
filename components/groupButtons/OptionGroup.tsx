import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Colors,
  FontSizes,
  Spacing,
  BorderRadius,
} from "@/lib/constants/theme";

type Option = {
  id: number;
  label: string;
};

type Props = {
  readonly options: Option[];
  readonly selected: number | null;
  readonly onSelect: (id: number) => void;
};

export default function OptionGroup({ options, selected, onSelect }: Props) {
  return (
    <View>
      {options.map((option) => {
        const isSelected = selected === option.id;
        return (
          <TouchableOpacity
            key={option.id}
            style={[styles.option, isSelected && styles.optionSelected]}
            onPress={() => onSelect(option.id)}
          >
            <View style={styles.checkboxContainer}>
              <View
                style={[styles.checkbox, isSelected && styles.checkboxChecked]}
              >
                {isSelected && (
                  <Ionicons name="checkmark" size={12} color="#fff" />
                )}
              </View>
              <Text
                style={styles.optionText}
                numberOfLines={0} // Permite múltiplas linhas
                ellipsizeMode="tail" // Adiciona "..." se necessário
              >
                {option.label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.optionBg,
  },
  optionSelected: {
    backgroundColor: "rgba(56, 60, 64, 0.18)",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.textSecondary,
    borderRadius: 10,
    marginRight: Spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: Colors.accent,
  },
  optionText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    flexShrink: 1,
    flexWrap: "wrap",
    flex: 1,
    fontWeight: "600",
  },
});

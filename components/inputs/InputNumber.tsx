import { View, Text, TextInput, StyleSheet } from "react-native";
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import {
  Colors,
  FontSizes,
  Spacing,
  BorderRadius,
} from "@/lib/constants/theme";

type Props<T extends FieldValues> = {
  readonly label: string;
  readonly placeholder: string;
  readonly name: FieldPath<T>;
  readonly control: Control<T>;
  readonly rules?: RegisterOptions<T, FieldPath<T>>;
  readonly iconName?: keyof typeof Ionicons.glyphMap;
  readonly width?: any;
};

export default function InputNumber<T extends FieldValues>({
  label,
  placeholder,
  name,
  control,
  rules,
  iconName,
  width = "100%",
}: Props<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View style={[styles.inputContainer, { width }]}>
          <Text style={styles.label}>{label}</Text>
          <View style={styles.inputWrapper}>
            {iconName && (
              <Ionicons
                name={iconName}
                size={20}
                color="#7189BC"
                style={styles.icon}
              />
            )}
            <TextInput
              style={[
                styles.input,
                error ? { borderColor: "red" } : {},
                iconName ? { paddingLeft: 40 } : {},
              ]}
              placeholder={placeholder}
              placeholderTextColor="#7189BC"
              keyboardType="numeric"
              value={value}
              onChangeText={onChange}
            />
          </View>
          {error && (
            <Text style={styles.errorText}>
              {error.message || "Este campo é obrigatório"}
            </Text>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  inputWrapper: {
    position: "relative",
  },
  icon: {
    position: "absolute",
    left: 15,
    top: 14,
    zIndex: 1,
  },
  input: {
    width: "100%",
    padding: 14,
    paddingLeft: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.white,
    fontSize: FontSizes.md,
  },
  errorText: {
    marginTop: 6,
    color: Colors.error,
    fontSize: FontSizes.sm,
  },
});

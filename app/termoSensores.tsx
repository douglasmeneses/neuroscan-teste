import { useState } from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import WebContainer from "@/components/layout/WebContainer";
import {
  Colors,
  FontSizes,
  Spacing,
  BorderRadius,
} from "@/lib/constants/theme";

const Sensor = require("../assets/images/appImages/sensor_icon.png");

export default function TermoSensores() {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    const newValue = !isChecked;
    setIsChecked(newValue);
    if (newValue) {
      router.push("/formInicial");
    }
  };

  return (
    <WebContainer contentStyle={styles.container} size="sm">
      <View style={styles.centerContent}>
        <View style={styles.card}>
          <View style={styles.logo}>
            <Image source={Sensor} />
          </View>
          <Text style={styles.paragraph}>
            Para uma experiência mais imersiva e funcionalidades que se adaptam
            ao seu movimento, precisamos de um sensor de movimento.
          </Text>
          <Text style={styles.paragraph}>
            Ao clicar em "aceito", você nos autoriza a usar essa tecnologia.
          </Text>
        </View>

        <TouchableWithoutFeedback onPress={handleToggle}>
          <View style={styles.checkboxContainer}>
            <View style={[styles.checkbox, isChecked && styles.checked]}>
              {isChecked && (
                <Ionicons
                  name="checkmark"
                  size={16}
                  color={Colors.checkboxBorder}
                />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Aceito o uso de sensores</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={[styles.button, !isChecked && styles.buttonDisabled]}
          onPress={() => router.push("/formInicial")}
          disabled={!isChecked}
        >
          <Text style={styles.buttonText}>Próximo</Text>
        </TouchableOpacity>
      </View>
    </WebContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: Spacing.lg,
  },
  centerContent: {
    alignItems: "center",
  },
  card: {
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  logo: {
    marginTop: Spacing.xxl,
    alignSelf: "center",
  },
  paragraph: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.sm,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.checkboxBorder,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    backgroundColor: Colors.checkboxActive,
  },
  checkboxLabel: {
    fontSize: FontSizes.md,
    color: Colors.text,
  },
  buttonWrapper: {
    alignItems: "center",
    marginTop: Spacing.lg,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: BorderRadius.pill,
    alignItems: "center",
    paddingHorizontal: 40,
  },
  buttonDisabled: {
    backgroundColor: Colors.disabled,
  },
  buttonText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: "bold",
  },
});

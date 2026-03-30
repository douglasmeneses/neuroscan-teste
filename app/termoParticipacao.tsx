import { router } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import WebContainer from "@/components/layout/WebContainer";
import {
  Colors,
  FontSizes,
  Spacing,
  BorderRadius,
} from "@/lib/constants/theme";

export default function TermoParticipacao() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <WebContainer contentStyle={styles.container} size="sm">
      <View style={styles.centerContent}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Participação</Text>
          <Text style={styles.paragraph}>
            Após a leitura do documento e tendo minhas dúvidas esclarecidas
            pelos pesquisadores, eu concordo em participar deste estudo como
            voluntário.
          </Text>
          <Text style={styles.paragraph}>
            Fui devidamente informado sobre os procedimentos, possíveis riscos e
            benefícios.
          </Text>
          <Text style={styles.paragraph}>
            Entendo que posso retirar meu consentimento a qualquer momento sem
            penalidade.
          </Text>
        </View>

        <TouchableWithoutFeedback onPress={() => setIsChecked(!isChecked)}>
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
            <Text style={styles.checkboxLabel}>
              Aceito participar da pesquisa
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          style={[styles.button, !isChecked && styles.buttonDisabled]}
          onPress={() => router.push("/experimentoToque")}
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
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: "bold",
    color: Colors.primaryDark,
    marginBottom: Spacing.sm,
  },
  paragraph: {
    fontSize: FontSizes.md,
    color: Colors.textMuted,
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

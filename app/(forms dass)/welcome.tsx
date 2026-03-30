import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import WebContainer from "@/components/layout/WebContainer";
import {
  Colors,
  FontSizes,
  Spacing,
  BorderRadius,
} from "@/lib/constants/theme";

export default function Welcome() {
  const router = useRouter();

  return (
    <WebContainer contentStyle={styles.container} size="sm">
      <Text style={styles.title}>Bem-vindo ao formulário DASS-21</Text>
      <Text style={styles.description}>
        O DASS-21 é um questionário utilizado para avaliar os níveis de
        depressão, ansiedade e estresse. Ele contém 21 perguntas que ajudam a
        identificar o seu estado emocional atual.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(forms dass)/questions")}
      >
        <Text style={styles.buttonText}>Iniciar</Text>
      </TouchableOpacity>
    </WebContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  description: {
    fontSize: FontSizes.md,
    textAlign: "center",
    marginBottom: Spacing.xxl,
  },
  button: {
    backgroundColor: Colors.accent,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
  },
  buttonText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: "bold",
  },
});

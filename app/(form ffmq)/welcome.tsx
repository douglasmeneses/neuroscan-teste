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
      <Text style={styles.title}>Bem-vindo ao formulário FFMQ</Text>
      <Text style={styles.description}>
        O FFMQ (Five Facet Mindfulness Questionnaire) é um questionário que
        avalia cinco aspectos da atenção plena: observar, descrever, agir com
        consciência, não julgar e não reagir. Ele ajuda a compreender melhor sua
        prática de mindfulness e seus efeitos.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(form ffmq)/questions")}
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
    backgroundColor: "#10B981",
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

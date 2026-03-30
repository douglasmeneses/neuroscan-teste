import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import useInicialForm from "@/lib/stores/useInicialForm";
import GraficoRadar from "@/components/graphics/graficoRadar";
import WebContainer from "@/components/layout/WebContainer";
import {
  Colors,
  FontSizes,
  Spacing,
  BorderRadius,
} from "@/lib/constants/theme";

export default function Result() {
  const router = useRouter();
  const { formData } = useInicialForm();

  const renderPair = (label: string, value?: string) => (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || "Não informado"}</Text>
    </View>
  );

  return (
    <WebContainer scroll backgroundColor={Colors.backgroundLight} size="lg">
      <View style={styles.container}>
        <Text style={styles.title}>Resultado geral</Text>

        <GraficoRadar />

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/resultDass")}
          >
            <Text style={styles.buttonText}>Ver Resultado DASS</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/resultCapc")}
          >
            <Text style={styles.buttonText}>Ver Resultado CAPC</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/resultFfmq")}
          >
            <Text style={styles.buttonText}>Ver Resultado FFMQ</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.button} onPress={() => router.push("/resultSensors")}>
          <Text style={styles.buttonText}>Ver Resultado Sensores</Text>
        </TouchableOpacity> */}
        </View>
      </View>
    </WebContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    color: "#1F2937",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#4F46E5",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  card: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "600",
  },
  footer: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

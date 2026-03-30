import { View, Text, StyleSheet } from "react-native";
import { RadarChart } from "react-native-gifted-charts";
import { FontSizes, Spacing, Colors } from "@/lib/constants/theme";

export default function GraficoRadar() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gráfico DASS-21</Text>
      <RadarChart
        data={[60, 50, 50]}
        labels={["Estresse", "Ansiedade", "Depressão"]}
        maxValue={100}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.lg,
    marginBottom: Spacing.sm,
    color: Colors.text,
  },
});

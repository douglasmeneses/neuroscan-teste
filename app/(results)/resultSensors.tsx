import { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { initDatabase, isWeb } from "@/lib/database/db";
import WebContainer from "@/components/layout/WebContainer";

interface SensorRecord {
  id: number;
  formulario: string;
  numero_pergunta: number;
  sensor: string;
  eixo_x: number;
  eixo_y: number;
  eixo_z: number;
}

function parseWebRows(columns: string[], values: any[][]): SensorRecord[] {
  return values.map((row) => {
    const obj: Record<string, any> = {};
    columns.forEach((col, i) => {
      obj[col] = row[i];
    });
    return obj as SensorRecord;
  });
}

async function fetchWebData(db: any): Promise<SensorRecord[]> {
  const res = db.exec("SELECT * FROM sensor_data ORDER BY id DESC");
  if (res.length === 0) return [];
  const { columns, values } = res[0];
  return parseWebRows(columns, values);
}

async function fetchMobileData(db: any): Promise<SensorRecord[]> {
  let result: SensorRecord[] = [];
  await db.withTransactionAsync(async () => {
    result = (await db.getAllAsync(
      "SELECT * FROM sensor_data ORDER BY id DESC",
    )) as SensorRecord[];
  });
  return result;
}

export default function ResultSensors() {
  const [dados, setDados] = useState<SensorRecord[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = await initDatabase();
        const data = isWeb ? await fetchWebData(db) : await fetchMobileData(db);
        setDados(data);
      } catch (error) {
        console.error("Erro ao buscar dados do sensor:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <WebContainer size="lg">
      <View style={styles.container}>
        <Text style={styles.title}>Leituras do Sensor</Text>
        <FlatList
          data={dados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.text}>Formulário: {item.formulario}</Text>
              <Text style={styles.text}>Pergunta: {item.numero_pergunta}</Text>
              <Text style={styles.text}>
                Sensor: {item.sensor.toUpperCase()}
              </Text>
              <Text style={styles.text}>
                X: {item.eixo_x.toFixed(2)} | Y: {item.eixo_y.toFixed(2)} | Z:{" "}
                {item.eixo_z?.toFixed(2) ?? "0.00"}
              </Text>
            </View>
          )}
        />
      </View>
    </WebContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  item: {
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  text: { fontSize: 16 },
});

// === SEU CÓDIGO COMPLETO — SOMENTE ALTEREI O ENVIO DO ARQUIVO ===

import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Platform, Alert } from "react-native";
import { useRouter } from "expo-router";
import pako from "pako";

import OptionGroup from "@/components/groupButtons/OptionGroup";
import BtnForm from "@/components/buttons/btnForm";
import { useSensorLoggerMobile } from "@/lib/hooks/useSensorLoggerMobile";
import { useSensorLoggerWeb } from "@/lib/hooks/useSensorLoggerWeb";
import { useRequest } from "@/lib/hooks/useRequest";
import {
  useAccelerometerWeb,
  useGyroscopeWeb,
} from "@/lib/hooks/useSampleSensor";
import { useUserStore } from "@/lib/stores/useUserStore";
import WebContainer from "@/components/layout/WebContainer";
import { Colors } from "@/lib/constants/theme";

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return bytes + " bytes";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
};

interface Question {
  text: string;
  options: { id: number; label: string }[];
}

interface QuestionnaireTemplateProps {
  questions: Question[];
  sensorKey: string;
  store: any;
  finishRoute: string;
  endpoint?: string;
}

function useSensorLogger(sensorKey: string, questionNumber: number) {
  if (Platform.OS === "web") {
    useSensorLoggerWeb(sensorKey, questionNumber);
  } else {
    useSensorLoggerMobile(sensorKey, questionNumber, "accelerometer");
    useSensorLoggerMobile(sensorKey, questionNumber, "gyroscope");
  }
}

function compressData(data: any) {
  const jsonString = JSON.stringify(data);
  return pako.gzip(jsonString);
}

export default function QuestionnaireTemplate({
  questions,
  sensorKey,
  store,
  finishRoute,
  endpoint,
}: QuestionnaireTemplateProps) {
  const router = useRouter();

  const { user } = useUserStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [tempoRespostaRegistrado, setTempoRespostaRegistrado] = useState(false);
  const [startTime, setStartTime] = useState<Date>(new Date());

  const {
    samples: accelerometerSamples,
    start: startAccel,
    pause: pauseAccel,
  } = useAccelerometerWeb(currentIndex);
  const {
    samples: gyroscopeSamples,
    start: startGyro,
    pause: pauseGyro,
  } = useGyroscopeWeb(currentIndex);

  const { loading } = useRequest();
  const current = questions[currentIndex];

  useSensorLogger(sensorKey, currentIndex + 1);

  useEffect(() => {
    setStartTime(new Date());
    setTempoRespostaRegistrado(false);
    startAccel();
    startGyro();
  }, [currentIndex]);

  const getElapsedSeconds = () => {
    const ms = new Date().getTime() - startTime.getTime();
    return Math.round((ms / 1000) * 100) / 100;
  };

  const handleAnswer = (id: number) => {
    const tempo = getElapsedSeconds();
    store.setResposta(currentIndex, id);

    if (!tempoRespostaRegistrado) {
      store.setTempoResposta(currentIndex, tempo);
      setTempoRespostaRegistrado(true);
    }

    store.incrementaClique(currentIndex, id);
  };

  const respostaAtual = store.respostas[currentIndex]?.resposta ?? null;

  const handleNext = async () => {
    const tempo = getElapsedSeconds();
    store.setTempo(currentIndex, tempo);

    try {
      pauseAccel();
      pauseGyro();

      const r = store.respostas[currentIndex];

      const timestampInicialRaw =
        accelerometerSamples[0]?.timestamp ??
        gyroscopeSamples[0]?.timestamp ??
        Date.now();

      const timestampInicial =
        typeof timestampInicialRaw === "string"
          ? new Date(timestampInicialRaw).getTime()
          : timestampInicialRaw;

      const sensores = accelerometerSamples.map((acc, i) => {
        const gyro = gyroscopeSamples[i] || {
          eixo_x: 0,
          eixo_y: 0,
          eixo_z: 0,
          timestamp: acc.timestamp,
        };

        const accTimestamp = acc.timestamp
          ? typeof acc.timestamp === "string"
            ? new Date(acc.timestamp).getTime()
            : acc.timestamp
          : timestampInicial;

        const offset = accTimestamp - timestampInicial;

        return [
          offset,
          acc.eixo_x,
          acc.eixo_y,
          acc.eixo_z,
          gyro.eixo_x,
          gyro.eixo_y,
          gyro.eixo_z,
        ];
      });

      const payload = {
        usuario_id: user.id,
        pergunta_id: currentIndex + 1,
        resposta: r.resposta,
        duracao: r.tempo,
        idle: r.tempoResposta,
        quantidade_cliques:
          (r.cliqueResposta1 ?? 0) +
          (r.cliqueResposta2 ?? 0) +
          (r.cliqueResposta3 ?? 0) +
          (r.cliqueResposta4 ?? 0),
        quantidade_passos: 0,
        timestamp_inicial: timestampInicial,
        sensores,
      };

      const compressedPayload = compressData(payload);

      // ✅ Criar o arquivo .gz (Blob)
      const blob = new Blob([compressedPayload], {
        type: "application/gzip",
      });

      // ⬇️ Download automático (opcional)
      if (Platform.OS === "web") {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `dados_sensores_pergunta_${currentIndex + 1}.gz`;
        a.click();
        URL.revokeObjectURL(url);
      }

      // --------------------------------------------------
      // 🔥 ENVIO DO ARQUIVO .GZ VIA FORM DATA
      // --------------------------------------------------
      const formData = new FormData();
      formData.append(
        "file",
        blob,
        `dados_sensores_pergunta_${currentIndex + 1}.gz`,
      );

      const response = await fetch(endpoint!, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Erro ao enviar arquivo: ${response.status}`);
      }

      console.log("📤 Arquivo .gz enviado com sucesso!");
    } catch (err: any) {
      console.error("❌ Erro ao enviar dados:", err);
      Alert.alert("Erro", err.message || "Falha ao enviar respostas");
      return;
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      router.replace(finishRoute as any);
    }
  };

  return (
    <WebContainer scroll backgroundColor={Colors.background} size="md">
      <View style={styles.container}>
        <View style={{ alignItems: "flex-start" }}>
          <Text style={{ color: Colors.primaryDark, fontSize: 16 }}>
            PERGUNTA {currentIndex + 1} de {questions.length}
          </Text>
          <Text style={styles.question}>{current.text}</Text>
        </View>

        <OptionGroup
          options={current.options}
          selected={respostaAtual}
          onSelect={handleAnswer}
        />

        <BtnForm
          title={
            currentIndex === questions.length - 1
              ? loading
                ? "Enviando..."
                : "Finalizar"
              : "Próximo"
          }
          color={Colors.accent}
          onPress={handleNext}
          disabled={respostaAtual === null || loading}
        />
      </View>
    </WebContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  question: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: Colors.textSecondary,
  },
});

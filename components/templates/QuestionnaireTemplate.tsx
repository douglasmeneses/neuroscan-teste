import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { useRouter } from "expo-router";

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

interface SensorSample {
  timestamp: string;
  eixo_x: number;
  eixo_y: number;
  eixo_z: number;
}

interface Question {
  text: string;
  options: { id: number; label: string }[];
}

interface QuestionnaireTemplateProps {
  questions: Question[];
  sensorKey: string;
  store: {
    respostas: any;
    setResposta: (index: number, value: number | null) => void;
    incrementaClique: (index: number, value: number) => void;
    setTempo: (index: number, tempo: number) => void;
    setTempoResposta: (index: number, tempo: number) => void;
  };
  finishRoute: string;
  endpoint?: string;
}

// Hook auxiliar para sensores
function useSensorLogger(sensorKey: string, questionNumber: number) {
  if (Platform.OS === "web") {
    useSensorLoggerWeb(sensorKey, questionNumber);
  } else {
    useSensorLoggerMobile(sensorKey, questionNumber, "accelerometer");
    useSensorLoggerMobile(sensorKey, questionNumber, "gyroscope");
  }
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
  const { post } = useRequest();
  const current = questions[currentIndex];

  // 🔹 Sensores Web (com clear incluído)
  const {
    samples: accelerometerSamples,
    start: startAccel,
    clear: clearAccel,
  } = useAccelerometerWeb(currentIndex);

  const {
    samples: gyroscopeSamples,
    start: startGyro,
    clear: clearGyro,
  } = useGyroscopeWeb(currentIndex);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const respostaRef = useRef(store.respostas[currentIndex]);

  // Mantém referência atualizada à resposta
  useEffect(() => {
    respostaRef.current = store.respostas[currentIndex];
  }, [store.respostas, currentIndex]);

  // Inicializa sensores apenas uma vez
  useSensorLogger(sensorKey, currentIndex + 1);
  useEffect(() => {
    startAccel();
    startGyro();
  }, []);

  // Buffers locais
  const accelBuffer = useRef<SensorSample[]>([]);
  const gyroBuffer = useRef<SensorSample[]>([]);

  // Atualiza buffers sempre que novas amostras chegarem
  useEffect(() => {
    accelBuffer.current = accelerometerSamples;
    gyroBuffer.current = gyroscopeSamples;
  }, [accelerometerSamples, gyroscopeSamples]);

  const getElapsedSeconds = () =>
    Math.round((new Date().getTime() - startTime.getTime()) / 10) / 100;

  // 🔁 Envio periódico a cada 10 segundos — limpeza IMEDIATA após copiar dados
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const r = respostaRef.current;
      const tempoAtual = getElapsedSeconds();
      store.setTempo(currentIndex, tempoAtual);

      // Copia os dados atuais para envio
      const dados_sensores = accelBuffer.current.map((acc, i) => ({
        timestamp: acc.timestamp,
        acelerometro: { ...acc },
        giroscopio: gyroBuffer.current[i] || {
          eixo_x: 0,
          eixo_y: 0,
          eixo_z: 0,
          timestamp: acc.timestamp,
        },
      }));

      if (dados_sensores.length === 0) return;

      // 🔥 Limpa imediatamente as amostras (antes do envio)
      clearAccel();
      clearGyro();
      accelBuffer.current = [];
      gyroBuffer.current = [];

      // Cria payload com snapshot dos dados
      const payload = {
        usuario_id: user.id ?? 1,
        pergunta_id: currentIndex + 1,
        resposta: r?.resposta ?? 0,
        duracao: tempoAtual,
        idle: r?.tempoResposta ?? 0,
        quantidade_cliques:
          (r?.cliqueResposta1 ?? 0) +
          (r?.cliqueResposta2 ?? 0) +
          (r?.cliqueResposta3 ?? 0) +
          (r?.cliqueResposta4 ?? 0),
        quantidade_passos: 0,
        dh_inicio: startTime.toISOString(),
        dh_fim: new Date().toISOString(),
        dados_sensores,
      };

      // 🚀 Envia de forma assíncrona, sem travar o loop
      post(`${endpoint}`, payload)
        .then(() => {
          console.log(
            `✅ Enviado ${dados_sensores.length} amostras (index ${currentIndex})`,
          );
        })
        .catch((err: any) => {
          console.warn("Falha ao enviar dados parciais:", err.message || err);
        });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentIndex, endpoint]);

  // 🟢 Quando o usuário seleciona uma resposta
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

  // 🟣 Quando o usuário clica em “Próximo”
  const handleNext = () => {
    const tempo = getElapsedSeconds();
    store.setTempo(currentIndex, tempo);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setStartTime(new Date());
      setTempoRespostaRegistrado(false);
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
            currentIndex === questions.length - 1 ? "Finalizar" : "Próximo"
          }
          color={Colors.accent}
          onPress={handleNext}
          disabled={false}
        />
      </View>
    </WebContainer>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, justifyContent: "center" },
  question: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: Colors.textSecondary,
  },
});

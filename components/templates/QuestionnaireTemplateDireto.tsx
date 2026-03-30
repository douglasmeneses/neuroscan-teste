import { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Platform, Alert } from "react-native";
import { useRouter } from "expo-router";

import OptionGroup from "@/components/groupButtons/OptionGroup";
import BtnForm from "@/components/buttons/btnForm";

import { useSensorLoggerMobile } from "@/lib/hooks/useSensorLoggerMobile";
import {
  useAccelerometerWeb,
  useGyroscopeWeb,
} from "@/lib/hooks/useSampleSensor";

import { TopLoading } from "@/components/loadings/topLoading";
import { useUserStore } from "@/lib/stores/useUserStore";
import WebContainer from "@/components/layout/WebContainer";
import { Colors } from "@/lib/constants/theme";

interface Question {
  text: string;
  options: { id: number; label: string }[];
}

interface QuestionnaireTemplateProps {
  readonly initialId: number;
  readonly questions: Question[];
  readonly sensorKey: string;
  readonly store: {
    respostas: any;
    setResposta: (index: number, value: number) => void;
    incrementaClique: (index: number, value: number) => void;
    setTempo: (index: number, tempo: number) => void;
    setTempoResposta: (index: number, tempo: number) => void;
    resetResposta: (index: number, fullReset?: boolean) => void;
  };
  readonly finishRoute: string;
  readonly endpoint?: string;
}

export default function QuestionnaireTemplateDireto({
  questions,
  initialId,
  sensorKey,
  store,
  finishRoute,
  endpoint,
}: QuestionnaireTemplateProps) {
  const router = useRouter();
  const { user } = useUserStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false); // agora controla o TopLoading

  // Controle de duração
  const [tempoRespostaRegistrado, setTempoRespostaRegistrado] = useState(false);
  const startTimeRef = useRef<number>(0);
  const questionStartTimeRef = useRef<number>(0);

  // WEB SENSORS
  const {
    samples: accelerometerSamples,
    start: startAccel,
    pause: pauseAccel,
    clear: clearAccel,
  } = useAccelerometerWeb(currentIndex);

  const {
    samples: gyroscopeSamples,
    start: startGyro,
    pause: pauseGyro,
    clear: clearGyro,
  } = useGyroscopeWeb(currentIndex);

  const current = questions[currentIndex];

  // MOBILE sensors
  useSensorLoggerMobile(sensorKey, currentIndex + 1, "accelerometer");
  useSensorLoggerMobile(sensorKey, currentIndex + 1, "gyroscope");

  // Iniciar nova pergunta
  const startNewQuestion = () => {
    setTempoRespostaRegistrado(false);
    questionStartTimeRef.current = Date.now();

    if (currentIndex === 0) {
      startTimeRef.current = Date.now();
    }

    store.resetResposta(currentIndex, true);

    if (Platform.OS === "web") {
      clearAccel?.();
      clearGyro?.();
      startAccel();
      startGyro();
    }
  };

  useEffect(() => {
    startNewQuestion();
  }, [currentIndex]);

  const getElapsedSeconds = () => {
    if (!questionStartTimeRef.current) return 0;
    return Number(
      ((Date.now() - questionStartTimeRef.current) / 1000).toFixed(2),
    );
  };

  // Responder
  const handleAnswer = (id: number) => {
    const tempoDecorrido = getElapsedSeconds();

    store.setResposta(currentIndex, id);

    if (!tempoRespostaRegistrado) {
      store.setTempoResposta(currentIndex, tempoDecorrido);
      setTempoRespostaRegistrado(true);
    }

    store.incrementaClique(currentIndex, id);
  };

  const respostaAtual = store.respostas[currentIndex]?.resposta ?? null;

  // Próxima / Enviar
  const handleNext = async () => {
    setIsSubmitting(true);

    const tempoTotalPergunta = getElapsedSeconds();

    try {
      store.setTempo(currentIndex, tempoTotalPergunta);
      await new Promise((resolve) => setTimeout(resolve, 10));

      if (Platform.OS === "web") {
        pauseAccel();
        pauseGyro();
      }

      const r = store.respostas[currentIndex];
      const duracaoFinal = r.tempo > 0 ? r.tempo : tempoTotalPergunta;

      const firstAccTs = accelerometerSamples[0]?.timestamp ?? null;
      const firstGyroTs = gyroscopeSamples[0]?.timestamp ?? null;

      let timestampInicial =
        firstAccTs || firstGyroTs || questionStartTimeRef.current;

      if (typeof timestampInicial === "string") {
        timestampInicial = new Date(timestampInicial).getTime();
      }

      const sensores =
        Platform.OS === "web"
          ? accelerometerSamples.map((acc, i) => {
              const gyro = gyroscopeSamples[i] ?? {
                eixo_x: 0,
                eixo_y: 0,
                eixo_z: 0,
                timestamp: acc.timestamp,
              };

              const tsAcc =
                typeof acc.timestamp === "string"
                  ? new Date(acc.timestamp).getTime()
                  : (acc.timestamp ?? timestampInicial);

              const offset = tsAcc - timestampInicial;

              return [
                offset,
                acc.eixo_x,
                acc.eixo_y,
                acc.eixo_z,
                gyro.eixo_x,
                gyro.eixo_y,
                gyro.eixo_z,
              ];
            })
          : [];

      const payload = {
        usuario_id: user.id ?? 1,
        pergunta_id: initialId + currentIndex,
        resposta: r.resposta,
        duracao: duracaoFinal,
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

      if (endpoint) {
        const response = await fetch(`${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error(await response.text());
      }

      if (currentIndex < questions.length - 1) {
        setCurrentIndex((p) => p + 1);
      } else {
        router.replace(finishRoute as any);
      }
    } catch (err: any) {
      Alert.alert("Erro", err.message || "Falha ao enviar dados");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getButtonTitle = (): string => {
    if (isSubmitting) return "Enviando...";
    return currentIndex === questions.length - 1 ? "Finalizar" : "Próximo";
  };

  return (
    <WebContainer scroll backgroundColor={Colors.background} size="md">
      <TopLoading visible={isSubmitting} />

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
        title={getButtonTitle()}
        color="#4F46E5"
        onPress={handleNext}
        disabled={respostaAtual === null || isSubmitting}
      />
    </WebContainer>
  );
}

const styles = StyleSheet.create({
  question: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: Colors.textSecondary,
  },
});

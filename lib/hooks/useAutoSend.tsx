import { useEffect, useRef } from "react";
import { Alert } from "react-native";
import { useRequest } from "@/lib/hooks/useRequest";
import { useUserStore } from "@/lib/stores/useUserStore";

interface SensorSample {
  eixo_x: number;
  eixo_y: number;
  eixo_z: number;
  timestamp: number;
}

interface Resposta {
  resposta: number;
  tempo: number;
  tempoResposta: number;
  cliqueResposta1: number;
  cliqueResposta2: number;
  cliqueResposta3: number;
  cliqueResposta4: number;
}

interface Store {
  respostas: Resposta[];
}

interface Payload {
  usuario_id: number;
  pergunta_id: number;
  resposta: number;
  duracao: number;
  idle: number;
  quantidade_cliques: number;
  quantidade_passos: number;
  dh_inicio: string;
  dh_fim: string;
  dados_sensores: {
    timestamp: number;
    acelerometro: SensorSample;
    giroscopio: SensorSample;
  }[];
}

export function useAutoSend(
  store: Store,
  endpoint: string,
  currentIndex: number,
  startTime: Date,
) {
  const { post } = useRequest<any, any>(); // ✅ usa seu hook de request
  const accelSamples = useRef<SensorSample[]>([]);
  const gyroSamples = useRef<SensorSample[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleAccelData = (data: { x: number; y: number; z: number }) => {
    accelSamples.current.push({
      eixo_x: data.x,
      eixo_y: data.y,
      eixo_z: data.z,
      timestamp: Date.now(),
    });
  };

  const handleGyroData = (data: { x: number; y: number; z: number }) => {
    gyroSamples.current.push({
      eixo_x: data.x,
      eixo_y: data.y,
      eixo_z: data.z,
      timestamp: Date.now(),
    });
  };

  const sendSensorData = async () => {
    const r = store.respostas[currentIndex];
    if (!r) return;

    const dados_sensores = accelSamples.current.map((acc, i) => {
      const gyro = gyroSamples.current[i] || {
        eixo_x: 0,
        eixo_y: 0,
        eixo_z: 0,
        timestamp: acc.timestamp,
      };

      return {
        timestamp: acc.timestamp,
        acelerometro: acc,
        giroscopio: gyro,
      };
    });

    const payload: Payload = {
      usuario_id: useUserStore.getState().user.id ?? 1,
      pergunta_id: currentIndex + 1,
      resposta: r.resposta,
      duracao: r.tempo,
      idle: r.tempoResposta,
      quantidade_cliques:
        r.cliqueResposta1 +
        r.cliqueResposta2 +
        r.cliqueResposta3 +
        r.cliqueResposta4,
      quantidade_passos: 0,
      dh_inicio: startTime.toISOString(),
      dh_fim: new Date().toISOString(),
      dados_sensores,
    };

    console.log("📤 Enviando payload:", payload);

    try {
      await post(endpoint, payload);
      console.log("✅ Dados enviados com sucesso!");
    } catch (err: any) {
      Alert.alert("Erro", err.message || "Falha ao enviar sensores");
    }

    accelSamples.current = [];
    gyroSamples.current = [];
  };

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(sendSensorData, 10000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex]);

  return { handleAccelData, handleGyroData, sendSensorData };
}

import { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import WebContainer from "@/components/layout/WebContainer";
import {
  Colors,
  FontSizes,
  Spacing,
  BorderRadius,
} from "@/lib/constants/theme";

const DURATION_SECONDS = 30;
const COUNTDOWN_SECONDS = 3;

type Phase = "idle" | "countdown" | "running" | "finished" | "report";

type TapLog = {
  index: number;
  side: "A (Esquerdo)" | "S (Direito)";
  timestamp: number; // ms desde o início do experimento
};

export default function ExperimentoToque() {
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>("idle");
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [timeLeft, setTimeLeft] = useState(DURATION_SECONDS);
  const [tapsLeft, setTapsLeft] = useState(0);
  const [tapsRight, setTapsRight] = useState(0);
  const [tapLog, setTapLog] = useState<TapLog[]>([]);
  const [experimentStartTime, setExperimentStartTime] = useState<Date | null>(
    null,
  );
  const [experimentEndTime, setExperimentEndTime] = useState<Date | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseLeft = useRef(new Animated.Value(1)).current;
  const pulseRight = useRef(new Animated.Value(1)).current;
  const experimentStartRef = useRef<number>(0);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Keyboard listener: A = esquerdo, S = direito
  useEffect(() => {
    if (phase !== "running" || Platform.OS !== "web") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const now = Date.now() - experimentStartRef.current;
      if (key === "a") {
        setTapsLeft((prev) => prev + 1);
        setTapLog((prev) => [
          ...prev,
          { index: prev.length + 1, side: "A (Esquerdo)", timestamp: now },
        ]);
        animatePulse(pulseLeft);
      } else if (key === "s") {
        setTapsRight((prev) => prev + 1);
        setTapLog((prev) => [
          ...prev,
          { index: prev.length + 1, side: "S (Direito)", timestamp: now },
        ]);
        animatePulse(pulseRight);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [phase]);

  const animatePulse = (animValue: Animated.Value) => {
    Animated.sequence([
      Animated.timing(animValue, {
        toValue: 0.9,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.timing(animValue, {
        toValue: 1,
        duration: 60,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const startCountdown = useCallback(() => {
    setTapsLeft(0);
    setTapsRight(0);
    setTapLog([]);
    setTimeLeft(DURATION_SECONDS);
    setCountdown(COUNTDOWN_SECONDS);
    setPhase("countdown");

    let count = COUNTDOWN_SECONDS;

    timerRef.current = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        setCountdown(0);
        startExperiment();
      }
    }, 1000);
  }, []);

  const startExperiment = () => {
    setPhase("running");
    const now = Date.now();
    experimentStartRef.current = now;
    setExperimentStartTime(new Date(now));
    setExperimentEndTime(null);
    let remaining = DURATION_SECONDS;

    timerRef.current = setInterval(() => {
      remaining -= 1;
      setTimeLeft(remaining);

      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        setExperimentEndTime(new Date());
        setPhase("finished");
      }
    }, 1000);
  };

  const handleNext = () => {
    router.push("/termoSensores");
  };

  const handleRetry = () => {
    setPhase("idle");
    setTapsLeft(0);
    setTapsRight(0);
    setTapLog([]);
    setExperimentStartTime(null);
    setExperimentEndTime(null);
    setTimeLeft(DURATION_SECONDS);
    setCountdown(COUNTDOWN_SECONDS);
  };

  const totalTaps = tapsLeft + tapsRight;
  const tapsPerSecond = (totalTaps / DURATION_SECONDS).toFixed(1);

  // ---------- IDLE ----------
  if (phase === "idle") {
    return (
      <WebContainer
        contentStyle={styles.centeredContainer}
        size="sm"
        backgroundColor={Colors.background}
      >
        <View style={styles.idleCard}>
          <Ionicons name="hand-left-outline" size={64} color={Colors.primary} />
          <Text style={styles.idleTitle}>Teste de Toque Rápido</Text>
          <Text style={styles.idleDescription}>
            Dois quadrados aparecerão na tela. Pressione a tecla{" "}
            <Text style={styles.bold}>A</Text> para o esquerdo e{" "}
            <Text style={styles.bold}>S</Text> para o direito o maior número de
            vezes que conseguir durante{" "}
            <Text style={styles.bold}>{DURATION_SECONDS} segundos</Text>.
          </Text>

          {/* Instrução dos dedos */}
          <View style={styles.fingerInstructionBox}>
            <Text style={styles.fingerInstructionTitle}>
              ☝️ Use os dedos indicador e médio
            </Text>
            <View style={styles.fingerRow}>
              <View style={styles.fingerItem}>
                <Text style={styles.fingerEmoji}>👆</Text>
                <View style={[styles.keyBadge, { backgroundColor: "#3B82F6" }]}>
                  <Text style={styles.keyBadgeText}>A</Text>
                </View>
                <Text style={styles.fingerLabel}>Indicador</Text>
              </View>
              <View style={styles.fingerItem}>
                <Text style={styles.fingerEmoji}>👆</Text>
                <View style={[styles.keyBadge, { backgroundColor: "#F97316" }]}>
                  <Text style={styles.keyBadgeText}>S</Text>
                </View>
                <Text style={styles.fingerLabel}>Médio</Text>
              </View>
            </View>
            <Text style={styles.fingerHint}>
              Posicione os dedos sobre as teclas antes de iniciar
            </Text>
          </View>

          <View style={styles.alternateInstructionBox}>
            <Text style={styles.alternateInstructionText}>
              🔄 Alterne entre as duas teclas:{" "}
              <Text style={styles.bold}>A → S → A → S...</Text>
            </Text>
            <Text style={styles.alternateInstructionSub}>
              Pressione uma tecla de cada vez, alternando entre esquerdo e
              direito o mais rápido que conseguir.
            </Text>
          </View>

          <Text style={styles.idleDescription}>
            Uma contagem regressiva indicará o momento exato para começar.
          </Text>
          <TouchableOpacity style={styles.startButton} onPress={startCountdown}>
            <Text style={styles.startButtonText}>Iniciar Experimento</Text>
          </TouchableOpacity>
        </View>
      </WebContainer>
    );
  }

  // ---------- COUNTDOWN ----------
  if (phase === "countdown") {
    return (
      <WebContainer
        contentStyle={styles.centeredContainer}
        size="sm"
        backgroundColor={Colors.primary}
      >
        <Text style={styles.countdownLabel}>Prepare-se!</Text>
        <Text style={styles.countdownNumber}>{countdown}</Text>
        <Text style={styles.countdownHint}>
          Pressione A (esquerdo) e S (direito) quando os quadrados aparecerem
        </Text>
      </WebContainer>
    );
  }

  // ---------- RUNNING ----------
  if (phase === "running") {
    const isUrgent = timeLeft <= 5;

    return (
      <WebContainer
        contentStyle={styles.runningContainer}
        size="md"
        backgroundColor={Colors.background}
      >
        {/* Timer bar */}
        <View style={styles.timerBar}>
          <View
            style={[
              styles.timerIndicator,
              { backgroundColor: isUrgent ? Colors.error : "#22C55E" },
            ]}
          />
          <Text
            style={[
              styles.timerText,
              { color: isUrgent ? Colors.error : Colors.text },
            ]}
          >
            {timeLeft}s restantes
          </Text>
        </View>

        <Text style={styles.runningHint}>
          PRESSIONE AS TECLAS O MAIS RÁPIDO POSSÍVEL!
        </Text>

        {/* Tap squares — controlled by keyboard: A = left, S = right */}
        <View style={styles.squaresRow}>
          <Animated.View style={{ transform: [{ scale: pulseLeft }], flex: 1 }}>
            <View style={[styles.tapSquare, styles.tapSquareLeft]}>
              <Text style={styles.keyLabel}>A</Text>
              <Text style={styles.tapCount}>{tapsLeft}</Text>
              <Text style={styles.tapLabel}>Esquerdo</Text>
            </View>
          </Animated.View>

          <Animated.View
            style={{ transform: [{ scale: pulseRight }], flex: 1 }}
          >
            <View style={[styles.tapSquare, styles.tapSquareRight]}>
              <Text style={styles.keyLabel}>S</Text>
              <Text style={styles.tapCount}>{tapsRight}</Text>
              <Text style={styles.tapLabel}>Direito</Text>
            </View>
          </Animated.View>
        </View>

        <Text style={styles.totalRunning}>Total: {totalTaps}</Text>
      </WebContainer>
    );
  }

  // ---------- FINISHED ----------
  if (phase === "finished") {
    return (
      <WebContainer
        scroll
        contentStyle={styles.centeredContainer}
        size="sm"
        backgroundColor={Colors.background}
      >
        <View style={styles.finishedCard}>
          <Ionicons name="checkmark-circle" size={72} color="#22C55E" />
          <Text style={styles.finishedTitle}>Tempo esgotado!</Text>
          <Text style={styles.finishedSubtitle}>Resultados do experimento</Text>

          <View style={styles.resultsGrid}>
            <View style={styles.resultItem}>
              <Text style={styles.resultValue}>{tapsLeft}</Text>
              <Text style={styles.resultLabel}>Tecla A{"\n"}Esquerdo</Text>
            </View>

            <View style={styles.resultItem}>
              <Text style={styles.resultValue}>{tapsRight}</Text>
              <Text style={styles.resultLabel}>Tecla S{"\n"}Direito</Text>
            </View>

            <View style={styles.resultItem}>
              <Text style={[styles.resultValue, { color: Colors.accent }]}>
                {totalTaps}
              </Text>
              <Text style={styles.resultLabel}>Total</Text>
            </View>

            <View style={styles.resultItem}>
              <Text style={[styles.resultValue, { color: Colors.primary }]}>
                {tapsPerSecond}
              </Text>
              <Text style={styles.resultLabel}>Toques/s</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.reportButton}
            onPress={() => setPhase("report")}
          >
            <Ionicons
              name="document-text-outline"
              size={20}
              color={Colors.white}
            />
            <Text style={styles.reportButtonText}>Ver Relatório Detalhado</Text>
          </TouchableOpacity>

          <View style={styles.finishedButtons}>
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Ionicons name="refresh" size={20} color={Colors.primary} />
              <Text style={styles.retryButtonText}>Repetir</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Próximo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </WebContainer>
    );
  }

  // ---------- REPORT ----------
  if (phase === "report") {
    // Compute intervals between consecutive taps
    const intervals = tapLog
      .slice(1)
      .map((t, i) => t.timestamp - tapLog[i].timestamp);
    const avgInterval =
      intervals.length > 0
        ? intervals.reduce((a, b) => a + b, 0) / intervals.length
        : 0;
    const minInterval = intervals.length > 0 ? Math.min(...intervals) : 0;
    const maxInterval = intervals.length > 0 ? Math.max(...intervals) : 0;

    // Count alternations (A→S or S→A)
    let alternations = 0;
    for (let i = 1; i < tapLog.length; i++) {
      if (tapLog[i].side !== tapLog[i - 1].side) alternations++;
    }
    const alternationRate =
      tapLog.length > 1
        ? ((alternations / (tapLog.length - 1)) * 100).toFixed(1)
        : "0.0";

    return (
      <WebContainer
        scroll
        contentStyle={styles.centeredContainer}
        size="md"
        backgroundColor={Colors.background}
      >
        <View style={styles.reportCard}>
          <View style={styles.reportHeader}>
            <TouchableOpacity
              style={styles.reportBackButton}
              onPress={() => setPhase("finished")}
            >
              <Ionicons name="arrow-back" size={22} color={Colors.primary} />
              <Text style={styles.reportBackText}>Voltar</Text>
            </TouchableOpacity>
            <Text style={styles.reportTitle}>📋 Relatório do Experimento</Text>
          </View>

          {/* Timestamps do evento */}
          <View style={styles.reportTimestampBox}>
            <View style={styles.reportTimestampRow}>
              <Ionicons name="play-circle" size={18} color="#22C55E" />
              <Text style={styles.reportTimestampLabel}>Início:</Text>
              <Text style={styles.reportTimestampValue}>
                {experimentStartTime
                  ? experimentStartTime.toLocaleString("pt-BR")
                  : "-"}
              </Text>
            </View>
            <View style={styles.reportTimestampRow}>
              <Ionicons name="stop-circle" size={18} color={Colors.error} />
              <Text style={styles.reportTimestampLabel}>Fim:</Text>
              <Text style={styles.reportTimestampValue}>
                {experimentEndTime
                  ? experimentEndTime.toLocaleString("pt-BR")
                  : "-"}
              </Text>
            </View>
            <View style={styles.reportTimestampRow}>
              <Ionicons name="time" size={18} color={Colors.primary} />
              <Text style={styles.reportTimestampLabel}>Duração:</Text>
              <Text style={styles.reportTimestampValue}>
                {DURATION_SECONDS} segundos
              </Text>
            </View>
          </View>

          {/* Resumo */}
          <View style={styles.reportSummaryBox}>
            <Text style={styles.reportSummaryTitle}>Resumo Geral</Text>
            <View style={styles.reportSummaryGrid}>
              <View style={styles.reportSummaryItem}>
                <Text style={styles.reportSummaryValue}>{totalTaps}</Text>
                <Text style={styles.reportSummaryLabel}>Total de toques</Text>
              </View>
              <View style={styles.reportSummaryItem}>
                <Text style={[styles.reportSummaryValue, { color: "#3B82F6" }]}>
                  {tapsLeft}
                </Text>
                <Text style={styles.reportSummaryLabel}>Tecla A (Esq.)</Text>
              </View>
              <View style={styles.reportSummaryItem}>
                <Text style={[styles.reportSummaryValue, { color: "#F97316" }]}>
                  {tapsRight}
                </Text>
                <Text style={styles.reportSummaryLabel}>Tecla S (Dir.)</Text>
              </View>
              <View style={styles.reportSummaryItem}>
                <Text style={styles.reportSummaryValue}>{tapsPerSecond}</Text>
                <Text style={styles.reportSummaryLabel}>Toques/s</Text>
              </View>
              <View style={styles.reportSummaryItem}>
                <Text style={styles.reportSummaryValue}>
                  {avgInterval.toFixed(0)}ms
                </Text>
                <Text style={styles.reportSummaryLabel}>Intervalo médio</Text>
              </View>
              <View style={styles.reportSummaryItem}>
                <Text style={styles.reportSummaryValue}>{minInterval}ms</Text>
                <Text style={styles.reportSummaryLabel}>Intervalo mín.</Text>
              </View>
              <View style={styles.reportSummaryItem}>
                <Text style={styles.reportSummaryValue}>{maxInterval}ms</Text>
                <Text style={styles.reportSummaryLabel}>Intervalo máx.</Text>
              </View>
              <View style={styles.reportSummaryItem}>
                <Text style={styles.reportSummaryValue}>
                  {alternationRate}%
                </Text>
                <Text style={styles.reportSummaryLabel}>Alternância</Text>
              </View>
            </View>
          </View>

          {/* Tabela de timestamps */}
          <Text style={styles.reportTableTitle}>Registro de cada toque</Text>
          <View style={styles.reportTable}>
            {/* Header */}
            <View style={[styles.reportTableRow, styles.reportTableHeaderRow]}>
              <Text
                style={[
                  styles.reportTableCell,
                  styles.reportTableHeaderCell,
                  { flex: 0.5 },
                ]}
              >
                #
              </Text>
              <Text
                style={[
                  styles.reportTableCell,
                  styles.reportTableHeaderCell,
                  { flex: 1.2 },
                ]}
              >
                Tecla
              </Text>
              <Text
                style={[
                  styles.reportTableCell,
                  styles.reportTableHeaderCell,
                  { flex: 1 },
                ]}
              >
                Tempo (ms)
              </Text>
              <Text
                style={[
                  styles.reportTableCell,
                  styles.reportTableHeaderCell,
                  { flex: 1 },
                ]}
              >
                Intervalo
              </Text>
            </View>
            {/* Rows */}
            <ScrollView style={{ maxHeight: 400 }}>
              {tapLog.map((tap, i) => {
                const interval =
                  i > 0 ? tap.timestamp - tapLog[i - 1].timestamp : "-";
                const isLeft = tap.side.startsWith("A");
                return (
                  <View
                    key={tap.index}
                    style={[
                      styles.reportTableRow,
                      i % 2 === 0
                        ? styles.reportTableRowEven
                        : styles.reportTableRowOdd,
                    ]}
                  >
                    <Text style={[styles.reportTableCell, { flex: 0.5 }]}>
                      {tap.index}
                    </Text>
                    <Text
                      style={[
                        styles.reportTableCell,
                        {
                          flex: 1.2,
                          color: isLeft ? "#3B82F6" : "#F97316",
                          fontWeight: "600",
                        },
                      ]}
                    >
                      {tap.side}
                    </Text>
                    <Text style={[styles.reportTableCell, { flex: 1 }]}>
                      {tap.timestamp}
                    </Text>
                    <Text style={[styles.reportTableCell, { flex: 1 }]}>
                      {interval === "-" ? "-" : `${interval}ms`}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>

          {tapLog.length === 0 && (
            <Text style={styles.reportEmpty}>Nenhum toque registrado.</Text>
          )}
        </View>
      </WebContainer>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  /* --- Shared --- */
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
  },

  bold: {
    fontWeight: "bold",
  },

  /* --- IDLE --- */
  idleCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: "center",
    width: "100%",
    maxWidth: 420,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  idleTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "bold",
    color: Colors.primaryDark,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  idleDescription: {
    fontSize: FontSizes.md,
    color: Colors.textMuted,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  fingerInstructionBox: {
    backgroundColor: "#F0F5FF",
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    padding: Spacing.md,
    width: "100%",
    alignItems: "center",
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  fingerInstructionTitle: {
    fontSize: FontSizes.md,
    fontWeight: "bold",
    color: Colors.primaryDark,
    marginBottom: Spacing.sm,
  },
  fingerRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 40,
    marginBottom: Spacing.sm,
  },
  fingerItem: {
    alignItems: "center",
  },
  fingerEmoji: {
    fontSize: 36,
  },
  keyBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 4,
  },
  keyBadgeText: {
    fontSize: FontSizes.lg,
    fontWeight: "bold",
    color: Colors.white,
  },
  fingerLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    fontWeight: "600",
  },
  fingerHint: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    fontStyle: "italic",
    textAlign: "center",
  },
  alternateInstructionBox: {
    backgroundColor: "#FFF7ED",
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: "#FDBA74",
    padding: Spacing.md,
    width: "100%",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  alternateInstructionText: {
    fontSize: FontSizes.md,
    fontWeight: "bold",
    color: "#9A3412",
    textAlign: "center",
    marginBottom: 4,
  },
  alternateInstructionSub: {
    fontSize: FontSizes.sm,
    color: "#C2410C",
    textAlign: "center",
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: BorderRadius.pill,
    marginTop: Spacing.lg,
  },
  startButtonText: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: "bold",
  },

  /* --- COUNTDOWN --- */
  countdownLabel: {
    fontSize: FontSizes.xl,
    color: Colors.white,
    fontWeight: "600",
    marginBottom: Spacing.md,
  },
  countdownNumber: {
    fontSize: 120,
    fontWeight: "bold",
    color: Colors.white,
  },
  countdownHint: {
    fontSize: FontSizes.md,
    color: "rgba(255,255,255,0.8)",
    marginTop: Spacing.lg,
    textAlign: "center",
  },

  /* --- RUNNING --- */
  runningContainer: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: "center",
  },
  timerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  timerIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.sm,
  },
  timerText: {
    fontSize: FontSizes.xl,
    fontWeight: "bold",
  },
  runningHint: {
    fontSize: FontSizes.lg,
    fontWeight: "bold",
    color: "#22C55E",
    textAlign: "center",
    marginBottom: Spacing.lg,
    letterSpacing: 1,
  },
  squaresRow: {
    flexDirection: "row",
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  tapSquare: {
    aspectRatio: 1,
    borderRadius: BorderRadius.xl,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 160,
  },
  tapSquareLeft: {
    backgroundColor: "#3B82F6",
  },
  tapSquareRight: {
    backgroundColor: "#F97316",
  },
  keyLabel: {
    fontSize: 36,
    fontWeight: "bold",
    color: "rgba(255,255,255,0.7)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 2,
    overflow: "hidden",
  },
  tapCount: {
    fontSize: 48,
    fontWeight: "bold",
    color: Colors.white,
    marginTop: Spacing.xs,
  },
  tapLabel: {
    fontSize: FontSizes.sm,
    color: "rgba(255,255,255,0.85)",
    marginTop: Spacing.xs,
  },
  totalRunning: {
    fontSize: FontSizes.xl,
    fontWeight: "bold",
    color: Colors.text,
    textAlign: "center",
  },

  /* --- FINISHED --- */
  finishedCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: "center",
    width: "100%",
    maxWidth: 420,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  finishedTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: "bold",
    color: Colors.text,
    marginTop: Spacing.sm,
  },
  finishedSubtitle: {
    fontSize: FontSizes.md,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  resultsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: Spacing.md,
    marginBottom: Spacing.xl,
    width: "100%",
  },
  resultItem: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: "center",
    minWidth: 100,
    flex: 1,
  },
  resultValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.primaryDark,
  },
  resultLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: Spacing.xs,
  },
  reportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6366F1",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: BorderRadius.pill,
    gap: Spacing.xs,
    width: "100%",
    marginBottom: Spacing.md,
  },
  reportButtonText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: "bold",
  },
  finishedButtons: {
    flexDirection: "row",
    gap: Spacing.md,
    width: "100%",
  },
  retryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: BorderRadius.pill,
    borderWidth: 2,
    borderColor: Colors.primary,
    gap: Spacing.xs,
  },
  retryButtonText: {
    fontSize: FontSizes.md,
    fontWeight: "bold",
    color: Colors.primary,
  },
  nextButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: BorderRadius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: "bold",
  },

  /* --- REPORT --- */
  reportCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    width: "100%",
    maxWidth: 620,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  reportHeader: {
    marginBottom: Spacing.md,
  },
  reportBackButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: Spacing.sm,
  },
  reportBackText: {
    fontSize: FontSizes.md,
    color: Colors.primary,
    fontWeight: "600",
  },
  reportTitle: {
    fontSize: FontSizes.xl,
    fontWeight: "bold",
    color: Colors.primaryDark,
  },
  reportTimestampBox: {
    backgroundColor: "#F0FDF4",
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    padding: Spacing.md,
    marginBottom: Spacing.md,
    gap: 8,
  },
  reportTimestampRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reportTimestampLabel: {
    fontSize: FontSizes.sm,
    fontWeight: "bold",
    color: Colors.text,
    minWidth: 60,
  },
  reportTimestampValue: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    flex: 1,
  },
  reportSummaryBox: {
    backgroundColor: "#F0F5FF",
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  reportSummaryTitle: {
    fontSize: FontSizes.md,
    fontWeight: "bold",
    color: Colors.primaryDark,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  reportSummaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: Spacing.sm,
  },
  reportSummaryItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    alignItems: "center",
    minWidth: 100,
    flex: 1,
  },
  reportSummaryValue: {
    fontSize: FontSizes.xl,
    fontWeight: "bold",
    color: Colors.primaryDark,
  },
  reportSummaryLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: 2,
  },
  reportTableTitle: {
    fontSize: FontSizes.md,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  reportTable: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border || "#E5E7EB",
    overflow: "hidden",
  },
  reportTableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  reportTableHeaderRow: {
    backgroundColor: Colors.primaryDark,
  },
  reportTableRowEven: {
    backgroundColor: "#F9FAFB",
  },
  reportTableRowOdd: {
    backgroundColor: Colors.white,
  },
  reportTableCell: {
    fontSize: FontSizes.sm,
    color: Colors.text,
  },
  reportTableHeaderCell: {
    color: Colors.white,
    fontWeight: "bold",
    fontSize: FontSizes.sm,
  },
  reportEmpty: {
    fontSize: FontSizes.md,
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: Spacing.lg,
  },
});

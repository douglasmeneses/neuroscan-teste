import { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
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

type Phase = "idle" | "countdown" | "running" | "finished";

export default function ExperimentoToque() {
  const router = useRouter();

  const [phase, setPhase] = useState<Phase>("idle");
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [timeLeft, setTimeLeft] = useState(DURATION_SECONDS);
  const [tapsLeft, setTapsLeft] = useState(0);
  const [tapsRight, setTapsRight] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseLeft = useRef(new Animated.Value(1)).current;
  const pulseRight = useRef(new Animated.Value(1)).current;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

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
    let remaining = DURATION_SECONDS;

    timerRef.current = setInterval(() => {
      remaining -= 1;
      setTimeLeft(remaining);

      if (remaining <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        setPhase("finished");
      }
    }, 1000);
  };

  const handleTapLeft = () => {
    if (phase !== "running") return;
    setTapsLeft((prev) => prev + 1);
    animatePulse(pulseLeft);
  };

  const handleTapRight = () => {
    if (phase !== "running") return;
    setTapsRight((prev) => prev + 1);
    animatePulse(pulseRight);
  };

  const handleNext = () => {
    router.push("/termoSensores");
  };

  const handleRetry = () => {
    setPhase("idle");
    setTapsLeft(0);
    setTapsRight(0);
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
            Dois quadrados aparecerão na tela. Toque neles o maior número de
            vezes que conseguir durante{" "}
            <Text style={styles.bold}>{DURATION_SECONDS} segundos</Text>.
          </Text>
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
          Comece a tocar quando os quadrados ficarem verdes
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

        <Text style={styles.runningHint}>TOQUE O MAIS RÁPIDO POSSÍVEL!</Text>

        {/* Tap squares */}
        <View style={styles.squaresRow}>
          <Animated.View style={{ transform: [{ scale: pulseLeft }], flex: 1 }}>
            <TouchableOpacity
              style={[styles.tapSquare, styles.tapSquareLeft]}
              onPress={handleTapLeft}
              activeOpacity={0.7}
            >
              <Ionicons name="hand-left" size={40} color={Colors.white} />
              <Text style={styles.tapCount}>{tapsLeft}</Text>
              <Text style={styles.tapLabel}>Esquerdo</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            style={{ transform: [{ scale: pulseRight }], flex: 1 }}
          >
            <TouchableOpacity
              style={[styles.tapSquare, styles.tapSquareRight]}
              onPress={handleTapRight}
              activeOpacity={0.7}
            >
              <Ionicons name="hand-right" size={40} color={Colors.white} />
              <Text style={styles.tapCount}>{tapsRight}</Text>
              <Text style={styles.tapLabel}>Direito</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <Text style={styles.totalRunning}>Total: {totalTaps}</Text>
      </WebContainer>
    );
  }

  // ---------- FINISHED ----------
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
            <Text style={styles.resultLabel}>Toques{"\n"}Esquerdo</Text>
          </View>

          <View style={styles.resultItem}>
            <Text style={styles.resultValue}>{tapsRight}</Text>
            <Text style={styles.resultLabel}>Toques{"\n"}Direito</Text>
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
    backgroundColor: "#22C55E",
  },
  tapSquareRight: {
    backgroundColor: "#3B82F6",
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
});

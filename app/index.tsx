import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { initializeDatabase } from "@/lib/database/initializeDatabase";
import WebContainer from "@/components/layout/WebContainer";
import {
  Colors,
  FontSizes,
  Spacing,
  BorderRadius,
} from "@/lib/constants/theme";

// @ts-ignore
import logo from "@/assets/images/appImages/logo.png";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        await initializeDatabase();
      } catch (error) {
        console.warn("Erro ao inicializar o banco de dados:", error);
      }
    })();
  }, []);

  const handleStart = () => router.replace("/sobre");

  return (
    <WebContainer backgroundColor={Colors.primary} size="full">
      <View style={styles.container}>
        <View style={styles.logo}>
          <Image source={logo} />
        </View>

        <View style={styles.welcomeContainer}>
          <Text style={styles.title}>Seja{"\n"}bem vindo!</Text>
        </View>

        <View style={styles.bottomCurve}>
          <TouchableOpacity style={styles.button} onPress={handleStart}>
            <Text style={styles.buttonText}>Vamos lá!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </WebContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  logo: {
    marginTop: Spacing.xxl,
    alignSelf: "center",
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: "bold",
    color: Colors.white,
    textAlign: "center",
    lineHeight: 40,
  },
  bottomCurve: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    paddingVertical: Spacing.xxl,
    alignItems: "center",
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: BorderRadius.circle,
  },
  buttonText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: "bold",
  },
});

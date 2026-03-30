import { router } from "expo-router";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Collapsible from "react-native-collapsible";
import { AntDesign, Feather } from "@expo/vector-icons";
import WebContainer from "@/components/layout/WebContainer";
import {
  Colors,
  FontSizes,
  Spacing,
  BorderRadius,
} from "@/lib/constants/theme";

export default function Sobre() {
  const [collapsed1, setCollapsed1] = useState(true);
  const [collapsed2, setCollapsed2] = useState(true);

  const handlePress = () => router.replace("/termoParticipacao");

  return (
    <WebContainer scroll contentStyle={styles.container} size="sm">
      {/* Acordeon 1 */}
      <View style={styles.accordion}>
        <TouchableOpacity
          onPress={() => setCollapsed1(!collapsed1)}
          style={styles.header}
        >
          <View style={styles.headerLeft}>
            <Feather name="info" size={22} color={Colors.textSecondary} />
            <Text style={styles.headerText}>O que é</Text>
          </View>
          <AntDesign
            name={collapsed1 ? "down" : "up"}
            size={22}
            color={Colors.textSecondary}
          />
        </TouchableOpacity>

        <Collapsible collapsed={collapsed1}>
          <View style={styles.content}>
            <Text style={styles.contentText}>
              Esta aplicação tem como objetivo auxiliar os usuários na gestão do
              bem-estar físico e mental, fornecendo ferramentas e registros
              personalizados.
            </Text>
          </View>
        </Collapsible>
      </View>

      {/* Acordeon 2 */}
      <View style={styles.accordion}>
        <TouchableOpacity
          onPress={() => setCollapsed2(!collapsed2)}
          style={styles.header}
        >
          <View style={styles.headerLeft}>
            <Feather
              name="bar-chart-2"
              size={22}
              color={Colors.textSecondary}
            />
            <Text style={styles.headerText}>Por que utilizá-lo</Text>
          </View>
          <AntDesign
            name={collapsed2 ? "down" : "up"}
            size={22}
            color={Colors.textSecondary}
          />
        </TouchableOpacity>

        <Collapsible collapsed={collapsed2}>
          <View style={styles.content}>
            <Text style={styles.contentText}>
              Utilizar esta aplicação permite um acompanhamento mais eficiente
              dos hábitos de saúde, ajudando a identificar padrões e promover
              melhorias no estilo de vida.
            </Text>
          </View>
        </Collapsible>
      </View>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>Próximo</Text>
        </TouchableOpacity>
      </View>
    </WebContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: Spacing.md,
    flexGrow: 1,
    justifyContent: "center",
  },
  accordion: {
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
  },
  header: {
    backgroundColor: "rgba(113, 137, 188, 0.15)",
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerText: {
    fontSize: 17,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  content: {
    backgroundColor: "rgba(113, 137, 188, 0.1)",
    padding: Spacing.md,
    borderBottomLeftRadius: BorderRadius.md,
    borderBottomRightRadius: BorderRadius.md,
    marginTop: Spacing.xs,
  },
  contentText: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  buttonWrapper: {
    alignItems: "center",
    marginTop: Spacing.xl,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: BorderRadius.pill,
    alignItems: "center",
    paddingHorizontal: 40,
  },
  buttonText: {
    color: Colors.white,
    fontSize: FontSizes.md,
    fontWeight: "bold",
  },
});

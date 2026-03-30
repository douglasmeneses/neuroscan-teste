import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Colors } from "@/lib/constants/theme";

export function TopLoading({ visible }: { readonly visible: boolean }) {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 25,
    left: 0,
    right: 0,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    zIndex: 999,
  },
});

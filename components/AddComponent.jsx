import { StyleSheet, Platform } from "react-native";
import { FAB } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function AddComponent({ onOpen, style }) {
  const insets = useSafeAreaInsets();
  const bottomInset = Platform.select({
    ios: Math.max(insets.bottom, 24) + 12,
    android: Math.max(insets.bottom, 16) + 18,
    web: 24,
    default: Math.max(insets.bottom, 16) + 16,
  });

  return (
    <FAB
      color="white"
      icon="plus"
      style={[
        styles.fab,
        { bottom: bottomInset },
        style,
      ]}
      onPress={() => onOpen()}
    />
  );
}

const styles = StyleSheet.create({
  fab: {
    backgroundColor: "#00ACE8",
    position: "absolute",
    marginRight: 16,
    right: 0,
    zIndex: 99,
    elevation: 6,
  },
});

export default AddComponent;

import { StyleSheet } from "react-native";
import { FAB } from "react-native-paper";

function AddComponent({ onOpen }) {
  return (
    <>
      <FAB
        color="white"
        icon="plus"
        style={styles.fab}
        onPress={() => onOpen()}
      />
    </>
  );
}
const styles = StyleSheet.create({
  fab: {
    backgroundColor: "#00ACE8",
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
export default AddComponent;

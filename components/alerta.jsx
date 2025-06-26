import React from "react";
import { Text, Dialog } from "react-native-paper";
import { ScrollView, StyleSheet, Platform } from "react-native";

export function AlertaIcono(props) {
  return (
    <Dialog
      visible={props.onOpen}
      onDismiss={props.onClose}
      style={styles.dialogContainer} // Estilo para el modal
    >
      <Dialog.Icon icon={props.icon} />
      <Dialog.Title>{props.title}</Dialog.Title>
      <Dialog.Content>
        <Text variant="bodyMedium">{props.text}</Text>
      </Dialog.Content>
      <Dialog.Actions>{props.actions}</Dialog.Actions>
    </Dialog>
  );
}

export function AlertaScroll(props) {
  return (
    <Dialog
      visible={props.onOpen}
      onDismiss={props.onClose}
      style={styles.dialogContainer} // Estilo para el modal
    >
      <Dialog.Title>{props.title}</Dialog.Title>
      <Dialog.ScrollArea>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {props.content}
        </ScrollView>
      </Dialog.ScrollArea>
      <Dialog.Actions>{props.actions}</Dialog.Actions>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  dialogContainer: {
    alignSelf: "center",
    width: Platform.OS === "web" ? "85vw" : "90%", // vw se adapta al viewport
    maxWidth: Platform.OS === "web" ? "min(600px, 90vw)" : 600,
    maxHeight: Platform.OS === "web" ? "80vh" : "80%", // vh se adapta al viewport
    borderRadius: 8,
    margin: Platform.OS === "web" ? "2vh 5vw" : 20,
  },
  scrollContent: {
    paddingHorizontal: Platform.OS === "web" ? "4vw" : 24,
    paddingVertical: 8,
  },
});

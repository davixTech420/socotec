import React from "react";
import { Text, Dialog } from "react-native-paper";
import { ScrollView, StyleSheet, Platform, View } from "react-native";

export function AlertaIcono(props) {
  return (
    <Dialog
      visible={props.onOpen}
      onDismiss={props.onClose}
      style={styles.dialogContainer}
    >
      <Dialog.Icon icon={props.icon} color="#00ACE8" size={36} />
      <Dialog.Title style={styles.dialogTitle}>{props.title}</Dialog.Title>
      <Dialog.Content>
        <Text variant="bodyMedium" style={styles.dialogText}>{props.text}</Text>
      </Dialog.Content>
      <Dialog.Actions style={styles.dialogActions}>{props.actions}</Dialog.Actions>
    </Dialog>
  );
}

export function AlertaScroll(props) {
  return (
    <Dialog
      visible={props.onOpen}
      onDismiss={props.onClose}
      style={styles.dialogContainer}
    >
      <Dialog.Title style={styles.dialogTitle}>{props.title}</Dialog.Title>
      <Dialog.ScrollArea style={styles.scrollArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {props.content}
        </ScrollView>
      </Dialog.ScrollArea>
      <Dialog.Actions style={styles.dialogActions}>{props.actions}</Dialog.Actions>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  dialogContainer: {
    alignSelf: "center",
    width: Platform.OS === "web" ? "88vw" : "92%",
    maxWidth: Platform.OS === "web" ? 560 : 500,
    maxHeight: Platform.OS === "web" ? "85vh" : "85%",
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 28,
    elevation: 10,
    borderWidth: 1,
    borderColor: "rgba(226, 232, 240, 0.9)",
    marginVertical: Platform.OS === "web" ? "2vh" : 20,
    marginHorizontal: Platform.OS === "web" ? "auto" : 0,
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    paddingBottom: 4,
  },
  dialogText: {
    color: "#475569",
    fontSize: 14,
    lineHeight: 20,
  },
  scrollArea: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 0,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  dialogActions: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 8,
    gap: 8,
  },
});

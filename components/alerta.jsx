/* import React from 'react';
import { Text, Dialog, Button } from 'react-native-paper';
import { ScrollView } from 'react-native';

export function AlertaIcono(props) {
  return (
    <Dialog visible={props.onOpen} onDismiss={props.onClose} >
      <Dialog.Icon icon={props.icon} />
      <Dialog.Title >{props.title}</Dialog.Title>
      <Dialog.Content>
        <Text variant="bodyMedium">{props.text}</Text>
      </Dialog.Content>
      <Dialog.Actions>
        {props.actions}
      </Dialog.Actions>
    </Dialog>
  )
}

export function AlertaScroll(props) {
  return (
    <Dialog visible={props.onOpen} onDismiss={props.onClose} >
      <Dialog.Title >{props.title}</Dialog.Title>
      <Dialog.ScrollArea>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 24 }}>
          {props.content}
        </ScrollView>
      </Dialog.ScrollArea>
      <Dialog.Actions>
        {props.actions}
      </Dialog.Actions>
    </Dialog>
  )
}
 */
import React from 'react';
import { Text, Dialog, Button } from 'react-native-paper';
import { ScrollView, Dimensions, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';

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
      <Dialog.Actions>
        {props.actions}
      </Dialog.Actions>
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
          showsVerticalScrollIndicator={false} // Oculta la barra de scroll
        >
          {props.content}
        </ScrollView>
      </Dialog.ScrollArea>
      <Dialog.Actions>
        {props.actions}
      </Dialog.Actions>
    </Dialog>
  );
}

// Estilos para hacer el modal responsive
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  dialogContainer: {
    alignSelf: 'center', // Centra el modal horizontalmente
    width: Dimensions.get('window').width > 600 ? '60%' : '90%', // Ancho adaptable
    maxWidth: 600, // Ancho máximo para web
    maxHeight: windowHeight * 0.8, // Altura máxima (80% de la pantalla)
    borderRadius: 8, // Bordes redondeados
    marginVertical: 20, // Margen vertical para evitar que toque los bordes
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
});
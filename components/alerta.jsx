import React from 'react';
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

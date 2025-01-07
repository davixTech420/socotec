import React from 'react';
import { Text,Dialog,Button } from 'react-native-paper';	

export function AlertaIcono(props) {
  return (
  
      <Dialog  visible={props.onOpen} onDismiss={props.onClose} >
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

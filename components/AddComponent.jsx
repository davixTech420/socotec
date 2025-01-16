import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text,Modal,Button,Portal,FAB } from 'react-native-paper';

function AddComponent() {
  return (
    <>
    <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        />
    <Portal>
    <Modal 
      visible={modalVisible} 
      onDismiss={() => setModalVisible(false)} 
      contentContainerStyle={styles.modalContent}
    >
      <Text style={styles.modalTitle}>Agregar Nuevo Producto</Text>
      <Button 
        mode="contained" 
        onPress={() => setModalVisible(false)} 
        style={styles.modalButton}
      >
        Guardar
      </Button>
    </Modal>
    </Portal> 
    </>
  )
}


const styles = StyleSheet.create({
fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalButton: {
    marginTop: 16,
  }
});

export default AddComponent;

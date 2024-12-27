import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import tablaComponent from '../../components/tablaComponent';

const prueba = () => {
  const data = [
    { id: 1, name: 'John Doe', age: 25, email: 'john.doe@example.com' },
    { id: 2, name: 'Jane Doe', age: 30, email: 'jane.doe@example.com' },
    { id: 3, name: 'Bob Smith', age: 35, email: 'bob.smith@example.com' },
    { id: 4, name: 'Alice Johnson', age: 28, email: 'alice.johnson@example.com' },
    { id: 5, name: 'Charlie Brown', age: 40, email: 'charlie.brown@example.com' },
  ];

  const columns = [
    { key: 'id', title: 'ID' },
    { key: 'name', title: 'Nombre' },
    { key: 'age', title: 'Edad' },
    { key: 'email', title: 'Email' },
  ];

 /*  const handleGenerateReport = () => {
    console.log('Generando reporte...');
    // Implementa la lógica de generación de reporte aquí
  }; */

  return (
    <PaperProvider>
      <SafeAreaView style={styles.container}>
        <tablaComponent
          data={data}
          columns={columns}
          searchKeys={['name', 'email']}
          perPage={3}
          /* onGenerateReport={handleGenerateReport} */
        />
      </SafeAreaView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default prueba;


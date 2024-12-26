import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Picker } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const calculator = () => {
  const [valor1, setValor1] = useState('');
  const [valor2, setValor2] = useState('');
  const [operacion, setOperacion] = useState('');
  const [resultado, setResultado] = useState('');

  const handleValor1 = (text) => {
    setValor1(text);
  };

  const handleValor2 = (text) => {
    setValor2(text);
  };

  const handleOperacion = (itemValue) => {
    setOperacion(itemValue);
  };

  const calcular = () => {
    if (valor1 && valor2 && operacion) {
      let resultadoCalculo;
      switch (operacion) {
        case 'suma':
          resultadoCalculo = parseFloat(valor1) + parseFloat(valor2);
          break;
        case 'resta':
          resultadoCalculo = parseFloat(valor1) - parseFloat(valor2);
          break;
        case 'multiplicacion':
          resultadoCalculo = parseFloat(valor1) * parseFloat(valor2);
          break;
        case 'division':
          resultadoCalculo = parseFloat(valor1) / parseFloat(valor2);
          break;
        default:
          resultadoCalculo = 'Operación no válida';
      }
      setResultado(resultadoCalculo.toString());
    } else {
      setResultado('Por favor, ingrese todos los valores');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Calculadora</Text>
      <View style={styles.formulario}>
        <TextInput
          style={styles.input}
          placeholder="Valor 1"
          keyboardType="numeric"
          value={valor1}
          onChangeText={handleValor1}
        />
        <Picker
          selectedValue={operacion}
          style={styles.picker}
          onValueChange={handleOperacion}
        >
          <Picker.Item label="Seleccione una operación" value="" />
          <Picker.Item label="Suma" value="suma" />
          <Picker.Item label="Resta" value="resta" />
          <Picker.Item label="Multiplicación" value="multiplicacion" />
          <Picker.Item label="División" value="division" />
        </Picker>
        <TextInput
          style={styles.input}
          placeholder="Valor 2"
          keyboardType="numeric"
          value={valor2}
          onChangeText={handleValor2}
        />
      </View>
      <TouchableOpacity style={styles.boton} onPress={calcular}>
        <AntDesign name="calculator" size={24} color="#fff" />
        <Text style={styles.textoBoton}>Calcular</Text>
      </TouchableOpacity>
      <Text style={styles.resultado}>{resultado}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  formulario: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  picker: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
  },
  boton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  textoBoton: {
    fontSize: 18,
    color: '#fff',
  },
  resultado: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
  },
});

export default calculator;
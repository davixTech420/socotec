import React from 'react';
import { View } from 'react-native';
import ExcelApique from '@/components/ExcelApique';

const App = () => {
  const sampleData = {
    albaranNum: "34",
    anchoApique: "12.3",
    cliente: "asdsadsada",
    createdAt: "2025-05-16T19:32:40.399Z",
    estado: true,
    fechaEjecucionFinal: "2025-06-05",
    fechaEjecucionInicio: "2025-06-05",
    fechaEmision: "2025-06-05",
    id: 5,
    imagenes: [{uri: 'image1.jpg'}, {uri: 'image2.jpg'}],
    informeNum: "23",
    largoApique: "12.3",
    localizacion: "asdasd",
    observaciones: "dsadsadsa",
    operario: "sadasdasd",
    profundidadApique: "45.2",
    tipo: "asdsadasd",
    tituloObra: "asdasd",
    updatedAt: "2025-05-16T19:32:40.399Z"
  };

  const handleGeneration = (success) => {
    if (success) {
      console.log('Excel generado con éxito');
    } else {
      console.log('Error al generar Excel');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <ExcelApique
        data={sampleData} 
        onGenerate={handleGeneration} 
      />
    </View>
  );
};

export default App;
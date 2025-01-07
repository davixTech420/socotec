import React, { useState, useEffect } from 'react';
import { View,  StyleSheet,Text,TouchableOpacity,Button } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import TablaComponente from "../../components/tablaComponent";
import {AntDesign,MaterialCommunityIcons} from '@expo/vector-icons';
const data = [
  { id: 1, nombre: 'Juan', edad: 30, ciudad: 'Madrid' },
  { id: 2, nombre: 'María', edad: 25, ciudad: 'Barcelona' },
  { id: 3, nombre: 'Pedro', edad: 35, ciudad: 'Sevilla' },
  { id: 4, nombre: 'Ana', edad: 28, ciudad: 'Valencia' },
  { id: 5, nombre: 'Luis', edad: 40, ciudad: 'Bilbao' },
  { id: 2, nombre: 'María', edad: 25, ciudad: 'Barcelona' },
  { id: 3, nombre: 'Pedro', edad: 35, ciudad: 'Sevilla' },
  { id: 4, nombre: 'Ana', edad: 28, ciudad: 'Valencia' },
  { id: 5, nombre: 'Luis', edad: 40, ciudad: 'Bilbao' },
];
const columns = [
  { key: 'id', title: 'ID', sortable: true, width: 50 },
  { key: 'nombre', title: 'Nombre', sortable: true },
  { key: 'edad', title: 'Edad', sortable: true, width: 80 },
  { key: 'ciudad', title: 'Ciudad', sortable: true },
];

const inventario = () => {
  return (
    <View style={styles.container}>
      <View style={{ h:"auto"}}>
        <View style={{ flex: 1, padding: 5,direction:"collumn",justifyContent:'space-around',flexDirection:"row",backgroundColor:"white",marginInline:7
         }}>
           <Text>Inventario</Text>
           <TouchableOpacity>
            <Text>Agregar</Text>
          </TouchableOpacity>
          <AntDesign name="pdffile1" size={30} color="red" />
          <MaterialCommunityIcons name="file-excel" size={30} color="green" />
         
        
        </View>
      </View>
      <PaperProvider theme={{ dark: false, mode: 'exact' }}>
      <View style={{ flex: 1, padding: 16 }}>
      <TablaComponente
          data={data}
          columns={columns}
          keyExtractor={(item) => item.id.toString()}
          onSort={(key, order) => console.log('Ordenando por:', key, order)}
          onSearch={(query) => console.log('Buscando:', query)}
          onFilter={(filters) => console.log('Filtrando:', filters)}
        />
       </View>
        </PaperProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default inventario;
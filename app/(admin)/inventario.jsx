import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions, Platform } from 'react-native';
import { PaperProvider, Text, Card, Button, FAB, Portal, Modal, ProgressBar, useTheme } from 'react-native-paper';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import TablaComponente from "@/components/tablaComponent";
import Breadcrumb from "@/components/BreadcrumbComponent";
import{ router } from "expo-router";

const data = [
  { id: 1, producto: 'Laptop', cantidad: 50, precio: 999.9, categoria: 'Electrónicos' },
  { id: 2, producto: 'Smartphone', cantidad: 100, precio: 599.9, categoria: 'Electrónicos' },
  { id: 3, producto: 'Auriculares', cantidad: 200, precio: 99.9, categoria: 'Accesorios' },
  { id: 4, producto: 'Monitor', cantidad: 30, precio: 299.9, categoria: 'Electrónicos' },
  { id: 5, producto: 'Teclado', cantidad: 80, precio: 49.9, categoria: 'Accesorios' },
];

const columns = [
  { key: 'id', title: 'ID', sortable: true, width: 50 },
  { key: 'producto', title: 'Producto', sortable: true },
  { key: 'cantidad', title: 'Cantidad', sortable: true, width: 80 },
  { key: 'precio', title: 'Precio', sortable: true, width: 100 },
  { key: 'categoria', title: 'Categoría', sortable: true },
];

const Inventario = () => {
  const theme = useTheme();
  const { width } = useWindowDimensions();



  const handleSort = (key, order) => {
    console.log('Ordenando por:', key, order);
  };

  const handleSearch = (query) => {
    console.log('Buscando:', query);
  };

  const handleFilter = (filters) => {
    console.log('Filtrando:', filters);
  };

  // Calculamos los totales usando parseInt y toFixed para evitar problemas de precisión
  const totalItems = data.reduce((sum, item) => sum + parseInt(String(item.cantidad), 10), 0);
  const totalValue = data.reduce((sum, item) => {
    const itemTotal = parseInt(String(item.cantidad), 10) * parseFloat(item.precio.toFixed(2));
    return sum + itemTotal;
  }, 0);

  // Calculamos los progress con valores seguros
  const calculateProgress = (value, max) => {
    const progress = Math.min(Math.max(value / max, 0), 1);
    return parseFloat(progress.toFixed(2));
  };

  const itemsProgress = calculateProgress(totalItems, 1000);
  const valueProgress = calculateProgress(totalValue, 100000);

  const isSmallScreen = width < 600;

  return (
    <PaperProvider theme={theme}>
      <ScrollView style={styles.container}>


    
        <View style={styles.header}>
        <Breadcrumb
        items={[
          {
            label: 'Dashboard',
            onPress: () => router.navigate('/(admin)/Dashboard'),
          },
          {
            label: 'Inventario'
          }
        ]}
      />
          <View style={styles.headerActions}>
            <AntDesign name="pdffile1" size={24} color={theme.colors.primary} style={styles.icon} />
            <MaterialCommunityIcons name="file-excel" size={24} color={theme.colors.primary} style={styles.icon} />
          </View>
        </View>
        <View style={[styles.cardContainer, isSmallScreen && styles.cardContainerSmall]}>
          <Card style={[styles.card, isSmallScreen && styles.cardSmall]}>
            <Card.Content>
              <Text style={styles.cardTitle}>Total de Productos</Text>
              <Text style={styles.cardValue}>{totalItems}</Text>
              <ProgressBar
                progress={itemsProgress}
                color={theme.colors.primary}
                style={styles.progressBar}
              />
            </Card.Content>
          </Card>
          <Card style={[styles.card, isSmallScreen && styles.cardSmall]}>
            <Card.Content>
              <Text style={styles.cardTitle}>Valor del Inventario</Text>
              <Text style={styles.cardValue}>${totalValue.toFixed(2)}</Text>
              <ProgressBar
                progress={valueProgress}
                color={theme.colors.secondary}
                style={styles.progressBar}
              />
            </Card.Content>
          </Card>
        </View>

        <Card style={styles.tableCard}>
          <Card.Content>
            <TablaComponente
              data={data}
              columns={columns}
              keyExtractor={(item) => String(item.id)}
              onSort={handleSort}
              onSearch={handleSearch}
              onFilter={handleFilter}
            />
          </Card.Content>
        </Card>

        
      </ScrollView>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerActions: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 16,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  cardContainerSmall: {
    flexDirection: 'column',
  },
  card: {
    width: '48%',
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardSmall: {
    width: '100%',
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  tableCard: {
    margin: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 4,
      },
    }),
  },  
});

export default Inventario;


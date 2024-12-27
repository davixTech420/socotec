import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const indexAdmin = () => {
  const [data, setData] = useState({
    title: 'Bienvenido',
    subtitle: 'Estadísticas generales',
    stats: [
      { label: 'Usuarios', value: 100, color: '#4CAF50' },
      { label: 'Ventas', value: 500, color: '#FF9800' },
      { label: 'Ingresos', value: 1000, color: '#2196F3' },
    ],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.subtitle}>{data.subtitle}</Text>
      </View>
      <View style={styles.statsContainer}>
        {data.stats.map((stat, index) => (
          <View key={index} style={[styles.stat, { backgroundColor: stat.color }]}>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
          </View>
        ))}
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <AntDesign name="plus" size={24} color="#fff" />
          <Text style={styles.actionText}>Agregar nuevo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <AntDesign name="edit" size={24} color="#fff" />
          <Text style={styles.actionText}>Editar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  header: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
  statsContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  stat: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 18,
    color: '#fff',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  actionText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default indexAdmin;
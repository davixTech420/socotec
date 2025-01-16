import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type BreadcrumbItem = {
  label: string;
  onPress?: () => void;
};

type BreadcrumbProps = {
  items: BreadcrumbItem[];
};

// Asegúrate de usar export default aquí
const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          {index > 0 && <Text style={styles.separator}>{'>'}</Text>}
          <TouchableOpacity
            onPress={item.onPress}
            disabled={!item.onPress}
          >
            <Text style={[
              styles.text,
              !item.onPress && styles.lastItem,
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    color: '#0066cc',
  },
  lastItem: {
    color: '#666666',
  },
  separator: {
    marginHorizontal: 8,
    color: '#666666',
  },
});

// Asegúrate de exportar el componente como default
export default Breadcrumb;


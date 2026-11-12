import React from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const DropdownComponent = ({ options, onSelect, placeholder, value, label }) => {
  const renderItem = (item) => (
    <Picker.Item key={item.value} label={item.label} value={item.value} />
  );

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.pickerWrapper}>
        <Picker
          style={styles.picker}
          selectedValue={value}
          onValueChange={onSelect}
          dropdownIconColor="#00ACE8"
        >
          {placeholder ? <Picker.Item label={placeholder} value="" color="#94A3B8" /> : null}
          {options.map(renderItem)}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
    marginLeft: 2,
  },
  pickerWrapper: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    overflow: 'hidden',
    justifyContent: 'center',
    height: 48,
  },
  picker: {
    width: '100%',
    height: 48,
    color: '#0F172A',
    backgroundColor: 'transparent',
    borderWidth: 0,
    fontSize: 14,
    ...(Platform.OS === 'web' && {
      paddingHorizontal: 12,
      outlineStyle: 'none',
      cursor: 'pointer',
    }),
  },
});

export default DropdownComponent;
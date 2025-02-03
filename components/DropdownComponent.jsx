import React from 'react';
import { Picker } from '@react-native-picker/picker';

const DropdownComponent = ({ options, onSelect, placeholder, value }) => {
  const renderItem = (item) => (
    <Picker.Item key={item.value} label={item.label} value={item.value} />
  );
  return (
    <Picker
      style={{ width: '100%' }}
      selectedValue={value}  // Usamos el valor pasado como prop
      onValueChange={onSelect}
    >
      <Picker.Item label={placeholder} value="" />
      {options.map(renderItem)}
    </Picker>
  );
};
export default DropdownComponent;
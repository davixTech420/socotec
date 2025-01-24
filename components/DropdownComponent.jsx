import React, { useState, useRef } from 'react';
import { View, Text } from 'react-native';
import { Menu, Divider,Button } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

const DropdownComponent = ({ options, onSelect, placeholder }) => {
  const [visible, setVisible] = useState(false);
const pickerRef = useRef(null);
  const renderItem = (item) => (
    <Picker.Item label={item.label} value={item.value} />
  );

  return (
      <Picker
      ref={pickerRef}
      style={{ width: '100%' }}
      selectedValue={options.value}
      onValueChange={(itemValue) => {
        setVisible(false);
        onSelect(itemValue);
      }}
      >
        {options.map(renderItem)}
      </Picker>
  );
};

export default DropdownComponent;
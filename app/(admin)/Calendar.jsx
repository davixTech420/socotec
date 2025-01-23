import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Provider as PaperProvider, Dialog, TextInput, Button } from 'react-native-paper';

const CalendarComponent = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [permissions, setPermissions] = useState([
    { date: '2023-02-15', name: 'Juan Pérez' },
    { date: '2023-02-20', name: 'María García' },
    { date: '2023-02-22', name: 'Luis Hernández' },
    { date: '2023-02-25', name: 'Ana Rodríguez' },
  ]);
  const [name, setName] = useState('');

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setShowForm(true);
  };

  const handleFormSubmit = () => {
    console.log(name);
    setShowForm(false);
  };

  return (
    <PaperProvider>
      <View>
        <Calendar
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          markingType={'custom'}
          markedDates={{
            '2023-02-15': { custom: { name: 'Juan Pérez', color: '#007bff' } },
            '2023-02-20': { custom: { name: 'María García', color: '#ff69b4' } },
            '2023-02-22': { custom: { name: 'Luis Hernández', color: '#33cc33' } },
            '2023-02-25': { custom: { name: 'Ana Rodríguez', color: '#6666cc' } },
          }}
          theme={{
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#007bff',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#007bff',
            dayTextColor: '#2d4150',
            textDisabledColor: '#d3d3d3',
            dotColor: '#007bff',
            selectedDotColor: '#ffffff',
            arrowColor: '#007bff',
            disabledArrowColor: '#d3d3d3',
            monthTextColor: '#007bff',
            indicatorColor: '#007bff',
            textDayFontFamily: 'monospace',
            textMonthFontFamily: 'monospace',
            textDayHeaderFontFamily: 'monospace',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: 'bold',
            textDayFontWeight: 'normal',
            textMonthFontSize: 16,
            textDayFontSize: 16,
            textDayHeaderFontSize: 16,
          }}
          style={{
            borderWidth: 1,
            borderColor: '#dddddd',
            borderRadius: 0,
          }}
        />
        <Dialog visible={showForm} onDismiss={() => setShowForm(false)}>
          <Dialog.Title>Solicitud de permiso</Dialog.Title>
          <Dialog.Content>
            <Text>Fecha: {selectedDate}</Text>
            <TextInput
              label="Nombre"
              value={name}
              onChangeText={(text) => setName(text)}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowForm(false)}>Cancelar</Button>
            <Button onPress={handleFormSubmit}>Enviar</Button>
          </Dialog.Actions>
        </Dialog>
      </View>
    </PaperProvider>
  );
};

export default CalendarComponent;
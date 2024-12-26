import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Agenda } from 'react-native-calendars';

const calendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [agenda, setAgenda] = useState({});

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleAgendaSelect = (date) => {
    const agendaItem = agenda[date];
    if (agendaItem) {
      console.log(`Agenda item selected: ${agendaItem}`);
    }
  };

  const renderAgenda = () => {
    const agendaItems = Object.keys(agenda).map((date) => {
      const item = agenda[date];
      return (
        <View key={date} style={styles.agendaItem}>
          <Text style={styles.agendaItemText}>{date}</Text>
          <Text style={styles.agendaItemText}>{item}</Text>
        </View>
      );
    });
    return agendaItems;
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day) => handleDateSelect(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true },
        }}
      />
      <Agenda
        items={agenda}
        selectedDate={selectedDate}
        onDayPress={(day) => handleAgendaSelect(day.dateString)}
        renderItem={(item, firstItemInDay) => (
          <View style={styles.agendaItem}>
            <Text style={styles.agendaItemText}>{item.name}</Text>
            <Text style={styles.agendaItemText}>{item.description}</Text>
          </View>
        )}
      />
      {selectedDate && (
        <View style={styles.agendaContainer}>
          <Text style={styles.agendaTitle}>Agenda para {selectedDate}</Text>
          {renderAgenda()}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  calendar: {
    height: 300,
  },
  agenda: {
    flex: 1,
    backgroundColor: '#fff',
  },
  agendaItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  agendaItemText: {
    fontSize: 16,
    color: '#333',
  },
  agendaContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  agendaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
});

export default calendar;
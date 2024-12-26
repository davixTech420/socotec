import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Searchbar, Button } from 'react-native-paper';
import { DataTable } from 'react-native-paper';

const data = [
  { id: 1, name: 'John Doe', age: 25, email: 'john.doe@example.com' },
  { id: 2, name: 'Jane Doe', age: 30, email: 'jane.doe@example.com' },
  { id: 3, name: 'Bob Smith', age: 35, email: 'bob.smith@example.com' },
];

const reportes = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(Math.ceil(data.length / perPage));
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    const filteredData = data.filter((item) => {
      return item.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
    setFilteredData(filteredData);
  }, [searchQuery]);

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleGenerateReport = () => {
    // Aquí puedes agregar la lógica para generar el reporte
    console.log('Generando reporte...');
  };

  const renderTable = () => {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return (
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>ID</DataTable.Title>
          <DataTable.Title>Nombre</DataTable.Title>
          <DataTable.Title>Edad</DataTable.Title>
          <DataTable.Title>Email</DataTable.Title>
        </DataTable.Header>
        {paginatedData.map((row, index) => (
          <DataTable.Row key={index}>
            <DataTable.Cell>{row.id}</DataTable.Cell>
            <DataTable.Cell>{row.name}</DataTable.Cell>
            <DataTable.Cell>{row.age}</DataTable.Cell>
            <DataTable.Cell>{row.email}</DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
      
    );
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar"
        value={searchQuery}
        onChangeText={(query) => handleSearch(query)}
      />
      {renderTable()}
      <DataTable.Pagination
        page={page}
        numberOfPages={totalPages}
        onPageChange={(page) => handlePageChange(page)}
        label={`Página ${page} de ${totalPages}`}
      />
      <Button mode="contained" onPress={handleGenerateReport}>
        Generar Reporte
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default reportes;
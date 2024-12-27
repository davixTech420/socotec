/* import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Searchbar, Button } from 'react-native-paper';
import { DataTable } from 'react-native-paper';

const data = [
  { id: 1, name: 'John Doe', age: 25, email: 'john.doe@example.com' },
  { id: 2, name: 'Jane Doe', age: 30, email: 'jane.doe@example.com' },
  { id: 3, name: 'Bob Smith', age: 35, email: 'bob.smith@example.com' },
];

const tablaComponent = (data,header) => {
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
console.log(data,header);
    return (
      <DataTable>
        <DataTable.Header>
          
          {header.map((item,index) =>
          
            <DataTable.Title>{item}</DataTable.Title>
          )}
        
          
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

export default tablaComponent; */
import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Searchbar, Button, DataTable, Text } from 'react-native-paper';

interface TableColumn {
  key: string;
  title: string;
}

interface TableProps {
  data: any[];
  columns: TableColumn[];
  searchKeys?: string[];
  perPage?: number;
  showSearch?: boolean;
  showPagination?: boolean;
  showReportButton?: boolean;
  /* onGenerateReport?: () => void; */
}

const tablaComponent: React.FC<TableProps> = ({
  data,
  columns,
  searchKeys = [],
  perPage = 10,
  showSearch = true,
  showPagination = true,
  showReportButton = true,
/*   onGenerateReport, */
}) => {
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(Math.ceil(data.length / perPage));
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredData, setFilteredData] = useState<any[]>(data);

  useEffect(() => {
    const filtered = data.filter((item) =>
      searchKeys.some((key) =>
        item[key].toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    setFilteredData(filtered);
    setTotalPages(Math.ceil(filtered.length / perPage));
    setPage(0);
  }, [searchQuery, data, searchKeys, perPage]);

  const from = page * perPage;
  const to = Math.min((page + 1) * perPage, filteredData.length);

  const handlePageChange = (page: number) => setPage(page);

  const handleSearch = (query: string) => setSearchQuery(query);

  const renderTable = () => {
    const paginatedData = filteredData.slice(from, to);

    return (
      <ScrollView horizontal>
        <DataTable>
          <DataTable.Header>
            {columns.map((column) => (
              <DataTable.Title key={column.key}>{column.title}</DataTable.Title>
            ))}
          </DataTable.Header>
          {paginatedData.map((row, index) => (
            <DataTable.Row key={index}>
              {columns.map((column) => (
                <DataTable.Cell key={column.key}>{row[column.key]}</DataTable.Cell>
              ))}
            </DataTable.Row>
          ))}
        </DataTable>
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {showSearch && (
        <Searchbar
          placeholder="Buscar"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
      )}
      {filteredData.length > 0 ? (
        renderTable()
      ) : (
        <Text style={styles.noDataText}>No se encontraron datos</Text>
      )}
      {showPagination && (
        <DataTable.Pagination
          page={page}
          numberOfPages={totalPages}
          onPageChange={handlePageChange}
          label={`${from + 1}-${to} de ${filteredData.length}`}
          showFastPaginationControls
          numberOfItemsPerPage={perPage}
          selectPageDropdownLabel={'Filas por página'}
        />
      )}
      {showReportButton && (
        <Button mode="contained" /* onPress={onGenerateReport} */ style={styles.reportButton}>
          Generar Reporte
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    marginBottom: 16,
  },
  reportButton: {
    marginTop: 16,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default tablaComponent;


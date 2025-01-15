import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import {
  DataTable,
  Text,
  Searchbar,
  Button,
  Chip,
  ActivityIndicator,
  Menu,
  Divider,
  IconButton,
  useTheme,
} from 'react-native-paper';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';
import { MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';

const TablaComponente = ({
  data,
  columns,
  keyExtractor,
  onSort,
  onSearch,
  onFilter,
  isLoading = false,
  error,
  itemsPerPageOptions = [5, 10, 20, 50],
  defaultItemsPerPage = 10,
}) => {
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('ascending');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);

  const handleSort = useCallback((key) => {
    const isAsc = sortBy === key && sortOrder === 'ascending';
    setSortOrder(isAsc ? 'descending' : 'ascending');
    setSortBy(key);
    if (onSort) {
      onSort(key, isAsc ? 'descending' : 'ascending');
    }
  }, [sortBy, sortOrder, onSort]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setPage(0);
    if (onSearch) {
      onSearch(query);
    }
  }, [onSearch]);

  const handleFilter = useCallback((key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setPage(0);
    if (onFilter) {
      onFilter(newFilters);
    }
  }, [filters, onFilter]);

  const filteredData = useMemo(() => {
    return data.filter(item =>
      Object.entries(item).some(([key, value]) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [data, searchQuery]);

  const paginatedData = useMemo(() => {
    const startIndex = page * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, page, itemsPerPage]);

  const renderCell = useCallback((column, item) => {
    if (column.render) {
      return column.render(item[column.key], item);
    }
    return String(item[column.key]);
  }, []);

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <MaterialCommunityIcons name="alert-circle-outline" size={48} color="red" />
        <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
      </View>
    );
  }

  return (
    <Animated.View
      entering={FadeInUp}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.actions}>
        <Searchbar
          placeholder="Buscar..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
        <Menu
          visible={filterMenuVisible}
          onDismiss={() => setFilterMenuVisible(false)}
          anchor={
            <IconButton
              icon="filter-variant"
              onPress={() => setFilterMenuVisible(true)}
            />
          }
        >
          {columns.map(column => (
            <Menu.Item
              key={String(column.key)}
              onPress={() => {
                handleFilter(String(column.key), true);
                setFilterMenuVisible(false);
              }}
              title={column.title}
            />
          ))}
        </Menu>
      </View>

      <DataTable>
        <DataTable.Header style={styles.header}>
          {columns.map(column => (
            <DataTable.Title
              key={String(column.key)}
              sortDirection={sortBy === column.key ? sortOrder : undefined}
              onPress={() => column.sortable && handleSort(column.key)}
              style={{ width: column.width }}
            >
              <View style={styles.columnHeader}>
                <Text>{column.title}</Text>
                {column.sortable && (
                  <MaterialCommunityIcons
                    name={sortBy === column.key
                      ? (sortOrder === 'ascending' ? 'arrow-up' : 'arrow-down')
                      : 'arrow-up-down'
                    }
                    size={16}
                    color={theme.colors.onSurface}
                  />
                )}
              </View>
            </DataTable.Title>
          ))}
          <DataTable.Title>
            <View style={styles.columnHeader}>
              <Text></Text>
            </View>
          </DataTable.Title>
        </DataTable.Header>

        {isLoading ? (
          <ActivityIndicator style={styles.loading} size="large" />
        ) : (
          paginatedData.map((item, index) => (
            <Animated.View
              key={keyExtractor(item)}
              entering={FadeInUp.delay(index * 50)}
              layout={Layout.springify()}
            >
              <DataTable.Row>
                {columns.map(column => (
                  <DataTable.Cell
                    key={String(column.key)}
                    style={{ width: column.width }}
                  >
                    {renderCell(column, item)}
                  </DataTable.Cell>
                ))}
                <DataTable.Cell>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    <Button>
                      <MaterialCommunityIcons name="delete" size={20} color="#FF0000" />
                    </Button>
                    <Button>
                      <FontAwesome name="edit" size={20} color="#00ACE8" />
                    </Button>
                    <Button>
                      <MaterialCommunityIcons name="toggle-switch" size={20} color="black" />
                    </Button>
                  </View>
                </DataTable.Cell>
              </DataTable.Row>
            </Animated.View>
          ))
        )}
        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(filteredData.length / itemsPerPage)}
          onPageChange={setPage}
          label={`${page + 1} de ${Math.ceil(filteredData.length / itemsPerPage)}`}
          showFastPaginationControls
          numberOfItemsPerPageList={itemsPerPageOptions}
          numberOfItemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
          selectPageDropdownLabel={'Filas por página'}
        />
      </DataTable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    marginRight: 16,
  },
  header: {
    paddingHorizontal: 0,
  },
  columnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loading: {
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginTop: 8,
    textAlign: 'center',
  },
});

export default TablaComponente;


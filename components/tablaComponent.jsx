import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, Platform, ScrollView, useWindowDimensions } from 'react-native';
import {
  DataTable,
  Text,
  Searchbar,
  ActivityIndicator,
  Menu,
  IconButton,
  useTheme,
  Divider,
} from 'react-native-paper';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
  const { width } = useWindowDimensions();
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('ascending');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);

  const isSmallScreen = width < 768;

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
    let result = data.filter(item =>
      Object.entries(item).some(([key, value]) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

    if (sortBy) {
      result.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return sortOrder === 'ascending' ? -1 : 1;
        if (a[sortBy] > b[sortBy]) return sortOrder === 'ascending' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchQuery, sortBy, sortOrder]);

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
        <MaterialCommunityIcons name="alert-circle-outline" size={48} color={theme.colors.error} />
        <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
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
            iconColor="#5bfff3"
            inputStyle={{ color: "black" }}
          />
          <Menu
            visible={filterMenuVisible}
            onDismiss={() => setFilterMenuVisible(false)}
            anchor={
              <IconButton
                icon="filter-variant"
                onPress={() => setFilterMenuVisible(true)}
                color={theme.colors.primary}
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

        <View style={styles.tableWrapper}>
          <ScrollView horizontal={isSmallScreen}>
            <View style={styles.tableContainer}>
              <DataTable style={styles.table}>
                <DataTable.Header style={styles.header}>
                  {columns.map(column => (
                    <DataTable.Title
                      key={String(column.key)}
                      sortDirection={sortBy === column.key ? sortOrder : 'none'}
                      onPress={() => column.sortable && handleSort(column.key)}
                      style={[
                        styles.headerCell,
                        isSmallScreen ? { minWidth: column.width || 120 } : { flex: 1 }
                      ]}
                    >
                      <View style={styles.columnHeader}>
                        <Text style={styles.headerText}>{column.title}</Text>
                        {column.sortable && (
                          <MaterialCommunityIcons
                            name={sortBy === column.key
                              ? (sortOrder === 'ascending' ? 'arrow-up' : 'arrow-down')
                              : 'arrow-up-down'
                            }
                            size={16}
                            color="#00ACE8"
                          />
                        )}
                      </View>
                    </DataTable.Title>
                  ))}
                  <DataTable.Title
                    style={[
                      styles.headerCell,
                      isSmallScreen ? { minWidth: 120 } : { flex: 1 }
                    ]}
                  >
                    <Text style={styles.headerText}>Acciones</Text>
                  </DataTable.Title>
                </DataTable.Header>

                {isLoading ? (
                  <ActivityIndicator style={styles.loading} color={theme.colors.primary} size="large" />
                ) : (
                  paginatedData.map((item, index) => (
                    <Animated.View
                      key={keyExtractor(item)}
                      entering={FadeInUp.delay(index * 50)}
                      layout={Layout.springify()}
                    >
                      <DataTable.Row style={styles.row}>
                        {columns.map(column => (
                          <DataTable.Cell
                            key={String(column.key)}
                            style={[
                              styles.cell,
                              isSmallScreen ? { minWidth: column.width || 120 } : { flex: 1 }
                            ]}
                          >
                            <Text style={styles.cellText}>{renderCell(column, item)}</Text>
                          </DataTable.Cell>
                        ))}
                        <DataTable.Cell
                          style={[
                            styles.cell,
                            isSmallScreen ? { minWidth: 120 } : { flex: 1 }
                          ]}
                        >
                          <View style={styles.actionButtons}>
                            <IconButton
                              icon="delete-outline"
                              size={20}
                              iconColor='red'
                             
                              onPress={() => {/* Handle delete */ }}
                            />
                            <IconButton
                              icon="pencil-outline"
                              size={20}
                               iconColor='#00ACE8'
                              
                              onPress={() => {/* Handle edit */ }}
                            />
                            <IconButton
                              icon="toggle-switch"
                              size={20}
                              color={theme.colors.secondary}
                              onPress={() => {/* Handle toggle */ }}
                            />
                             <IconButton
                              icon="toggle-switch-off"
                              size={20}
                              color={theme.colors.secondary}
                              onPress={() => {/* Handle toggle */ }}
                            />
                          </View>
                        </DataTable.Cell>
                      </DataTable.Row>
                      <Divider />
                    </Animated.View>
                  ))
                )}
              </DataTable>
            </View>
          </ScrollView>
        </View>

        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(filteredData.length / itemsPerPage)}
          onPageChange={setPage}
          label={`${page + 1} de ${Math.ceil(filteredData.length / itemsPerPage)}`}
          paginationControlRippleColor="#00ACE8"
          accessibilityIgnoresInvertColors
          showFastPaginationControls
          numberOfItemsPerPageList={itemsPerPageOptions}
          numberOfItemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
          selectPageDropdownLabel={'Filas por página'}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    width: '100%',
    maxWidth: '100%',
  },
  container: {
    flex: 1,
    width: '100%',
    padding: 16,
    borderRadius: 12,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 4,
      },
    }),
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  searchBar: {
    flex: 1,
    marginRight: 16,
    borderRadius: 20,
    elevation: 0,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  tableWrapper: {
    width: '100%',
    flex: 1,
  },
  tableContainer: {
    minWidth: '100%',
    width: '100%',
  },
  table: {
    width: '100%',
  },
  header: {
    width: '100%',
    paddingHorizontal: 0,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerCell: {
    justifyContent: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  columnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  headerText: {
    fontWeight: 'bold',
    marginRight: 4,
    fontSize: 16,
  },
  loading: {
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  errorText: {
    marginTop: 8,
    textAlign: 'center',
  },
  row: {
    minHeight: 60,
    width: '100%',
  },
  cell: {
    justifyContent: 'flex-start',
    paddingHorizontal: 8,
  },
  cellText: {
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default TablaComponente;


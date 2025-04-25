import React, { useState, useCallback, useMemo } from "react";
import {
  StyleSheet,
  View,
  Platform,
  ScrollView,
  useWindowDimensions,
  Image,
} from "react-native";
import {
  DataTable,
  Text,
  Searchbar,
  ActivityIndicator,
  Menu,
  IconButton,
  useTheme,
  Divider,
  Portal,
  Dialog,
  Button,
  Snackbar,
  Chip,
} from "react-native-paper";
import Animated, { FadeInUp, Layout } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SrcImagen } from "@/services/publicServices";


const TablaComponente = ({
  data,
  columns,
  keyExtractor,
  onSort,
  onSearch,
  onFilter,
  onDelete,
  onToggleActive,
  onToggleInactive,
  onCreate,
  onDataUpdate,
  onEdit,
  isLoading = false,
  itemsPerPageOptions = [5, 10, 20],
  defaultItemsPerPage = 5,
}) => {
  const theme = useTheme();
  const extendedTheme = {
    ...theme,
    colors: {
      ...theme.colors,
      success: theme.colors.success || "#4CAF50",
      error: theme.colors.error || "#F44336",
      warning: theme.colors.warning || "#FFB300",
    },
  };
  const { width } = useWindowDimensions();
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("ascending");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [toggleActiveConfirmVisible, setToggleActiveConfirmVisible] =
    useState(false);
  const [toggleInactiveConfirmVisible, setToggleInactiveConfirmVisible] =
    useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToToggle, setItemToToggle] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState({
    text: "",
    type: "success",
  });

  const isSmallScreen = width < 768;
  const isMediumScreen = width >= 768 && width < 1024;

  const filteredAndSortedData = useMemo(() => {
    const result = data?.filter((item) =>
      Object.entries(item).some(([key, value]) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    if (sortBy) {
      result.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return sortOrder === "ascending" ? -1 : 1;
        if (a[sortBy] > b[sortBy]) return sortOrder === "ascending" ? 1 : -1;
        return 0;
      });
    }
    return result;
  }, [data, searchQuery, sortBy, sortOrder]);

  const paginatedData = useMemo(() => {
    const startIndex = page * itemsPerPage;
    return filteredAndSortedData?.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, page, itemsPerPage]);

  const handleSort = useCallback(
    (key) => {
      const isAsc = sortBy === key && sortOrder === "ascending";
      setSortOrder(isAsc ? "descending" : "ascending");
      setSortBy(key);
      if (onSort) {
        onSort(key, isAsc ? "descending" : "ascending");
      }
    },
    [sortBy, sortOrder, onSort]
  );

  const handleSearch = useCallback(
    (query) => {
      setSearchQuery(query);
      setPage(0);
      if (onSearch) {
        onSearch(query);
      }
    },
    [onSearch]
  );

  const handleFilter = useCallback(
    (key, value) => {
      const newFilters = { ...filters, [key]: value };
      setFilters(newFilters);
      setPage(0);
      if (onFilter) {
        onFilter(newFilters);
      }
    },
    [filters, onFilter]
  );

  const handleDeleteConfirm = useCallback(() => {
    if (itemToDelete && onDelete) {
      onDelete(itemToDelete)
        .then(() => {
          const updatedData = data.filter((item) => item !== itemToDelete);
          onDataUpdate(updatedData);
          setSnackbarMessage({
            text: "Registro eliminado exitosamente",
            type: "success",
          });
          setSnackbarVisible(true);
        })
        .catch((error) => {
          setSnackbarMessage({
            text: `Error al eliminar el registro: ${error.response.data.message}`,
            type: "error",
          });
          setSnackbarVisible(true);
        });
    }
    setDeleteConfirmVisible(false);
    setItemToDelete(null);
  }, [itemToDelete, onDelete, data, onDataUpdate]);

  const handleToggleActiveConfirm = useCallback(() => {
    if (itemToToggle && onToggleActive) {
      onToggleActive(itemToToggle)
        .then(() => {
          const updatedData = data.map((item) =>
            item === itemToToggle ? { ...item, estado: true } : item
          );
          onDataUpdate(updatedData);
          setSnackbarMessage({
            text: "Registro activado exitosamente",
            type: "success",
          });
          setSnackbarVisible(true);
        })
        .catch((error) => {
          setSnackbarMessage({
            text: `Error al activar el registro: ${error.message}`,
            type: "error",
          });
          setSnackbarVisible(true);
        });
    }
    setToggleActiveConfirmVisible(false);
    setItemToToggle(null);
  }, [itemToToggle, onToggleActive, data, onDataUpdate]);

  const handleToggleInactiveConfirm = useCallback(() => {
    if (itemToToggle && onToggleInactive) {
      onToggleInactive(itemToToggle)
        .then(() => {
          const updatedData = data.map((item) =>
            item === itemToToggle ? { ...item, estado: false } : item
          );
          onDataUpdate(updatedData);
          setSnackbarMessage({
            text: "Registro inactivado exitosamente",
            type: "success",
          });
          setSnackbarVisible(true);
        })
        .catch((error) => {
          setSnackbarMessage({
            text: `Error al inactivar el registro: ${error.response.data.message}`,
            type: "error",
          });
          setSnackbarVisible(true);
        });
    }
    setToggleInactiveConfirmVisible(false);
    setItemToToggle(null);
  }, [itemToToggle, onToggleInactive, data, onDataUpdate]);

  const handleCreate = useCallback(() => {
    if (onCreate) {
      onCreate()
        .then(() => {
          setSnackbarMessage({
            text: "Registro creado exitosamente",
            type: "success",
          });
          setSnackbarVisible(true);
        })
        .catch((error) => {
          setSnackbarMessage({
            text: `Error al crear el registro: ${error.message}`,
            type: "error",
          });
          setSnackbarVisible(true);
        });
    }
  }, [onCreate]);

  const handleEdit = useCallback(
    async (item) => {
      if (onEdit) {
        try {
          await onEdit(item)
            .then(() => {
              setSnackbarMessage({
                text: "Registro actualizado exitosamente",
                type: "success",
              });
            })
            .catch((error) => {
              return;
            });
        } catch (error) {
          return;
        }
        setSnackbarVisible(true);
      }
    },
    [onEdit]
  );

  const renderCell = useCallback(
    (column, item) => {
      if (column.key === "estado") {
        const isActive = item[column.key];

        return (
          <Chip
            style={{
              backgroundColor:
                isActive == true ||
                isActive == "Aprobado" ||
                isActive == "Resuelto" || isActive == "Contrato Firmado" || isActive == "Oferta Enviada" || isActive == "Confirmado"
                  ? extendedTheme.colors.success
                  : isActive == "Pendiente" || isActive == "En Proceso" || isActive == "Postulado" || isActive == "Entrevista 1" || isActive == "Entrevista 2" || isActive == "Prueba Tecnica" ||  isActive == "Asignado"
                  ? extendedTheme.colors.warning
                  : extendedTheme.colors.error,
              color: extendedTheme.colors.surface,
            }}
          >
            {isActive === true
              ? "Activo"
              : isActive === false
              ? "Inactivo"
              : isActive === "Pendiente"
              ? "Pendiente"
              : isActive === "Aprobado"
              ? "Aprobado"
              : isActive === "Rechazado"
              ? "Rechazado"
              : isActive === "En Proceso"
              ? "En Proceso"
              : isActive === "Resuelto"
              ? "Resuelto"
              : isActive === "Postulado" 
              ? "Postulado"
              :isActive === "CV Aprobado"
              ? "CV Aprobado"
              :isActive === "Entrevista 1"
              ? "Entrevista 1"
              :isActive === "Entrevista 2"
              ? "Entrevista 2"
              : isActive === "Prueba Tecnica"
              ? "Prueba Tecnica"
              : isActive === "Oferta Enviada"
              ? "Oferta Enviada"
              :isActive === "Contrato Firmado"
              ? "Contrato Firmado"
              :isActive === "Asignado"
              ? "Asignado"
              :isActive === "Confirmado"
              ? "Confirmado"
              :isActive ==="Devuelto"
              ? "Devuelto"
              : "Estado desconocido"}
          </Chip>
        );
      }
      if (column.key === "imagenes" || column.key == "fotoppe") {
        return (
          <>
            {/*   <ImageCarousel images={item?.imagenes} /> */}
            <Image
              source={{ uri: SrcImagen(column.key == "imagenes" ? item.imagenes[0].uri : item.fotoppe?.uri )}}
              style={{ width: 100, height: 100 }}
            />
          </>
        );
      }

      if (item[column.key] === null) {
        return <Text style={styles.cellText}>Sin datos</Text>;
      }
      if (column.render) {
        return column.render(item[column.key], item);
      }
      return String(item[column.key]);
    },
    [extendedTheme.colors]
  );

  const getColumnStyle = useCallback(
    (column) => {
      if (isSmallScreen) {
        return { minWidth: column.width || 100, maxWidth: column.width || 150 };
      }
      if (isMediumScreen) {
        return { minWidth: column.width || 120, maxWidth: column.width || 200 };
      }
      return { flex: 1, minWidth: column.width || 150 };
    },
    [isSmallScreen, isMediumScreen]
  );

  if (!data || data.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.noDataText}>No hay datos disponibles</Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.outerContainer}>
        <Animated.View
          entering={FadeInUp}
          style={[
            styles.container,
            { backgroundColor: extendedTheme.colors.background },
          ]}
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
                  color={extendedTheme.colors.primary}
                />
              }
            >
              {columns.map((column) => (
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
          <ScrollView style={styles.tableWrapper}>
            <ScrollView horizontal={isSmallScreen || isMediumScreen}>
              <View style={styles.tableContainer}>
                <DataTable style={styles.table}>
                  <DataTable.Header style={styles.header}>
                    {columns.map((column) => (
                      <DataTable.Title
                        key={String(column.key)}
                        sortDirection={
                          sortBy === column.key ? sortOrder : "none"
                        }
                        onPress={() =>
                          column.sortable && handleSort(column.key)
                        }
                        style={[styles.headerCell, getColumnStyle(column)]}
                      >
                        <View style={styles.columnHeader}>
                          <Text style={styles.headerText}>{column.title}</Text>
                          {column.sortable && (
                            <MaterialCommunityIcons
                              name={
                                sortBy === column.key
                                  ? sortOrder === "ascending"
                                    ? "arrow-up"
                                    : "arrow-down"
                                  : "arrow-up-down"
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
                        getColumnStyle({ width: 120 }),
                      ]}
                    >
                      <Text style={styles.headerText}>Acciones</Text>
                    </DataTable.Title>
                  </DataTable.Header>

                  {isLoading ? (
                    <ActivityIndicator
                      style={styles.loading}
                      color={extendedTheme.colors.primary}
                      size="large"
                    />
                  ) : (
                    paginatedData.map((item, index) => (
                      <Animated.View
                        key={keyExtractor(item)}
                        entering={FadeInUp.delay(index * 50)}
                        layout={Layout.springify()}
                      >
                        <DataTable.Row style={styles.row}>
                          {columns.map((column) => (
                            <DataTable.Cell
                              key={String(column.key)}
                              style={[styles.cell, getColumnStyle(column)]}
                            >
                              <Text style={styles.cellText}>
                                {renderCell(column, item)}
                              </Text>
                            </DataTable.Cell>
                          ))}
                          <DataTable.Cell
                            style={[
                              styles.cell,
                              getColumnStyle({ width: 120 }),
                            ]}
                          >
                            <View style={styles.actionButtons}>
                              <IconButton
                                icon="delete-outline"
                                size={20}
                                iconColor="red"
                                onPress={() => {
                                  setItemToDelete(item);
                                  setDeleteConfirmVisible(true);
                                }}
                              />
                              <IconButton
                                icon="pencil-outline"
                                size={20}
                                iconColor="#00ACE8"
                                onPress={() => handleEdit(item)}
                              />

                              {item.estado === true || item.estado === false ? (
                                <>
                                  <IconButton
                                    icon={
                                      item.estado
                                        ? "toggle-switch"
                                        : "toggle-switch-off"
                                    }
                                    size={20}
                                    iconColor={item.estado ? "#00ACE8" : "#666"}
                                    onPress={() => {
                                      setItemToToggle(item);
                                      if (item.estado) {
                                        setToggleInactiveConfirmVisible(true);
                                      } else {
                                        setToggleActiveConfirmVisible(true);
                                      }
                                    }}
                                  />
                                </>
                              ) : null}
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
          </ScrollView>

          <DataTable.Pagination
            page={page}
            numberOfPages={Math.ceil(
              filteredAndSortedData.length / itemsPerPage
            )}
            onPageChange={setPage}
            label={`${page + 1} de ${Math.ceil(
              filteredAndSortedData.length / itemsPerPage
            )}`}
            showFastPaginationControls
            numberOfItemsPerPageList={itemsPerPageOptions}
            numberOfItemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
            selectPageDropdownLabel={"Filas por página"}
          />
        </Animated.View>

        <Portal>
          <Dialog
            visible={deleteConfirmVisible}
            onDismiss={() => setDeleteConfirmVisible(false)}
          >
            <Dialog.Title>Confirmar eliminación</Dialog.Title>
            <Dialog.Content>
              <Text>¿Está seguro que desea eliminar este registro?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDeleteConfirmVisible(false)}>
                Cancelar
              </Button>
              <Button onPress={handleDeleteConfirm}>Eliminar</Button>
            </Dialog.Actions>
          </Dialog>

          <Dialog
            visible={toggleActiveConfirmVisible}
            onDismiss={() => setToggleActiveConfirmVisible(false)}
          >
            <Dialog.Title>Confirmar activación</Dialog.Title>
            <Dialog.Content>
              <Text>¿Está seguro que desea activar este registro?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setToggleActiveConfirmVisible(false)}>
                Cancelar
              </Button>
              <Button onPress={handleToggleActiveConfirm}>Activar</Button>
            </Dialog.Actions>
          </Dialog>

          <Dialog
            visible={toggleInactiveConfirmVisible}
            onDismiss={() => setToggleInactiveConfirmVisible(false)}
          >
            <Dialog.Title>Confirmar inactivación</Dialog.Title>
            <Dialog.Content>
              <Text>¿Está seguro que desea inactivar este registro?</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setToggleInactiveConfirmVisible(false)}>
                Cancelar
              </Button>
              <Button onPress={handleToggleInactiveConfirm}>Inactivar</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          style={{
            backgroundColor:
              snackbarMessage.type === "success"
                ? extendedTheme.colors.success
                : extendedTheme.colors.error,
          }}
          action={{
            label: "Cerrar",
            onPress: () => setSnackbarVisible(false),
          }}
        >
          <Text style={{ color: extendedTheme.colors.surface }}>
            {snackbarMessage.text}
          </Text>
        </Snackbar>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    width: "100%",
    maxWidth: "100%",
  },
  container: {
    flex: 1,
    width: "100%",
    padding: 16,
    borderRadius: 12,
    ...Platform.select({
      web: {
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      },
      default: {
        elevation: 4,
      },
    }),
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    width: "100%",
  },
  searchBar: {
    flex: 1,
    marginRight: 16,
    borderRadius: 20,
    elevation: 0,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  tableWrapper: {
    width: "100%",
    flex: 1,
  },
  tableContainer: {
    minWidth: "100%",
    width: "100%",
  },
  table: {
    width: "100%",
  },
  header: {
    width: "100%",
    paddingHorizontal: 0,
    borderBottomWidth: 2,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  headerCell: {
    justifyContent: "flex-start",
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  columnHeader: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  headerText: {
    fontWeight: "bold",
    marginRight: 4,
    fontSize: 16,
  },
  loading: {
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  errorText: {
    marginTop: 8,
    textAlign: "center",
  },
  noDataText: {
    fontSize: 16,
    color: "rgba(0, 0, 0, 0.6)",
  },
  row: {
    minHeight: 60,
    width: "100%",
  },
  cell: {
    justifyContent: "flex-start",
    paddingHorizontal: 8,
  },
  cellText: {
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});

export default TablaComponente;

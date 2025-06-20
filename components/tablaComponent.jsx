import React from "react";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
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
  Surface,
} from "react-native-paper";
import Animated, { FadeInUp, Layout } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SrcImagen } from "@/services/publicServices";
import { useAuth } from "@/context/userContext";
import ExcelApique from "./ExcelApique";
import { getUserById as getUserByIdAdmin } from "@/services/adminServices";
import { getUserById as getUserByIdEmployee } from "@/services/employeeService";

// Constantes para responsividad
const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  large: 1440,
};

// Constantes para rendimiento
const USER_ID_FIELDS = [
  "asignadorId",
  "userId",
  "asignadoId",
  "solicitanteId",
  "aprobadorId",
];
const CACHE_MAX_AGE = 10 * 60 * 1000;
const BATCH_SIZE = 15;
const DEBOUNCE_TIME = 30;

// Hook personalizado para responsividad - CORREGIDO COMPLETAMENTE
const useResponsiveLayout = (itemsPerPage = 5) => {
  const { width, height } = useWindowDimensions();

  const deviceType = useMemo(() => {
    if (width < BREAKPOINTS.mobile) return "mobile";
    if (width < BREAKPOINTS.tablet) return "tablet";
    if (width < BREAKPOINTS.desktop) return "desktop";
    return "large";
  }, [width]);

  const columnWidths = useMemo(() => {
    switch (deviceType) {
      case "mobile":
        return {
          id: 60,
          asignado: 120,
          titulo: 150,
          descripcion: 180,
          estado: 100,
          creado: 140,
          modificado: 140,
          acciones: 120,
        };
      case "tablet":
        return {
          id: 80,
          asignado: 150,
          titulo: 200,
          descripcion: 220,
          estado: 120,
          creado: 160,
          modificado: 160,
          acciones: 140,
        };
      case "desktop":
        return {
          id: 100,
          asignado: 180,
          titulo: 250,
          descripcion: 280,
          estado: 140,
          creado: 180,
          modificado: 180,
          acciones: 160,
        };
      default: // large
        return {
          id: 120,
          asignado: 200,
          titulo: 300,
          descripcion: 350,
          estado: 160,
          creado: 200,
          modificado: 200,
          acciones: 180,
        };
    }
  }, [deviceType]);

  // ALTURA DINÁMICA SIN RESTRICCIONES
  const rowHeight = useMemo(() => {
    return deviceType === "mobile" ? 60 : 70;
  }, [deviceType]);

  // Calculamos la altura exacta necesaria para mostrar todos los elementos
  // Sin restricciones de altura máxima
  const tableHeight = useMemo(() => {
    // Altura base del header
    const headerHeight = 50;

    // Altura adicional por bordes y espaciado
    const borderAndPadding = 10;

    // Buffer adicional para asegurar que la última fila se vea completa
    const buffer = 20;

    // Calculamos la altura exacta necesaria para mostrar todos los elementos
    return headerHeight + rowHeight * itemsPerPage + borderAndPadding + buffer;
  }, [rowHeight, itemsPerPage]);

  return {
    deviceType,
    columnWidths,
    tableHeight,
    rowHeight,
    screenWidth: width,
    screenHeight: height,
    isLandscape: width > height,
  };
};

// Componente de celda de usuario optimizado
const UserCell = React.memo(({ userId, getUser, isLoadingUser, fetchUser }) => {
  useEffect(() => {
    if (userId && !getUser(userId) && !isLoadingUser(userId)) {
      fetchUser(userId);
    }
  }, [userId]);

  if (!userId) {
    return (
      <View style={userCellStyles.container}>
        <MaterialCommunityIcons name="account-off" size={14} color="#666" />
        <Text
          style={[userCellStyles.text, { color: "#666" }]}
          numberOfLines={1}
        >
          Sin asignar
        </Text>
      </View>
    );
  }

  if (isLoadingUser(userId)) {
    return (
      <View style={userCellStyles.container}>
        <ActivityIndicator size="small" />
        <Text style={userCellStyles.text} numberOfLines={1}>
          Cargando...
        </Text>
      </View>
    );
  }

  const cachedUser = getUser(userId);

  if (!cachedUser) {
    return (
      <View style={userCellStyles.container}>
        <ActivityIndicator size="small" />
        <Text style={userCellStyles.text} numberOfLines={1}>
          Cargando...
        </Text>
      </View>
    );
  }

  if (cachedUser.error || !cachedUser.user) {
    return (
      <View style={userCellStyles.container}>
        <MaterialCommunityIcons
          name="account-alert"
          size={14}
          color="#F44336"
        />
        <Text
          style={[userCellStyles.text, { color: "#F44336" }]}
          numberOfLines={1}
        >
          Error
        </Text>
      </View>
    );
  }

  return (
    <View style={userCellStyles.container}>
      <MaterialCommunityIcons name="account" size={14} color="#4CAF50" />
      <Text style={userCellStyles.text} numberOfLines={1}>
        {cachedUser.user.nombre}
      </Text>
    </View>
  );
});

// Componente de celda de estado optimizado
const StatusCell = React.memo(({ status, colors, compact = false }) => {
  const statusMap = {
    true: { text: "Activo", color: colors.success },
    false: { text: "Inactivo", color: colors.error },
    Pendiente: { text: "Pendiente", color: colors.warning },
    "En Proceso": { text: "En Proceso", color: colors.warning },
    Postulado: { text: "Postulado", color: colors.warning },
    "Entrevista 1": { text: "Entrevista 1", color: colors.warning },
    "Entrevista 2": { text: "Entrevista 2", color: colors.warning },
    "Prueba Técnica": { text: "Prueba Tecnica", color: colors.warning },
    Asignado: { text: "Asignado", color: colors.warning },
    Aprobado: { text: "Aprobado", color: colors.success },
    Resuelto: { text: "Resuelto", color: colors.success },
    "Contrato Firmado": { text: "Contrato Firmado", color: colors.success },
    "Oferta Enviada": { text: "Oferta Enviada", color: colors.success },
    Confirmado: { text: "Confirmado", color: colors.success },
    Rechazado: { text: "Rechazado", color: colors.error },
    Devuelto: { text: "Devuelto", color: colors.error },
  };

  const statusInfo = statusMap[status] || {
    text: "Estado desconocido",
    color: colors.error,
  };

  return (
    <Chip
      compact={compact}
      style={{
        backgroundColor: statusInfo.color,
        color: colors.surface,
        maxWidth: "100%",
      }}
      textStyle={{ fontSize: compact ? 11 : 12 }}
    >
      {statusInfo.text}
    </Chip>
  );
});

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

  const { user } = useAuth();

  // Estados principales
  const [logueado, setLogueado] = useState(null);
  const [role, setRole] = useState(null);
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("ascending");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);

  // HOOK CORREGIDO - Ahora recibe itemsPerPage actual
  const { deviceType, columnWidths, tableHeight, rowHeight, screenWidth } =
    useResponsiveLayout(itemsPerPage);

 
 

  // Estados de diálogos
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

  // Sistema de cache optimizado
  const [usersCache, setUsersCache] = useState(new Map());
  const [loadingUsers, setLoadingUsers] = useState(new Set());
  const pendingRequests = useRef(new Map());
  const [cacheSize, setCacheSize] = useState(0);
  const batchQueue = useRef([]);
  const batchTimeoutRef = useRef(null);

  // Cargar información del usuario
  useEffect(() => {
    async function fetchUser() {
      try {
        const result = await user();
        setLogueado(result);
        setRole(result?.role || "guest");
      } catch (error) {
        console.error("Error fetching user:", error);
        setRole("guest");
      }
    }
    fetchUser();
  }, [user]);

  // Sistema de cache optimizado
  const fetchUsersInBatch = useCallback(
    async (userIds) => {
      if (!userIds || userIds.length === 0 || !role) return;

      const uniqueIds = [...new Set(userIds)].filter(
        (id) => id && !usersCache.has(id) && !loadingUsers.has(id)
      );
      if (uniqueIds.length === 0) return;

      setLoadingUsers((prev) => {
        const newSet = new Set(prev);
        uniqueIds.forEach((id) => newSet.add(id));
        return newSet;
      });

      try {
        const batches = [];
        for (let i = 0; i < uniqueIds.length; i += BATCH_SIZE) {
          batches.push(uniqueIds.slice(i, i + BATCH_SIZE));
        }

        await Promise.all(
          batches.map(async (batch) => {
            const promises = batch.map(async (userId) => {
              try {
                const getUserById =
                  role === "employee" ? getUserByIdEmployee : getUserByIdAdmin;
                const userData = await getUserById(userId);
                return { userId, user: userData, error: null };
              } catch (error) {
                return { userId, user: null, error };
              }
            });

            const results = await Promise.all(promises);

            setUsersCache((prev) => {
              const newCache = new Map(prev);
              const now = Date.now();
              results.forEach(({ userId, user, error }) => {
                if (userId) {
                  newCache.set(userId, { user, error, timestamp: now });
                }
              });
              setCacheSize(newCache.size);
              return newCache;
            });
          })
        );
      } finally {
        setLoadingUsers((prev) => {
          const newSet = new Set(prev);
          uniqueIds.forEach((id) => newSet.delete(id));
          return newSet;
        });
      }
    },
    [usersCache, loadingUsers, role]
  );

  const queueUserFetch = useCallback(
    (userId) => {
      if (
        !userId ||
        usersCache.has(userId) ||
        loadingUsers.has(userId) ||
        !role
      )
        return;

      batchQueue.current.push(userId);

      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
      }

      batchTimeoutRef.current = setTimeout(() => {
        const idsToFetch = [...batchQueue.current];
        batchQueue.current = [];
        fetchUsersInBatch(idsToFetch);
      }, DEBOUNCE_TIME);
    },
    [fetchUsersInBatch, usersCache, loadingUsers, role]
  );

  const getUser = useCallback(
    (userId) => {
      if (!userId) return null;
      return usersCache.get(userId) || null;
    },
    [usersCache]
  );

  const isLoadingUser = useCallback(
    (userId) => {
      return loadingUsers.has(userId);
    },
    [loadingUsers]
  );

  // Datos filtrados y paginados
  const filteredAndSortedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const result = searchQuery
      ? data.filter((item) =>
          Object.entries(item).some(([key, value]) => {
            if (value === null || value === undefined) return false;
            return String(value)
              .toLowerCase()
              .includes(searchQuery.toLowerCase());
          })
        )
      : [...data];

    if (sortBy) {
      result.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];

        if (aVal === null && bVal === null) return 0;
        if (aVal === null) return sortOrder === "ascending" ? -1 : 1;
        if (bVal === null) return sortOrder === "ascending" ? 1 : -1;

        if (aVal < bVal) return sortOrder === "ascending" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "ascending" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchQuery, sortBy, sortOrder]);

  const paginatedData = useMemo(() => {
    if (!filteredAndSortedData.length) return [];
    const startIndex = page * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, page, itemsPerPage]);

  // Precargar usuarios
  useEffect(() => {
    if (paginatedData && paginatedData.length > 0 && role) {
      const userIds = [];
      paginatedData.forEach((item) => {
        USER_ID_FIELDS.forEach((field) => {
          if (item[field]) {
            userIds.push(item[field]);
          }
        });
      });

      if (userIds.length > 0) {
        fetchUsersInBatch(userIds);
      }
    }
  }, [paginatedData, fetchUsersInBatch, role]);

  // Resetear página cuando cambia itemsPerPage
  useEffect(() => {
    const maxPage = Math.ceil(filteredAndSortedData.length / itemsPerPage) - 1;
    if (page > maxPage && maxPage >= 0) {
      setPage(Math.max(0, maxPage));
    }
  }, [itemsPerPage, filteredAndSortedData.length, page]);

  // Handlers
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

  // Función para obtener el ancho de columna
  const getColumnWidth = useCallback(
    (columnKey) => {
      const key = columnKey.toLowerCase();
      return columnWidths[key] || columnWidths.descripcion;
    },
    [columnWidths]
  );

  // Renderizado de celdas optimizado
  const renderCell = useCallback(
    (column, item) => {
      const cellWidth = getColumnWidth(column.key);
      const isCompact = deviceType === "mobile";

      // Manejo de estados
      if (column.key === "estado") {
        return (
          <StatusCell
            status={item[column.key]}
            colors={extendedTheme.colors}
            compact={isCompact}
          />
        );
      }

      // Manejo de imágenes
      if (
        column.key === "imagenes" ||
        column.key === "fotoppe" ||
        column.key === "fotoRetorno"
      ) {
        let uri;
        try {
          uri = SrcImagen(
            column.key === "imagenes"
              ? item.imagenes[0]?.uri
              : column.key === "fotoRetorno"
              ? item.fotoRetorno
              : item.fotoppe
          );
        } catch (e) {
          return (
            <Text
              style={[styles.cellText, { width: cellWidth }]}
              numberOfLines={1}
            >
              Error de imagen
            </Text>
          );
        }

        const imageSize = isCompact ? 60 : 80;
        return (
          <View style={{ width: cellWidth, alignItems: "center" }}>
            <Image
              source={{ uri }}
              style={{ width: imageSize, height: imageSize, borderRadius: 4 }}
            />
          </View>
        );
      }

      // Manejo de IDs de usuario
      if (USER_ID_FIELDS.includes(column.key)) {
        const userId = item[column.key];
        return (
          <View style={{ width: cellWidth }}>
            <UserCell
              userId={userId}
              getUser={getUser}
              isLoadingUser={isLoadingUser}
              fetchUser={queueUserFetch}
            />
          </View>
        );
      }

      // Manejo de valores nulos
      if (item[column.key] === null || item[column.key] === undefined) {
        return (
          <Text
            style={[styles.cellText, { width: cellWidth }]}
            numberOfLines={1}
          >
            Sin datos
          </Text>
        );
      }

      // Renderizado personalizado si existe
      if (column.render) {
        return (
          <View style={{ width: cellWidth }}>
            {column.render(item[column.key], item)}
          </View>
        );
      }

      // Renderizado por defecto
      return (
        <Text
          style={[styles.cellText, { width: cellWidth }]}
          numberOfLines={isCompact ? 1 : 2}
        >
          {String(item[column.key])}
        </Text>
      );
    },
    [
      extendedTheme.colors,
      getUser,
      isLoadingUser,
      queueUserFetch,
      getColumnWidth,
      deviceType,
    ]
  );

  const totalTableWidth = useMemo(() => {
    return columns.reduce((total, column) => {
      return total + getColumnWidth(column.key);
    }, getColumnWidth("acciones"));
  }, [columns, getColumnWidth]);

  const handleDeleteConfirm = useCallback(() => {
    if (!itemToDelete || !onDelete) {
      setDeleteConfirmVisible(false);
      setItemToDelete(null);
      return;
    }

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
          text: `Error al eliminar el registro: ${
            error.response?.data?.message || error.message
          }`,
          type: "error",
        });
        setSnackbarVisible(true);
      })
      .finally(() => {
        setDeleteConfirmVisible(false);
        setItemToDelete(null);
      });
  }, [itemToDelete, onDelete, data, onDataUpdate]);

  const handleToggleActiveConfirm = useCallback(() => {
    if (!itemToToggle || !onToggleActive) {
      setToggleActiveConfirmVisible(false);
      setItemToToggle(null);
      return;
    }

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
      })
      .finally(() => {
        setToggleActiveConfirmVisible(false);
        setItemToToggle(null);
      });
  }, [itemToToggle, onToggleActive, data, onDataUpdate]);

  const handleToggleInactiveConfirm = useCallback(() => {
    if (!itemToToggle || !onToggleInactive) {
      setToggleInactiveConfirmVisible(false);
      setItemToToggle(null);
      return;
    }

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
          text: `Error al inactivar el registro: ${
            error.response?.data?.message || error.message
          }`,
          type: "error",
        });
        setSnackbarVisible(true);
      })
      .finally(() => {
        setToggleInactiveConfirmVisible(false);
        setItemToToggle(null);
      });
  }, [itemToToggle, onToggleInactive, data, onDataUpdate]);

  if (!data || data.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.noDataText}>No hay datos disponibles</Text>
      </View>
    );
  }

  return (
    <Surface style={[styles.outerContainer]} elevation={2}>
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
            style={[styles.searchBar, { maxWidth: screenWidth * 0.7 }]}
            iconColor="#5bfff3"
            inputStyle={{
              color: "black",
              fontSize: deviceType === "mobile" ? 14 : 16,
            }}
          />
          <Menu
            visible={filterMenuVisible}
            onDismiss={() => setFilterMenuVisible(false)}
            anchor={
              <IconButton
                icon="filter-variant"
                onPress={() => setFilterMenuVisible(true)}
                color={extendedTheme.colors.primary}
                size={deviceType === "mobile" ? 20 : 24}
              />
            }
          >
            {columns.map((column) => (
              <Menu.Item
                key={String(column.key)}
                onPress={() => {
                  setFilterMenuVisible(false);
                }}
                title={column.title}
              />
            ))}
          </Menu>
        </View>

        {/* TABLA CON ALTURA DINÁMICA - ESTRUCTURA SIMPLIFICADA */}
        <View style={[styles.tableWrapper, { height: tableHeight }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            style={styles.horizontalScroll}
            contentContainerStyle={{
              minWidth: Math.max(totalTableWidth, screenWidth),
            }}
          >
            <View
              style={[
                styles.tableContainer,
                { width: Math.max(totalTableWidth, screenWidth) },
              ]}
            >
              <DataTable style={styles.table}>
                <DataTable.Header style={styles.header}>
                  {columns.map((column) => (
                    <DataTable.Title
                      key={String(column.key)}
                      sortDirection={sortBy === column.key ? sortOrder : "none"}
                      onPress={() => column.sortable && handleSort(column.key)}
                      style={[
                        styles.headerCell,
                        { width: getColumnWidth(column.key) },
                      ]}
                    >
                      <View style={styles.columnHeader}>
                        <Text
                          style={[
                            styles.headerText,
                            { fontSize: deviceType === "mobile" ? 12 : 14 },
                          ]}
                          numberOfLines={1}
                        >
                          {column.title}
                        </Text>
                        {column.sortable && (
                          <MaterialCommunityIcons
                            name={
                              sortBy === column.key
                                ? sortOrder === "ascending"
                                  ? "arrow-up"
                                  : "arrow-down"
                                : "arrow-up-down"
                            }
                            size={deviceType === "mobile" ? 12 : 16}
                            color="#00ACE8"
                          />
                        )}
                      </View>
                    </DataTable.Title>
                  ))}
                  <DataTable.Title
                    style={[
                      styles.headerCell,
                      { width: getColumnWidth("acciones") },
                    ]}
                  >
                    <Text
                      style={[
                        styles.headerText,
                        { fontSize: deviceType === "mobile" ? 12 : 14 },
                      ]}
                    >
                      Acciones
                    </Text>
                  </DataTable.Title>
                </DataTable.Header>

                {/* FILAS DE DATOS - SIN SCROLLVIEW ANIDADO */}
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator
                      style={styles.loading}
                      color={extendedTheme.colors.primary}
                      size="large"
                    />
                  </View>
                ) : (
                  paginatedData.map((item, index) => (
                    <Animated.View
                      key={keyExtractor(item)}
                      entering={FadeInUp.delay(index * 20)}
                      layout={Layout.springify()}
                    >
                      <DataTable.Row
                        style={[styles.row, { height: rowHeight }]}
                      >
                        {columns.map((column) => (
                          <DataTable.Cell
                            key={String(column.key)}
                            style={[
                              styles.cell,
                              { width: getColumnWidth(column.key) },
                            ]}
                          >
                            {renderCell(column, item)}
                          </DataTable.Cell>
                        ))}
                        <DataTable.Cell
                          style={[
                            styles.cell,
                            { width: getColumnWidth("acciones") },
                          ]}
                        >
                          <View style={styles.actionButtons}>
                            {onDelete && (
                              <IconButton
                                icon="delete-outline"
                                size={deviceType === "mobile" ? 18 : 20}
                                iconColor="red"
                                onPress={() => {
                                  setItemToDelete(item);
                                  setDeleteConfirmVisible(true);
                                }}
                              />
                            )}

                            <IconButton
                              icon="pencil-outline"
                              size={deviceType === "mobile" ? 18 : 20}
                              iconColor="#00ACE8"
                              onPress={() => onEdit && onEdit(item)}
                              te
                            />

                            {item.informeNum != null ? (
                              <ExcelApique id={item.id} />
                            ) : null}

                            {(item.estado === true ||
                              item.estado === false) && (
                              <IconButton
                                icon={
                                  item.estado
                                    ? "toggle-switch"
                                    : "toggle-switch-off"
                                }
                                size={deviceType === "mobile" ? 18 : 20}
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
                            )}
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
          numberOfPages={Math.ceil(filteredAndSortedData.length / itemsPerPage)}
          onPageChange={setPage}
          label={`${page + 1} de ${Math.ceil(
            filteredAndSortedData.length / itemsPerPage
          )}`}
          showFastPaginationControls
          numberOfItemsPerPageList={itemsPerPageOptions}
          numberOfItemsPerPage={itemsPerPage}
          onItemsPerPageChange={(newItemsPerPage) => {
            setItemsPerPage(newItemsPerPage);
            setPage(0);
          }}
          selectPageDropdownLabel={"Filas por página"}
          style={{ paddingHorizontal: 8 }}
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
            <Button
              textColor="black"
              mode="outlined"
              onPress={() => setDeleteConfirmVisible(false)}
            >
              Cancelar
            </Button>
            <Button
              buttonColor="red"
              mode="contained"
              onPress={handleDeleteConfirm}
            >
              Eliminar
            </Button>
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
            <Button
              textColor="black"
              mode="outlined"
              onPress={() => setToggleActiveConfirmVisible(false)}
            >
              Cancelar
            </Button>
            <Button
              buttonColor="#00ACE8"
              mode="contained"
              onPress={handleToggleActiveConfirm}
            >
              Activar
            </Button>
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
            <Button
              textColor="black"
              mode="outlined"
              onPress={() => setToggleInactiveConfirmVisible(false)}
            >
              Cancelar
            </Button>
            <Button
              buttonColor="red"
              mode="contained"
              onPress={handleToggleInactiveConfirm}
            >
              Inactivar
            </Button>
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
      >
        <Text style={{ color: extendedTheme.colors.surface }}>
          {snackbarMessage.text}
        </Text>
      </Snackbar>
    </Surface>
  );
};

// Estilos optimizados
const userCellStyles = StyleSheet.create({
  container: {
    marginLeft: "20%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  text: {
    fontSize: 13,
    marginLeft: 3,
    flex: 1,
  },
});

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    width: "100%",
    margin: 8,
    borderRadius: 12,
  },
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  searchBar: {
    flex: 1,
    marginRight: 12,
    borderRadius: 25,
    elevation: 0,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },

  tableWrapper: {
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  horizontalScroll: {
    flex: 1,
  },
  tableContainer: {
    flex: 1,
  },
  table: {
    flex: 1,
  },
  header: {
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 2,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  headerCell: {
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderRightColor: "rgba(0,0,0,0.05)",
  },
  columnHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontWeight: "bold",
    marginRight: 4,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
  loading: {
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noDataText: {
    fontSize: 16,
    color: "rgba(0, 0, 0, 0.6)",
    textAlign: "center",
  },
  row: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  cell: {
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRightWidth: 1,
    borderRightColor: "rgba(0,0,0,0.05)",
  },
  cellText: {
    fontSize: 13,
    textAlign: "center",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
});

export default TablaComponente;

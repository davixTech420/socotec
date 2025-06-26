import { useState, useCallback, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  useWindowDimensions,
  Platform,
} from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import Animated, {
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
  FadeIn,
} from "react-native-reanimated";
import {
  PaperProvider,
  Surface,
  Chip,
  DataTable,
  ActivityIndicator,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { getDashboard } from "@/services/adminServices";

const AnimatedSurface = Animated.createAnimatedComponent(Surface);
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const AnimatedView = Animated.createAnimatedComponent(View);

export default function AnalyticsDashboardPro() {
  // State management
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("movimientos");
  const [isLoading, setIsLoading] = useState(true);
  const { width: screenWidth } = useWindowDimensions();

  // Animation values
  const scrollY = useSharedValue(0);
  const chartAnimation = useSharedValue(0);
  const tabChangeAnimation = useSharedValue(0);
  const periodChangeAnimation = useSharedValue(0);
  const scrollViewRef = useRef(null);

  // Data state
  const [dashboardData, setDashboardData] = useState({
    users: [],
    inventarios: [],
    accounts: [],
    movimientos: [],
  });

  // Extract data for easier access
  const { users, inventarios, accounts, movimientos } = dashboardData;

  // Effect to animate when tab changes
  useEffect(() => {
    // Reset and trigger animation when tab changes
    tabChangeAnimation.value = 0;
    tabChangeAnimation.value = withSpring(1, {
      damping: 12,
      stiffness: 90,
    });
  }, [activeTab]);

  // Effect to animate when period changes
  useEffect(() => {
    // Reset and trigger animation when period changes
    periodChangeAnimation.value = 0;
    periodChangeAnimation.value = withSpring(1, {
      damping: 12,
      stiffness: 90,
    });
  }, [selectedPeriod]);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getDashboard();
      setDashboardData(data);

      // Start chart animation after data is loaded
      chartAnimation.value = withSpring(1, {
        damping: 12,
        stiffness: 90,
      });
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch data on component focus
  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();

      return () => {
        // Reset animation value when component loses focus
        chartAnimation.value = 0;
      };
    }, [fetchDashboardData])
  );

  // Filter data based on search query
  const filteredInventory = useCallback(() => {
    if (!searchQuery.trim()) return inventarios;

    return inventarios.filter(
      (item) =>
        item.nombreMaterial.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.descripcion.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [inventarios, searchQuery]);

  // Filter data based on selected period
  const filterDataByPeriod = useCallback(
    (data, dateField = "fecha") => {
      if (!data || data.length === 0) return [];

      const now = new Date();
      let startDate;

      switch (selectedPeriod) {
        case "daily":
          startDate = new Date(now);
          startDate.setHours(0, 0, 0, 0);
          break;
        case "weekly":
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
          break;
        case "monthly":
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 1);
          break;
        case "yearly":
          startDate = new Date(now);
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 1);
      }

      return data.filter((item) => new Date(item[dateField]) >= startDate);
    },
    [selectedPeriod]
  );

  // Handle refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboardData().finally(() => {
      setRefreshing(false);
    });
  }, [fetchDashboardData]);

  // Calculate percentage change for users
  const calculateUserChange = useCallback(() => {
    if (!users || users.length === 0) return "0.0%";

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const newUsers = users.filter(
      (user) => new Date(user.createdAt) >= oneMonthAgo
    ).length;
    const oldUsers = users.filter(
      (user) => new Date(user.createdAt) < oneMonthAgo
    ).length;

    if (oldUsers === 0) return "+100.0%";

    const changePercent = ((newUsers - oldUsers) / oldUsers) * 100;
    return `${changePercent > 0 ? "+" : ""}${changePercent.toFixed(1)}%`;
  }, [users]);

  // Calculate inventory value
  const calculateInventoryValue = useCallback(() => {
    if (!inventarios || inventarios.length === 0) return 0;

    return inventarios.reduce((sum, item) => {
      return sum + item.cantidad * item.precioUnidad;
    }, 0);
  }, [inventarios]);

  // Calculate inventory change
  const calculateInventoryChange = useCallback(() => {
    if (!inventarios || inventarios.length <= 1) return "0.0%";

    // Sort by date to get newest and oldest
    const sortedInventory = [...inventarios].sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt) -
        new Date(a.updatedAt || a.createdAt)
    );

    const newestValue =
      sortedInventory[0].cantidad * sortedInventory[0].precioUnidad;
    const oldestValue =
      sortedInventory[sortedInventory.length - 1].cantidad *
      sortedInventory[sortedInventory.length - 1].precioUnidad;

    if (oldestValue === 0) return "+100.0%";

    const changePercent = ((newestValue - oldestValue) / oldestValue) * 100;
    return `${changePercent > 0 ? "+" : ""}${changePercent.toFixed(1)}%`;
  }, [inventarios]);

  // Calculate account balance
  const calculateAccountBalance = useCallback(() => {
    if (!accounts || accounts.length === 0) return 0;

    return accounts.reduce((sum, item) => {
      return sum + (item.saldo || 0);
    }, 0);
  }, [accounts]);

  // Calculate account change
  const calculateAccountChange = useCallback(() => {
    if (!accounts || accounts.length <= 1) return "0.0%";

    const sortedAccounts = [...accounts].sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );

    const currentSaldo = sortedAccounts[0].saldo;
    const previousSaldo = sortedAccounts[1].saldo;

    if (previousSaldo === 0) return "+100.0%";

    const changePercent =
      ((currentSaldo - previousSaldo) / previousSaldo) * 100;
    return `${changePercent > 0 ? "+" : ""}${changePercent.toFixed(1)}%`;
  }, [accounts]);

  // Format date based on period
  const formatDateByPeriod = useCallback(
    (dateString) => {
      const date = new Date(dateString);

      switch (selectedPeriod) {
        case "daily":
          return `${date.getHours()}:00`;
        case "weekly":
          return ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"][
            date.getDay()
          ];
        case "monthly":
          return `${date.getDate()}/${date.getMonth() + 1}`;
        case "yearly":
          const months = [
            "Ene",
            "Feb",
            "Mar",
            "Abr",
            "May",
            "Jun",
            "Jul",
            "Ago",
            "Sep",
            "Oct",
            "Nov",
            "Dic",
          ];
          return months[date.getMonth()];
        default:
          return `${date.getDate()}/${date.getMonth() + 1}`;
      }
    },
    [selectedPeriod]
  );

  // Prepare line chart data based on active tab and period
  const prepareLineChartData = useCallback(() => {
    let data = [];
    let dataKey = "monto";
    let dateKey = "fecha";

    // Select data source based on active tab
    switch (activeTab) {
      case "movimientos":
        data = movimientos || [];
        dataKey = "monto";
        dateKey = "fecha";
        break;
      case "productos":
        data = inventarios || [];
        dataKey = "precioUnidad";
        dateKey = "updatedAt";
        break;
      case "usuarios":
        data = users || [];
        dataKey = "id"; // Using ID as a placeholder for user data
        dateKey = "createdAt";
        break;
      default:
        data = movimientos || [];
    }

    // Filter by period
    const filteredData = filterDataByPeriod(data, dateKey);

    if (filteredData.length === 0) {
      return {
        labels: ["Sin datos"],
        datasets: [{ data: [0], color: () => "#6bd9fe", strokeWidth: 2 }],
      };
    }

    // Sort by date
    const sortedData = [...filteredData].sort(
      (a, b) => new Date(a[dateKey]) - new Date(b[dateKey])
    );

    // Limit to last 7 entries or appropriate number based on period
    const limit = selectedPeriod === "yearly" ? 12 : 7;
    const limitedData = sortedData.slice(-limit);

    return {
      labels: limitedData.map((item) => formatDateByPeriod(item[dateKey])),
      datasets: [
        {
          data: limitedData.map((item) => {
            // Handle different data types
            if (dataKey === "id") return 1; // Count for users
            return typeof item[dataKey] === "number" ? item[dataKey] : 0;
          }),
          color: () => "#6bd9fe",
          strokeWidth: 2,
        },
      ],
    };
  }, [
    activeTab,
    movimientos,
    inventarios,
    users,
    selectedPeriod,
    filterDataByPeriod,
    formatDateByPeriod,
  ]);

  // Prepare bar chart data based on active tab and period
  const prepareBarChartData = useCallback(() => {
    let data = [];
    let labelKey = "";
    let valueKey = "";

    // Select data source based on active tab
    switch (activeTab) {
      case "movimientos":
        data = movimientos || [];
        labelKey = "fecha";
        valueKey = "monto";
        break;
      case "productos":
        data = inventarios || [];
        labelKey = "nombreMaterial";
        valueKey = "precioUnidad";
        break;
      case "usuarios":
        data = users || [];
        labelKey = "username";
        valueKey = "id"; // Using ID as a placeholder
        break;
      default:
        data = movimientos || [];
    }

    // Filter by period for date-based data
    if (
      labelKey === "fecha" ||
      labelKey === "createdAt" ||
      labelKey === "updatedAt"
    ) {
      data = filterDataByPeriod(data, labelKey);
    }

    if (data.length === 0) {
      return {
        labels: ["Sin datos"],
        datasets: [{ data: [0] }],
      };
    }

    // For products, sort by value and take top items
    if (activeTab === "productos") {
      data = [...data].sort(
        (a, b) => b.cantidad * b.precioUnidad - a.cantidad * a.precioUnidad
      );
    }

    // Limit to reasonable number of items
    const limitedData = data.slice(0, 7);

    return {
      labels: limitedData.map((item) => {
        if (
          labelKey === "fecha" ||
          labelKey === "createdAt" ||
          labelKey === "updatedAt"
        ) {
          return formatDateByPeriod(item[labelKey]);
        }
        // Truncate long names
        return (item[labelKey] || "N/A").toString().substring(0, 5);
      }),
      datasets: [
        {
          data: limitedData.map((item) => {
            if (valueKey === "id") return 1; // Count for users
            if (activeTab === "productos")
              return item.cantidad * item.precioUnidad;
            return typeof item[valueKey] === "number" ? item[valueKey] : 0;
          }),
        },
      ],
    };
  }, [
    activeTab,
    movimientos,
    inventarios,
    users,
    selectedPeriod,
    filterDataByPeriod,
    formatDateByPeriod,
  ]);

  // Prepare progress chart data based on active tab
  const prepareProgressData = useCallback(() => {
    let labels = [];
    let data = [];

    switch (activeTab) {
      case "movimientos":
        // For movements, show income vs expense ratio
        if (movimientos && movimientos.length > 0) {
          const income = movimientos
            .filter((m) => m.monto > 0)
            .reduce((sum, m) => sum + m.monto, 0);
          const expense = Math.abs(
            movimientos
              .filter((m) => m.monto < 0)
              .reduce((sum, m) => sum + m.monto, 0)
          );
          const total = income + expense;

          labels = ["Ingresos", "Gastos", "Balance"];
          data = [
            income / (total || 1),
            expense / (total || 1),
            Math.max(0, (income - expense) / (total || 1)),
          ];
        } else {
          labels = ["Ingresos", "Gastos", "Balance"];
          data = [0.33, 0.33, 0.33];
        }
        break;

      case "productos":
        // For products, show stock levels
        if (inventarios && inventarios.length > 0) {
          const totalStock = inventarios.reduce(
            (sum, item) => sum + item.cantidad,
            0
          );
          const lowStock = inventarios.filter(
            (item) => item.cantidad < 10
          ).length;
          const mediumStock = inventarios.filter(
            (item) => item.cantidad >= 10 && item.cantidad < 50
          ).length;
          const highStock = inventarios.filter(
            (item) => item.cantidad >= 50
          ).length;

          labels = ["Stock Bajo", "Stock Medio", "Stock Alto"];
          data = [
            lowStock / inventarios.length,
            mediumStock / inventarios.length,
            highStock / inventarios.length,
          ];
        } else {
          labels = ["Stock Bajo", "Stock Medio", "Stock Alto"];
          data = [0.33, 0.33, 0.33];
        }
        break;

      case "usuarios":
        // For users, show active vs inactive
        if (users && users.length > 0) {
          const active = users.filter((user) => user.activo).length;
          const inactive = users.length - active;
          const recent = users.filter((user) => {
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            return new Date(user.createdAt) >= oneMonthAgo;
          }).length;

          labels = ["Activos", "Inactivos", "Recientes"];
          data = [
            active / users.length,
            inactive / users.length,
            recent / users.length,
          ];
        } else {
          labels = ["Activos", "Inactivos", "Recientes"];
          data = [0.33, 0.33, 0.33];
        }
        break;

      default:
        labels = ["Métrica 1", "Métrica 2", "Métrica 3"];
        data = [0.33, 0.33, 0.33];
    }

    return {
      labels,
      data,
      colors: ["#48BB78", "#4299E1", "#ED8936"],
    };
  }, [activeTab, movimientos, inventarios, users]);

  // Prepare pie chart data based on active tab
  const preparePieChartData = useCallback(() => {
    let chartData = [];

    switch (activeTab) {
      case "movimientos":
        // Group movements by type or amount range
        if (movimientos && movimientos.length > 0) {
          const categories = {
            "Ingresos Altos": 0,
            "Ingresos Medios": 0,
            "Ingresos Bajos": 0,
            "Gastos Altos": 0,
            "Gastos Medios": 0,
            "Gastos Bajos": 0,
          };

          movimientos.forEach((item) => {
            const amount = item.monto;
            let category;

            if (amount > 0) {
              if (amount > 1000) category = "Ingresos Altos";
              else if (amount > 500) category = "Ingresos Medios";
              else category = "Ingresos Bajos";
            } else {
              const absAmount = Math.abs(amount);
              if (absAmount > 1000) category = "Gastos Altos";
              else if (absAmount > 500) category = "Gastos Medios";
              else category = "Gastos Bajos";
            }

            categories[category] += Math.abs(amount);
          });

          const colors = [
            "#48BB78",
            "#68D391",
            "#9AE6B4",
            "#F56565",
            "#FC8181",
            "#FEB2B2",
          ];

          chartData = Object.keys(categories)
            .filter((key) => categories[key] > 0)
            .map((category, index) => ({
              name: category,
              population: categories[category],
              color: colors[index % colors.length],
              legendFontColor: "#7F7F7F",
              legendFontSize: 12,
            }));
        }
        break;

      case "productos":
        // Group products by price range
        if (inventarios && inventarios.length > 0) {
          const categories = {
            Lujo: 0,
            Premium: 0,
            "Costo medio": 0,
            "Bajo costo": 0,
          };

          inventarios.forEach((item) => {
            const value = item.precioUnidad;
            let category;

            if (value >= 1000) category = "Lujo";
            else if (value >= 500) category = "Premium";
            else if (value >= 100) category = "Costo medio";
            else category = "Bajo costo";

            categories[category] += item.cantidad * item.precioUnidad;
          });

          const colors = ["#9F7AEA", "#4299E1", "#48BB78", "#ECC94B"];

          chartData = Object.keys(categories)
            .filter((key) => categories[key] > 0)
            .map((category, index) => ({
              name: category,
              population: categories[category],
              color: colors[index % colors.length],
              legendFontColor: "#7F7F7F",
              legendFontSize: 12,
            }));
        }
        break;

      case "usuarios":
        // Group users by join date
        if (users && users.length > 0) {
          const categories = {
            "Este mes": 0,
            "Último trimestre": 0,
            "Este año": 0,
            Antiguos: 0,
          };

          const now = new Date();
          const oneMonthAgo = new Date(now);
          oneMonthAgo.setMonth(now.getMonth() - 1);

          const threeMonthsAgo = new Date(now);
          threeMonthsAgo.setMonth(now.getMonth() - 3);

          const oneYearAgo = new Date(now);
          oneYearAgo.setFullYear(now.getFullYear() - 1);

          users.forEach((user) => {
            const joinDate = new Date(user.createdAt);
            let category;

            if (joinDate >= oneMonthAgo) category = "Este mes";
            else if (joinDate >= threeMonthsAgo) category = "Último trimestre";
            else if (joinDate >= oneYearAgo) category = "Este año";
            else category = "Antiguos";

            categories[category]++;
          });

          const colors = ["#48BB78", "#4299E1", "#ECC94B", "#9F7AEA"];

          chartData = Object.keys(categories)
            .filter((key) => categories[key] > 0)
            .map((category, index) => ({
              name: category,
              population: categories[category],
              color: colors[index % colors.length],
              legendFontColor: "#7F7F7F",
              legendFontSize: 12,
            }));
        }
        break;

      default:
        chartData = [
          {
            name: "Sin datos",
            population: 100,
            color: "#CCCCCC",
            legendFontColor: "#7F7F7F",
            legendFontSize: 12,
          },
        ];
    }

    // If no data, return placeholder
    if (chartData.length === 0) {
      chartData = [
        {
          name: "Sin datos",
          population: 100,
          color: "#CCCCCC",
          legendFontColor: "#7F7F7F",
          legendFontSize: 12,
        },
      ];
    }

    return chartData;
  }, [activeTab, movimientos, inventarios, users]);

  // Stats cards data
  const stats = [
    {
      title: "Total Usuarios",
      value: users ? users.length.toString() : "0",
      change: calculateUserChange(),
      icon: "account",
    },
    {
      title: "Valor Inventario",
      value: `$${calculateInventoryValue().toLocaleString()}`,
      change: calculateInventoryChange(),
      icon: "cart-outline",
    },
    {
      title: "Productos",
      value: inventarios ? inventarios.length.toString() : "0",
      change:
        inventarios && inventarios.length > 0
          ? `+${Math.round(inventarios.length / 10)}%`
          : "0%",
      icon: "package-variant",
    },
    {
      title: "Saldo",
      value: `$${calculateAccountBalance().toLocaleString()}`,
      change: calculateAccountChange(),
      icon: "chart-line",
    },
  ];

  // Chart configuration
  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(107, 217, 254, ${opacity})`,
    strokeWidth: 2,
    decimalPlaces: 0,
    propsForLabels: {
      fontSize: 12,
    },
    propsForBackgroundLines: {
      strokeDasharray: "",
    },
  };

  // Responsive card width
  const getCardWidth = () => {
    if (screenWidth >= 1200) return "23%";
    if (screenWidth >= 768) return "48%";
    return "100%";
  };

  // Animated styles for charts
  const lineChartStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        periodChangeAnimation.value,
        [0, 1],
        [0.5, 1],
        Extrapolate.CLAMP
      ),
      transform: [
        {
          translateY: interpolate(
            periodChangeAnimation.value,
            [0, 1],
            [20, 0],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const barChartStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        tabChangeAnimation.value,
        [0, 1],
        [0.5, 1],
        Extrapolate.CLAMP
      ),
      transform: [
        {
          translateX: interpolate(
            tabChangeAnimation.value,
            [0, 1],
            [20, 0],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const pieChartStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        tabChangeAnimation.value,
        [0, 1],
        [0.5, 1],
        Extrapolate.CLAMP
      ),
      transform: [
        {
          scale: interpolate(
            tabChangeAnimation.value,
            [0, 1],
            [0.95, 1],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  // Get tab title based on active tab
  const getTabTitle = () => {
    switch (activeTab) {
      case "movimientos":
        return "Movimientos Financieros";
      case "productos":
        return "Análisis de Inventario";
      case "usuarios":
        return "Actividad de Usuarios";
      default:
        return "Análisis Detallado";
    }
  };

  // Get period title
  const getPeriodTitle = () => {
    switch (selectedPeriod) {
      case "daily":
        return "Hoy";
      case "weekly":
        return "Esta Semana";
      case "monthly":
        return "Este Mes";
      case "yearly":
        return "Este Año";
      default:
        return "Período";
    }
  };

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "movimientos":
        return (
          <DataTable>
            <DataTable.Header>
              <DataTable.Title textStyle={styles.cellText}>
                Fecha
              </DataTable.Title>
              <DataTable.Title textStyle={styles.cellText} numeric>
                Monto
              </DataTable.Title>
              <DataTable.Title textStyle={styles.cellText}>
                Tipo
              </DataTable.Title>
            </DataTable.Header>
            {movimientos && movimientos.length > 0 ? (
              filterDataByPeriod(movimientos).map((item, index) => (
                <DataTable.Row key={index}>
                  <DataTable.Cell textStyle={styles.cellText}>
                    {new Date(item.fecha).toLocaleDateString()}
                  </DataTable.Cell>
                  <DataTable.Cell textStyle={styles.cellText} numeric>
                    ${item.monto.toLocaleString()}
                  </DataTable.Cell>
                  <DataTable.Cell textStyle={styles.cellText}>
                    <Chip
                      mode="outlined"
                      style={{
                        backgroundColor: item.monto > 0 ? "#E6FFFA" : "#FFF5F5",
                      }}
                    >
                      {item.monto > 0 ? "Ingreso" : "Egreso"}
                    </Chip>
                  </DataTable.Cell>
                </DataTable.Row>
              ))
            ) : (
              <DataTable.Row>
                <DataTable.Cell textStyle={styles.cellText}>
                  No hay datos disponibles
                </DataTable.Cell>
              </DataTable.Row>
            )}
          </DataTable>
        );
      case "productos":
        return (
          <DataTable>
            <DataTable.Header>
              <DataTable.Title textStyle={styles.cellText}>
                Producto
              </DataTable.Title>
              <DataTable.Title textStyle={styles.cellText}>
                Descripción
              </DataTable.Title>
              <DataTable.Title textStyle={styles.cellText} numeric>
                Precio
              </DataTable.Title>
              <DataTable.Title textStyle={styles.cellText} numeric>
                Stock
              </DataTable.Title>
            </DataTable.Header>
            {filteredInventory().length > 0 ? (
              filteredInventory().map((item, index) => (
                <DataTable.Row key={index}>
                  <DataTable.Cell textStyle={styles.cellText}>
                    {item.nombreMaterial}
                  </DataTable.Cell>
                  <DataTable.Cell textStyle={styles.cellText}>
                    {item.descripcion}
                  </DataTable.Cell>
                  <DataTable.Cell textStyle={styles.cellText} numeric>
                    ${item.precioUnidad.toLocaleString()}
                  </DataTable.Cell>
                  <DataTable.Cell textStyle={styles.cellText} numeric>
                    <Chip
                      mode="outlined"
                      style={{
                        backgroundColor:
                          item.cantidad > 10 ? "#E6FFFA" : "#FFF5F5",
                      }}
                    >
                      {item.cantidad}
                    </Chip>
                  </DataTable.Cell>
                </DataTable.Row>
              ))
            ) : (
              <DataTable.Row>
                <DataTable.Cell textStyle={styles.cellText}>
                  No hay productos disponibles
                </DataTable.Cell>
              </DataTable.Row>
            )}
          </DataTable>
        );
      case "usuarios":
        return (
          <DataTable>
            <DataTable.Header>
              <DataTable.Title textStyle={styles.cellText}>
                Usuario
              </DataTable.Title>
              <DataTable.Title textStyle={styles.cellText}>
                Email
              </DataTable.Title>
              <DataTable.Title textStyle={styles.cellText}>
                Fecha
              </DataTable.Title>
              <DataTable.Title textStyle={styles.cellText}>
                Estado
              </DataTable.Title>
            </DataTable.Header>
            {users && users.length > 0 ? (
              filterDataByPeriod(users, "createdAt").map((user, index) => (
                <DataTable.Row key={index}>
                  <DataTable.Cell textStyle={styles.cellText}>
                    {user.nombre || user.username || "Usuario"}
                  </DataTable.Cell>
                  <DataTable.Cell textStyle={styles.cellText}>
                    {user.email || "N/A"}
                  </DataTable.Cell>
                  <DataTable.Cell textStyle={styles.cellText}>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Chip
                      mode="outlined"
                      style={{
                        backgroundColor: user.estado ? "#E6FFFA" : "#FFF5F5",
                      }}
                    >
                      {user.estado ? "Activo" : "Inactivo"}
                    </Chip>
                  </DataTable.Cell>
                </DataTable.Row>
              ))
            ) : (
              <DataTable.Row>
                <DataTable.Cell textStyle={styles.cellText}>
                  No hay usuarios disponibles
                </DataTable.Cell>
              </DataTable.Row>
            )}
          </DataTable>
        );
      default:
        return null;
    }
  };

  // Get chart title based on active tab
  const getChartTitle = () => {
    switch (activeTab) {
      case "movimientos":
        return `Movimientos - ${getPeriodTitle()}`;
      case "productos":
        return `Inventario - ${getPeriodTitle()}`;
      case "usuarios":
        return `Usuarios - ${getPeriodTitle()}`;
      default:
        return `Análisis - ${getPeriodTitle()}`;
    }
  };

  return (
    <PaperProvider>
      {isLoading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6bd9fe" />
          <Text style={styles.loadingText}>Cargando dashboard...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onScroll={(event) => {
            scrollY.value = event.nativeEvent.contentOffset.y;
          }}
          scrollEventThrottle={16}
          ref={scrollViewRef}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.headerSubtitle}>
                {new Date().toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.statsGrid}>
              {stats.map((stat, index) => (
                <AnimatedSurface
                  key={index}
                  style={[styles.statCard, { width: getCardWidth() }]}
                  entering={FadeInUp.delay(index * 100)}
                  elevation={2}
                >
                  <View
                    style={[
                      styles.statIconContainer,
                      {
                        backgroundColor: stat.change.includes("+")
                          ? "#F0FFF4"
                          : "#FFF5F5",
                      },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={stat.icon}
                      size={22}
                      color="#6bd9fe"
                    />
                  </View>
                  <Text style={styles.statTitle}>{stat.title}</Text>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Chip
                    mode="flat"
                    textStyle={styles.changeText}
                    style={[
                      styles.changeChip,
                      {
                        backgroundColor: stat.change.includes("+")
                          ? "#E6FFFA"
                          : "#FFF5F5",
                      },
                    ]}
                  >
                    {stat.change}
                  </Chip>
                </AnimatedSurface>
              ))}
            </View>

            <View style={styles.tabContainer}>
              {[
                {
                  id: "movimientos",
                  label: "Movimientos",
                  icon: "cash-multiple",
                },
                {
                  id: "productos",
                  label: "Productos",
                  icon: "package-variant",
                },
                { id: "usuarios", label: "Usuarios", icon: "account-group" },
              ].map((tab) => (
                <AnimatedTouchable
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id)}
                  style={[
                    styles.mainTab,
                    activeTab === tab.id && styles.activeMainTab,
                  ]}
                >
                  <MaterialCommunityIcons
                    name={tab.icon}
                    size={20}
                    color={activeTab === tab.id ? "#6bd9fe" : "#718096"}
                  />
                  <Text
                    style={[
                      styles.mainTabText,
                      activeTab === tab.id && styles.activeMainTabText,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </AnimatedTouchable>
              ))}
            </View>

            <View style={styles.periodSelector}>
              {["daily", "weekly", "monthly", "yearly"].map((period) => (
                <TouchableOpacity
                  key={period}
                  onPress={() => setSelectedPeriod(period)}
                  style={[
                    styles.periodButton,
                    selectedPeriod === period && styles.periodButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.periodButtonText,
                      selectedPeriod === period &&
                        styles.periodButtonTextActive,
                    ]}
                  >
                    {period === "daily"
                      ? "Diario"
                      : period === "weekly"
                      ? "Semanal"
                      : period === "monthly"
                      ? "Mensual"
                      : "Anual"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Animated.View style={[styles.card, lineChartStyle]}>
              <Text style={styles.cardTitle}>{getChartTitle()}</Text>
              <LineChart
                data={prepareLineChartData()}
                width={
                  Platform.OS === "android"
                    ? screenWidth * 0.8
                    : screenWidth * 0.89
                }
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
                withInnerLines={false}
                withOuterLines={true}
                withDots={true}
                withShadow={true}
                onDataPointClick={({ value, index }) => {
                  // Show tooltip or detail on click
                  alert(
                    `Valor: ${value}\nPeríodo: ${
                      prepareLineChartData().labels[index]
                    }`
                  );
                }}
              />
            </Animated.View>

            <Animated.View style={[styles.card, barChartStyle]}>
              <Text style={styles.cardTitle}>
                {activeTab === "movimientos"
                  ? "Análisis de Transacciones"
                  : activeTab === "productos"
                  ? "Valor de Inventario por Producto"
                  : "Actividad de Usuarios"}
              </Text>
              <BarChart
                data={prepareBarChartData()}
                width={
                  Platform.OS === "android"
                    ? screenWidth * 0.8
                    : screenWidth * 0.89
                }
                height={220}
                chartConfig={{
                  ...chartConfig,
                  color: (opacity = 1) => `rgba(107, 217, 254, ${opacity})`,
                }}
                style={styles.chart}
                showBarTops={false}
                withInnerLines={false}
                fromZero={true}
                showValuesOnTopOfBars={true}
              />
            </Animated.View>

            <Animated.View style={[styles.card, pieChartStyle]}>
              <Text style={styles.cardTitle}>
                {activeTab === "movimientos"
                  ? "Distribución de Movimientos"
                  : activeTab === "productos"
                  ? "Categorías de Productos"
                  : "Distribución de Usuarios"}
              </Text>
              <PieChart
                data={preparePieChartData()}
                width={screenWidth - 40}
                height={220}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </Animated.View>

            <Animated.View style={styles.card} entering={FadeIn.delay(600)}>
              <Text style={styles.cardTitle}>{getTabTitle()}</Text>
              <View style={styles.tabContent}>{renderTabContent()}</View>
            </Animated.View>
          </View>
        </ScrollView>
      )}
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7FAFC",
  },
  loadingText: {
    marginTop: 10,
    color: "#2D3748",
    fontSize: 16,
  },
  content: {
    padding: 16,
    paddingTop: 10,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2D3748",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#718096",
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchBar: {
    elevation: 0,
    backgroundColor: "white",
    borderRadius: 8,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  statIconContainer: {
    borderRadius: 8,
    padding: 8,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 14,
    color: "#718096",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2D3748",
    marginBottom: 4,
  },
  changeChip: {
    alignSelf: "flex-start",
    height: 30,
  },
  changeText: {
    fontSize: 15,
    color: "black",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#2D3748",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  periodSelector: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#EDF2F7",
    borderRadius: 8,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  periodButtonActive: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  periodButtonText: {
    textAlign: "center",
    color: "#718096",
    fontSize: 14,
  },
  periodButtonTextActive: {
    color: "#2D3748",
    fontWeight: "600",
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#EDF2F7",
    borderRadius: 8,
    padding: 4,
  },
  mainTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 6,
  },
  activeMainTab: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  mainTabText: {
    textAlign: "center",
    color: "#718096",
    fontSize: 14,
  },
  activeMainTabText: {
    color: "#2D3748",
    fontWeight: "600",
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#6bd9fe",
  },
  tabText: {
    textAlign: "center",
    color: "#718096",
    fontSize: 14,
  },
  activeTabText: {
    color: "black",
    fontWeight: "600",
  },
  cellText: {
    color: "black",
  },
  tabContent: {
    marginTop: 16,
  },
});

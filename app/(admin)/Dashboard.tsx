import React, { useState, useCallback, useRef } from "react";
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
import {
  LineChart,
  ProgressChart,
  BarChart,
  PieChart,
} from "react-native-chart-kit";
import Animated, { FadeInUp, useSharedValue } from "react-native-reanimated";
import {
  PaperProvider,
  Surface,
  Chip,
  DataTable,
  Searchbar,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { getDashboard } from "@/services/adminServices";

const AnimatedSurface = Animated.createAnimatedComponent(Surface);

// Datos simulados
const salesData = [
  { date: "2023-01-01", amount: 1200 },
  { date: "2023-01-02", amount: 1800 },
  { date: "2023-01-03", amount: 2400 },
  { date: "2023-01-04", amount: 1600 },
  { date: "2023-01-05", amount: 2200 },
  { date: "2023-01-06", amount: 2800 },
  { date: "2023-01-07", amount: 3200 },
];

const productData = [
  { id: 1, name: "Laptop Pro", sales: 120, revenue: 144000, stock: 50 },
  { id: 2, name: "Smartphone X", sales: 200, revenue: 100000, stock: 30 },
  { id: 3, name: "Wireless Earbuds", sales: 300, revenue: 30000, stock: 100 },
  { id: 4, name: "Smart Watch", sales: 150, revenue: 45000, stock: 75 },
  { id: 5, name: "Tablet Mini", sales: 80, revenue: 32000, stock: 25 },
];

const customerData = [
  {
    id: 1,
    name: "Juan Pérez",
    totalPurchases: 5200,
    lastPurchase: "2023-06-15",
    status: "Active",
  },
  {
    id: 2,
    name: "María García",
    totalPurchases: 3800,
    lastPurchase: "2023-06-10",
    status: "Inactive",
  },
  {
    id: 3,
    name: "Carlos López",
    totalPurchases: 6700,
    lastPurchase: "2023-06-18",
    status: "Active",
  },
  {
    id: 4,
    name: "Ana Martínez",
    totalPurchases: 2900,
    lastPurchase: "2023-06-05",
    status: "Active",
  },
  {
    id: 5,
    name: "Pedro Sánchez",
    totalPurchases: 4100,
    lastPurchase: "2023-06-12",
    status: "Active",
  },
];

export default function AnalyticsDashboardPro() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [searchQuery, setSearchQuery] = useState("");
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("sales");
  const { width: screenWidth } = useWindowDimensions();
  const scrollY = useSharedValue(0);
  const scrollViewRef = useRef(null);
  const [data, setData] = useState({});
  const [users, setUsers] = useState([]);
  const [inventario, setInventario] = useState([]);
  const [account, setAccount] = useState([]);
  const [motions, setMotions] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const datos = await getDashboard();
        setUsers(datos.users);
        setInventario(datos.inventarios);
        setAccount(datos.accounts);
        setMotions(datos.movimientos);
        setData(datos);
      };
      fetchData();
    }, [])
  );

  console.log(data);
  let p;
  const lineChartData = {
    labels: salesData.map((item) => item.date.slice(5)),
    datasets: [
      {
        data: salesData.map((item) => item.amount),
        color: () => "#6bd9fe",
        strokeWidth: 2,
      },
    ],
  };

  const barData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43, 50],
      },
    ],
  };

  const progressData = {
    labels: ["Sales", "Visits", "Conversions"],
    data: [0.8, 0.6, 0.4],
    colors: ["#48BB78", "#4299E1", "#ED8936"],
  };
 
  const pieChartData = [
    {
      name: "Electronics",
      population: 35,
      color: "#48BB78",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "Clothing",
      population: 25,
      color: "#4299E1",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "Books",
      population: 20,
      color: "#ED8936",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "Home",
      population: 15,
      color: "#ECC94B",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
    {
      name: "Others",
      population: 5,
      color: "#9F7AEA",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12,
    },
  ];

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: () => "#6bd9fe",
    strokeWidth: 2,
    decimalPlaces: 0,
    propsForLabels: {
      fontSize: 12,
    },
    propsForBackgroundLines: {
      strokeDasharray: "",
    },
  };

  const stats = [
    {
      title: "Total Usuarios",
      value: `${users && users.length}`,
      change: `${(
        ((u =
          users.filter(
            (user) =>
              new Date(user.createdAt) >=
              new Date(
                new Date().getFullYear(),
                new Date().getMonth() - 1,
                new Date().getDate()
              )
          ).length -
          (p = users.filter(
            (user) =>
              new Date(user.createdAt) <
              new Date(
                new Date().getFullYear(),
                new Date().getMonth() - 1,
                new Date().getDate()
              )
          ).length)) /
          p) *
        100
      ).toFixed(1)}%`,
      icon: "account",
    },
    {
      title: "Total Valor Inventario",
      value: `${
        inventario &&
        inventario.reduce((sum, item) => {
          const itemTotal = item.cantidad * item.precioUnidad;
          return sum + itemTotal;
        }, 0)
      }`,
      change: `sadasdds`,
      icon: "cart-outline",
    },
    {
      title: "Total ",
      value:`${
        inventario &&
        inventario.reduce((sum, item) => {
          const itemTotal = item.cantidad * item.precioUnidad;
          return sum + itemTotal;
        }, 0)
      }`,
      change: "+15.3%",
      icon: "eye-outline",
    },
    { title: "Saldo", value: `${
      account && account.reduce((sum, item) => {
        return sum + (item.saldo || 0)
      }, 0)
      }`, change: `${
    account && account.length > 1 ? (() => {
      const sortedAccount = [...account].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      const currentSaldo = sortedAccount[0].saldo;
      const previousSaldo = sortedAccount[1].saldo;
      const changePercentage = previousSaldo === 0 ? 0 : ((currentSaldo - previousSaldo) / previousSaldo) * 100;
      return `${changePercentage.toFixed(1)}%`;
    })() : "0.0%"
  }`, icon: "chart-line" },
  ];

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simular una actualización de datos
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const getCardWidth = () => {
    if (screenWidth >= 1200) return "23%";
    if (screenWidth >= 768) return "48%";
    return "100%";
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "sales":
        return (
          <DataTable>
            <DataTable.Header>
              <DataTable.Title textStyle={styles.cellText}>
                Date
              </DataTable.Title>
              <DataTable.Title textStyle={styles.cellText} numeric>
                Amount
              </DataTable.Title>
            </DataTable.Header>
            {salesData.map((item, index) => (
              <DataTable.Row key={index}>
                <DataTable.Cell textStyle={styles.cellText}>
                  {item.date}
                </DataTable.Cell>
                <DataTable.Cell textStyle={styles.cellText} numeric>
                  ${item.amount}
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        );
      case "products":
        return (
          <DataTable>
            <DataTable.Header>
              <DataTable.Title textStyle={styles.cellText}>
                Product
              </DataTable.Title>
              <DataTable.Title textStyle={styles.cellText} numeric>
                Sales
              </DataTable.Title>
              <DataTable.Title textStyle={styles.cellText} numeric>
                Revenue
              </DataTable.Title>
              <DataTable.Title textStyle={styles.cellText} numeric>
                Stock
              </DataTable.Title>
            </DataTable.Header>
            {productData.map((item) => (
              <DataTable.Row key={item.id}>
                <DataTable.Cell textStyle={styles.cellText}>
                  {item.name}
                </DataTable.Cell>
                <DataTable.Cell textStyle={styles.cellText} numeric>
                  {item.sales}
                </DataTable.Cell>
                <DataTable.Cell textStyle={styles.cellText} numeric>
                  ${item.revenue}
                </DataTable.Cell>
                <DataTable.Cell textStyle={styles.cellText} numeric>
                  {item.stock}
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        );
      case "customers":
        return (
          <DataTable>
            <DataTable.Header>
              <DataTable.Title textStyle={styles.cellText}>
                Name
              </DataTable.Title>
              <DataTable.Title textStyle={styles.cellText} numeric>
                Total Purchases
              </DataTable.Title>
              <DataTable.Title textStyle={styles.cellText}>
                Last Purchase
              </DataTable.Title>
              <DataTable.Title textStyle={styles.cellText}>
                Status
              </DataTable.Title>
            </DataTable.Header>
            {customerData.map((item) => (
              <DataTable.Row key={item.id}>
                <DataTable.Cell textStyle={styles.cellText}>
                  {item.name}
                </DataTable.Cell>
                <DataTable.Cell textStyle={styles.cellText} numeric>
                  ${item.totalPurchases}
                </DataTable.Cell>
                <DataTable.Cell textStyle={styles.cellText}>
                  {item.lastPurchase}
                </DataTable.Cell>
                <DataTable.Cell>
                  <Chip
                    mode="outlined"
                    style={{
                      backgroundColor:
                        item.status === "Active" ? "#E6FFFA" : "#FFF5F5",
                    }}
                  >
                    {item.status}
                  </Chip>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        );
      default:
        return null;
    }
  };

  return (
    <PaperProvider>
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
          <View style={styles.searchContainer}>
            <Searchbar
              placeholder="Search..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchBar}
            />
          </View>

          {/* Header Stats */}
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <AnimatedSurface
                key={index}
                style={[styles.statCard, { width: getCardWidth() }]}
                entering={FadeInUp.delay(index * 100)}
                elevation={2}
              >
                <View style={styles.statIconContainer}>
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

          {/* Chart Period Selector */}
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
                    selectedPeriod === period && styles.periodButtonTextActive,
                  ]}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Line Chart */}
          <Animated.View entering={FadeInUp.delay(200)} style={styles.card}>
            <Text style={styles.cardTitle}>Revenue Overview</Text>
            <LineChart
              data={lineChartData}
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
            />
          </Animated.View>

          {/* Bar Chart */}
          <Animated.View entering={FadeInUp.delay(300)} style={styles.card}>
            <Text style={styles.cardTitle}>Weekly Performance</Text>
            <BarChart
              data={barData}
              width={
                Platform.OS === "android"
                  ? screenWidth * 0.8
                  : screenWidth * 0.89
              }
              height={220}
              chartConfig={{
                ...chartConfig,
                color: () => "#6bd9fe",
              }}
              style={styles.chart}
              showBarTops={false}
              withInnerLines={false}
            />
          </Animated.View>

          {/* Progress Chart */}
          <Animated.View entering={FadeInUp.delay(400)} style={styles.card}>
            <Text style={styles.cardTitle}>Key Metrics</Text>
            <ProgressChart
              data={progressData}
              width={screenWidth - 40}
              height={220}
              strokeWidth={16}
              radius={32}
              chartConfig={chartConfig}
              hideLegend={false}
              style={styles.chart}
            />
          </Animated.View>

          {/* Pie Chart */}
          <Animated.View entering={FadeInUp.delay(500)} style={styles.card}>
            <Text style={styles.cardTitle}>Sales Distribution</Text>
            <PieChart
              data={pieChartData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </Animated.View>

          {/* Detailed Analytics Tabs */}
          <Animated.View entering={FadeInUp.delay(600)} style={styles.card}>
            <Text style={styles.cardTitle}>Detailed Analytics</Text>
            <View style={styles.tabContainer}>
              {["sales", "products", "customers"].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={[styles.tab, activeTab === tab && styles.activeTab]}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === tab && styles.activeTabText,
                    ]}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.tabContent}>{renderTabContent()}</View>
          </Animated.View>
        </View>
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },

  content: {
    padding: 16,
    paddingTop: 10,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchBar: {
    elevation: 0,
    backgroundColor: "white",
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
    backgroundColor: "#F0FFF4",
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
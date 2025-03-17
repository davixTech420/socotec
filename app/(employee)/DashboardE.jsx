import { useState, useEffect } from "react"
import { ScrollView, View, Text, StyleSheet, Dimensions, TouchableOpacity, RefreshControl } from "react-native"
import { ProgressBar } from "react-native-paper"
import { LineChart, PieChart } from "react-native-chart-kit"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  interpolate,
  Extrapolate,
} from "react-native-reanimated"
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons"

const { width } = Dimensions.get("window")
const chartWidth = width - 40

const DashboardE = () => {
  const [refreshing, setRefreshing] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState("week")
  const [expandedSection, setExpandedSection] = useState(null)

  // Animation values
  const headerOpacity = useSharedValue(0)
  const kpiOpacity = useSharedValue(0)
  const statsOpacity = useSharedValue(0)
  const chartOpacity = useSharedValue(0)
  const progressOpacity = useSharedValue(0)
  const refreshRotation = useSharedValue(0)

  // Animate on component mount
  useEffect(() => {
    const animationSequence = async () => {
      headerOpacity.value = withTiming(1, { duration: 400 })
      kpiOpacity.value = withDelay(100, withTiming(1, { duration: 400 }))
      statsOpacity.value = withDelay(200, withTiming(1, { duration: 400 }))
      chartOpacity.value = withDelay(300, withTiming(1, { duration: 400 }))
      progressOpacity.value = withDelay(400, withTiming(1, { duration: 400 }))
    }

    animationSequence()
  }, [])

  const onRefresh = () => {
    setRefreshing(true)
    refreshRotation.value = withSequence(withTiming(2 * Math.PI, { duration: 1000 }), withTiming(0, { duration: 0 }))

    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false)
    }, 1500)
  }

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  // Animated styles
  const headerStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [
      {
        translateY: interpolate(headerOpacity.value, [0, 1], [-20, 0], Extrapolate.CLAMP),
      },
    ],
  }))

  const kpiStyle = useAnimatedStyle(() => ({
    opacity: kpiOpacity.value,
    transform: [
      {
        translateY: interpolate(kpiOpacity.value, [0, 1], [20, 0], Extrapolate.CLAMP),
      },
    ],
  }))

  const statsStyle = useAnimatedStyle(() => ({
    opacity: statsOpacity.value,
    transform: [
      {
        translateY: interpolate(statsOpacity.value, [0, 1], [20, 0], Extrapolate.CLAMP),
      },
    ],
  }))

  const chartStyle = useAnimatedStyle(() => ({
    opacity: chartOpacity.value,
    transform: [
      {
        translateY: interpolate(chartOpacity.value, [0, 1], [20, 0], Extrapolate.CLAMP),
      },
    ],
  }))

  const progressStyle = useAnimatedStyle(() => ({
    opacity: progressOpacity.value,
    transform: [
      {
        translateY: interpolate(progressOpacity.value, [0, 1], [20, 0], Extrapolate.CLAMP),
      },
    ],
  }))

  const refreshIconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${refreshRotation.value}rad` }],
  }))

  // Chart data based on selected period
  const getChartData = () => {
    switch (selectedPeriod) {
      case "day":
        return {
          labels: ["8am", "12pm", "4pm", "8pm"],
          datasets: [{ data: [25, 40, 65, 45] }],
        }
      case "week":
        return {
          labels: ["Mon", "Wed", "Fri", "Sun"],
          datasets: [{ data: [30, 28, 99, 50] }],
        }
      case "month":
        return {
          labels: ["W1", "W2", "W3", "W4"],
          datasets: [{ data: [40, 65, 53, 80] }],
        }
      default:
        return {
          labels: ["Q1", "Q2", "Q3", "Q4"],
          datasets: [{ data: [45, 80, 60, 95] }],
        }
    }
  }

  // Pie chart data
  const pieChartData = [
    {
      name: "",
      population: 39,
      color: "#7F3DFF",
      legendFontColor: "#7F3DFF",
      legendFontSize: 0,
    },
    {
      name: "",
      population: 19,
      color: "#FF7A00",
      legendFontColor: "#FF7A00",
      legendFontSize: 0,
    },
    {
      name: "",
      population: 37,
      color: "#00D1FF",
      legendFontColor: "#00D1FF",
      legendFontSize: 0,
    },
  ]

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(127, 61, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.7,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    propsForLabels: {
      fontSize: 10,
    },
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, headerStyle]}>
        <View>
          <Text style={styles.headerDate}>March 17, 2025</Text>
          <Text style={styles.headerTitle}>Analytics</Text>
        </View>
        <TouchableOpacity onPress={onRefresh} disabled={refreshing} style={styles.refreshButton}>
          <Animated.View style={refreshIconStyle}>
            <Feather name="refresh-cw" size={18} color="#7F3DFF" />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#7F3DFF"]} tintColor="#7F3DFF" />
        }
      >
        {/* Main KPI */}
        <Animated.View style={[styles.section, kpiStyle]}>
          <View style={styles.kpiRow}>
            <View style={styles.kpiCard}>
              <View style={styles.kpiContent}>
                <Text style={styles.kpiValue}>
                  86<Text style={styles.kpiUnit}>%</Text>
                </Text>
                <Text style={styles.kpiLabel}>Performance</Text>
              </View>
              <View style={[styles.kpiIconContainer, { backgroundColor: "rgba(127, 61, 255, 0.1)" }]}>
                <MaterialCommunityIcons name="trending-up" size={24} color="#7F3DFF" />
              </View>
            </View>

            <View style={styles.kpiCard}>
              <View style={styles.kpiContent}>
                <Text style={styles.kpiValue}>
                  39<Text style={styles.kpiUnit}>%</Text>
                </Text>
                <Text style={styles.kpiLabel}>Engagement</Text>
              </View>
              <View style={[styles.kpiIconContainer, { backgroundColor: "rgba(0, 209, 255, 0.1)" }]}>
                <MaterialCommunityIcons name="account-group" size={24} color="#00D1FF" />
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Time Period Selector */}
        <Animated.View style={[styles.section, statsStyle]}>
          <View style={styles.periodSelector}>
            <TouchableOpacity
              style={[styles.periodButton, selectedPeriod === "day" && styles.activePeriod]}
              onPress={() => setSelectedPeriod("day")}
            >
              <Text style={[styles.periodText, selectedPeriod === "day" && styles.activePeriodText]}>Day</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.periodButton, selectedPeriod === "week" && styles.activePeriod]}
              onPress={() => setSelectedPeriod("week")}
            >
              <Text style={[styles.periodText, selectedPeriod === "week" && styles.activePeriodText]}>Week</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.periodButton, selectedPeriod === "month" && styles.activePeriod]}
              onPress={() => setSelectedPeriod("month")}
            >
              <Text style={[styles.periodText, selectedPeriod === "month" && styles.activePeriodText]}>Month</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.periodButton, selectedPeriod === "year" && styles.activePeriod]}
              onPress={() => setSelectedPeriod("year")}
            >
              <Text style={[styles.periodText, selectedPeriod === "year" && styles.activePeriodText]}>Year</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Stats Cards */}
        <Animated.View style={[styles.section, statsStyle]}>
          <View style={styles.statsRow}>
            <TouchableOpacity style={styles.statCard} activeOpacity={0.7} onPress={() => toggleSection("sessions")}>
              <Text style={styles.statValue}>30k</Text>
              <Text style={styles.statLabel}>Sessions</Text>
              <View style={[styles.statIndicator, { backgroundColor: "#7F3DFF" }]}>
                <Text style={styles.statTrend}>+12%</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.statCard} activeOpacity={0.7} onPress={() => toggleSection("views")}>
              <Text style={styles.statValue}>15k</Text>
              <Text style={styles.statLabel}>Views</Text>
              <View style={[styles.statIndicator, { backgroundColor: "#FF7A00" }]}>
                <Text style={styles.statTrend}>+8%</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.statCard} activeOpacity={0.7} onPress={() => toggleSection("users")}>
              <Text style={styles.statValue}>5.2k</Text>
              <Text style={styles.statLabel}>Users</Text>
              <View style={[styles.statIndicator, { backgroundColor: "#00D1FF" }]}>
                <Text style={styles.statTrend}>+15%</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Traffic Chart */}
        <Animated.View style={[styles.section, chartStyle]}>
          <TouchableOpacity style={styles.chartCard} activeOpacity={0.7} onPress={() => toggleSection("traffic")}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Traffic</Text>
              {expandedSection === "traffic" && (
                <View style={styles.legendContainer}>
                  <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: "#7F3DFF" }]} />
                    <Text style={styles.legendText}>Visitors</Text>
                  </View>
                </View>
              )}
            </View>
            <LineChart
              data={getChartData()}
              width={chartWidth}
              height={180}
              chartConfig={{
                ...chartConfig,
                backgroundGradientFromOpacity: 0,
                backgroundGradientToOpacity: 0,
                propsForBackgroundLines: {
                  strokeDasharray: "", // solid background lines
                  stroke: "#f0f0f0",
                  strokeWidth: 1,
                },
              }}
              bezier
              style={styles.chart}
              withDots={false}
              withInnerLines={false}
              withOuterLines={false}
              withVerticalLines={false}
              withHorizontalLines={expandedSection === "traffic"}
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Distribution */}
        <Animated.View style={[styles.section, progressStyle]}>
          <TouchableOpacity style={styles.chartCard} activeOpacity={0.7} onPress={() => toggleSection("distribution")}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Distribution</Text>
            </View>
            <View style={styles.distributionContainer}>
              <View style={styles.pieContainer}>
                <PieChart
                  data={pieChartData}
                  width={140}
                  height={140}
                  chartConfig={chartConfig}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="0"
                  absolute
                  hasLegend={false}
                />
              </View>

              <View style={styles.distributionLegend}>
                <View style={styles.legendItemVertical}>
                  <View style={[styles.legendDot, { backgroundColor: "#7F3DFF" }]} />
                  <View>
                    <Text style={styles.legendLabel}>Engagement</Text>
                    <Text style={styles.legendValue}>39%</Text>
                  </View>
                </View>

                <View style={styles.legendItemVertical}>
                  <View style={[styles.legendDot, { backgroundColor: "#FF7A00" }]} />
                  <View>
                    <Text style={styles.legendLabel}>Sales</Text>
                    <Text style={styles.legendValue}>19%</Text>
                  </View>
                </View>

                <View style={styles.legendItemVertical}>
                  <View style={[styles.legendDot, { backgroundColor: "#00D1FF" }]} />
                  <View>
                    <Text style={styles.legendLabel}>Growth</Text>
                    <Text style={styles.legendValue}>37%</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Performance Metrics */}
        <Animated.View style={[styles.section, progressStyle]}>
          <View style={styles.metricsCard}>
            <Text style={styles.cardTitle}>Performance Metrics</Text>

            <View style={styles.metricItem}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>Engagement</Text>
                <Text style={[styles.metricValue, { color: "#7F3DFF" }]}>39%</Text>
              </View>
              <ProgressBar progress={0.39} color="#7F3DFF" style={styles.metricBar} />
            </View>

            <View style={styles.metricItem}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>Sales</Text>
                <Text style={[styles.metricValue, { color: "#FF7A00" }]}>19%</Text>
              </View>
              <ProgressBar progress={0.19} color="#FF7A00" style={styles.metricBar} />
            </View>

            <View style={styles.metricItem}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricLabel}>Growth</Text>
                <Text style={[styles.metricValue, { color: "#00D1FF" }]}>37%</Text>
              </View>
              <ProgressBar progress={0.37} color="#00D1FF" style={styles.metricBar} />
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerDate: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(127, 61, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  section: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  kpiRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  kpiCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    width: "48%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  kpiContent: {
    flex: 1,
  },
  kpiValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  kpiUnit: {
    fontSize: 16,
    color: "#666",
  },
  kpiLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  kpiIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  periodSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
  },
  activePeriod: {
    backgroundColor: "rgba(127, 61, 255, 0.1)",
  },
  periodText: {
    fontSize: 14,
    color: "#666",
  },
  activePeriodText: {
    color: "#7F3DFF",
    fontWeight: "500",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    width: "31%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    marginBottom: 8,
  },
  statIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  statTrend: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "500",
  },
  chartCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  legendContainer: {
    flexDirection: "row",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: "#666",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  distributionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  pieContainer: {
    width: 140,
    height: 140,
  },
  distributionLegend: {
    flex: 1,
    paddingLeft: 16,
  },
  legendItemVertical: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  legendLabel: {
    fontSize: 14,
    color: "#666",
  },
  legendValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 2,
  },
  metricsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  metricItem: {
    marginTop: 16,
  },
  metricHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 14,
    color: "#666",
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  metricBar: {
    height: 6,
    borderRadius: 3,
  },
})

export default DashboardE;


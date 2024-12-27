import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TextInput, StyleSheet, Pressable, Platform, Dimensions } from 'react-native';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const statsData = [
  { title: 'Sales', value: '250k', icon: 'timer-outline', color: '#FF6B6B' },
  { title: 'Customers', value: '24m', icon: 'people-outline', color: '#4D96FF' },
  { title: 'Products', value: '15k', icon: 'cube-outline', color: '#FFB84C' },
  { title: 'Revenue', value: '180m', icon: 'wallet-outline', color: '#4CAF50' },
];

const ordersData = [
  {
    id: 'Aria827',
    customer: 'Ellie Collins',
    product: 'Ginger Snacks',
    date: '12/12/2021',
    amount: '$18.00',
    status: 'Delivered',
    paymentStatus: 'Paid',
  },
  {
    id: 'Aria253',
    customer: 'Sophie Nguyen',
    product: 'Guava Sorbet',
    date: '18/12/2021',
    amount: '$32.00',
    status: 'Cancelled',
    paymentStatus: 'Failed',
  },
  {
    id: 'Aria478',
    customer: 'Darcy Ryan',
    product: 'Gooseberry Surprise',
    date: '22/12/2021',
    amount: '$19.00',
    status: 'Processing',
    paymentStatus: 'Awaiting',
  },
];

const salesData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      data: [20, 45, 28, 80, 99, 43],
      color: (opacity = 1) => `rgba(77, 150, 255, ${opacity})`,
      strokeWidth: 2
    },
    {
      data: [30, 35, 38, 60, 79, 63],
      color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
      strokeWidth: 2
    }
  ],
  legend: ["Sales", "Revenue"]
};

const productData = {
  labels: ["Snacks", "Drinks", "Fruits", "Vegetables"],
  data: [20, 45, 28, 80]
};

export default function DashboardScreen() {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('Today');

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Pressable style={styles.homeButton}>
          <Ionicons name="home-outline" size={24} color="#666" />
        </Pressable>
        <Text style={styles.headerTitle}>Sales Dashboard</Text>
      </View>
      <View style={styles.headerRight}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search anything"
            placeholderTextColor="#666"
          />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.notificationText}>You have 21 new leads 🎉</Text>
          <Image
            source={{ uri: '/placeholder.svg?height=40&width=40' }}
            style={styles.avatar}
          />
        </View>
      </View>
    </View>
  );

  const renderStatsCards = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsContainer}>
      {statsData.map((stat, index) => (
        <Animated.View
          key={stat.title}
          entering={FadeInUp.delay(index * 100)}
          style={[styles.statCard, { backgroundColor: 'white' }]}
        >
          <View style={[styles.iconContainer, { backgroundColor: stat.color + '15' }]}>
            <Ionicons name={stat.icon} size={24} color={stat.color} />
          </View>
          <Text style={styles.statValue}>{stat.value}</Text>
          <Text style={styles.statTitle}>{stat.title}</Text>
        </Animated.View>
      ))}
    </ScrollView>
  );

  const renderCharts = () => (
    <Animated.View entering={FadeIn.delay(300)} style={styles.chartsContainer}>
      <View style={styles.chartHeader}>
        <View style={styles.chartTitles}>
          <Text style={styles.chartTitle}>Overall Performance</Text>
          <Text style={styles.chartValue}>$12 Million Revenue</Text>
        </View>
        <View style={styles.timeFilters}>
          {['Today', 'Yesterday', '7 days', '30 days', '90 days'].map((filter) => (
            <Pressable
              key={filter}
              onPress={() => setSelectedTimeFilter(filter)}
              style={[
                styles.filterButton,
                selectedTimeFilter === filter && styles.activeFilter,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedTimeFilter === filter && styles.activeFilterText,
                ]}
              >
                {filter}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <LineChart
          data={salesData}
          width={width - 40}
          height={220}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </ScrollView>

      <View style={styles.productChartContainer}>
        <Text style={styles.productChartTitle}>Product Categories</Text>
        {/* <BarChart
          data={productData}
          width={width - 40}
          height={220}
          yAxisLabel="$"
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(77, 150, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        /> */}
      </View>
    </Animated.View>
  );

  const renderOrders = () => (
    <Animated.View entering={FadeIn.delay(600)} style={styles.ordersContainer}>
      <Text style={styles.ordersTitle}>Recent Orders</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Customer</Text>
            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Product</Text>
            <Text style={styles.tableHeaderCell}>User ID</Text>
            <Text style={styles.tableHeaderCell}>Date</Text>
            <Text style={styles.tableHeaderCell}>Amount</Text>
            <Text style={styles.tableHeaderCell}>Payment Status</Text>
            <Text style={styles.tableHeaderCell}>Order Status</Text>
          </View>
          {ordersData.map((order) => (
            <Pressable key={order.id} style={styles.tableRow} onPress={() => console.log(`Order ${order.id} pressed`)}>
              <View style={[styles.tableCell, { flex: 2 }]}>
                <Image
                  source={{ uri: '/placeholder.svg?height=32&width=32' }}
                  style={styles.customerAvatar}
                />
                <Text style={styles.customerName}>{order.customer}</Text>
              </View>
              <View style={[styles.tableCell, { flex: 2 }]}>
                <Text>{order.product}</Text>
              </View>
              <Text style={styles.tableCell}>{order.id}</Text>
              <Text style={styles.tableCell}>{order.date}</Text>
              <Text style={styles.tableCell}>{order.amount}</Text>
              <View style={styles.tableCell}>
                <Text
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(order.paymentStatus) },
                  ]}
                >
                  {order.paymentStatus}
                </Text>
              </View>
              <View style={styles.tableCell}>
                <Text
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(order.status) },
                  ]}
                >
                  {order.status}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </Animated.View>
  );

  return (
    <ScrollView style={styles.container}>
      {renderHeader()}
      {renderStatsCards()}
      {renderCharts()}
      {renderOrders()}
    </ScrollView>
  );
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'delivered':
    case 'paid':
      return '#4CAF5015';
    case 'cancelled':
    case 'failed':
      return '#FF6B6B15';
    default:
      return '#4D96FF15';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  homeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 16,
  },
  searchInput: {
    height: 36,
    width: 200,
    marginLeft: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationText: {
    marginRight: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  statsContainer: {
    padding: 16,
  },
  statCard: {
    padding: 16,
    borderRadius: 12,
    marginRight: 16,
    width: Platform.OS === 'web' ? 200 : 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    color: '#666',
  },
  chartsContainer: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  chartTitles: {},
  chartTitle: {
    color: '#666',
    marginBottom: 4,
  },
  chartValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  timeFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
    marginBottom: 8,
  },
  activeFilter: {
    backgroundColor: '#4D96FF',
  },
  filterText: {
    color: '#666',
  },
  activeFilterText: {
    color: 'white',
  },
  productChartContainer: {
    marginTop: 24,
  },
  productChartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  ordersContainer: {
    margin: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  ordersTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  table: {
    minWidth: Platform.OS === 'web' ? 'auto' : 800,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableHeaderCell: {
    flex: 1,
    color: '#666',
    fontSize: 13,
    fontWeight: '600',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  customerName: {
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
  },
});


import React from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native';
import { LineChart, ProgressChart } from 'react-native-chart-kit';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Svg, Path } from 'react-native-svg';
import TablaComponente from "../../components/tablaComponent";
import {PaperProvider,Button} from "react-native-paper";
import { useProtectedRoute,useAuth } from "@/context/userContext";

const data = [
  { id: 1, nombre: 'Juan', edad: 30, ciudad: 'Madrid' },
  { id: 2, nombre: 'María', edad: 25, ciudad: 'Barcelona' },
  { id: 3, nombre: 'Pedro', edad: 35, ciudad: 'Sevilla' },
  { id: 4, nombre: 'Ana', edad: 28, ciudad: 'Valencia' },
  { id: 5, nombre: 'Luis', edad: 40, ciudad: 'Bilbao' },
];

const columns = [
  { key: 'id', title: 'ID', sortable: true, width: 50 },
  { key: 'nombre', title: 'Nombre', sortable: true },
  { key: 'edad', title: 'Edad', sortable: true, width: 80 },
  { key: 'ciudad', title: 'Ciudad', sortable: true },
];



export default function AnalyticsDashboard() {




  const screenWidth = Dimensions.get('window').width;
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      data: [20, 45, 28, 80, 99, 43],
    }]
  };

  const progressData = {
    data: [0.4, 0.6, 0.8]
  };

  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(123, 82, 255, ${opacity})`,
    strokeWidth: 2,
    decimalPlaces: 0,
  };

  const steps = [
    { number: '1', title: 'Analysis', color: '#FF6B6B' },
    { number: '2', title: 'Processing', color: '#4ECDC4' },
    { number: '3', title: 'Completion', color: '#7B52FF' },
  ];



  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // La redirección ya está manejada en la función logout
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };


  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Revenue Card */}
        <Animated.View 
          entering={FadeInUp.delay(100)}
          style={styles.card}
        >
          <Text style={styles.cardTitle}>Total Revenue</Text>
          <Button onPress={handleLogout}>cerrar sesion</Button>
          <Text style={styles.amount}>$3,580</Text>
          <View style={styles.ratingContainer}>
            {'★★★★☆'.split('').map((star, index) => (
              <Text key={index} style={styles.star}>
                {star}
              </Text>
            ))}
          </View>
        </Animated.View>

        {/* Line Chart */}
        <Animated.View 
          entering={FadeInUp.delay(200)}
          style={styles.card}
        >
          <Text style={styles.cardTitle}>Performance Overview</Text>
          <LineChart
            data={lineChartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </Animated.View>

        {/* Progress Circles */}
        <Animated.View 
          entering={FadeInUp.delay(300)}
          style={styles.card}
        >
          <Text style={styles.cardTitle}>Completion Rates</Text>
          <ProgressChart
            data={progressData}
            width={screenWidth - 40}
            height={220}
            strokeWidth={16}
            radius={32}
            chartConfig={chartConfig}
            hideLegend={false}
          />
        </Animated.View>

        {/* Steps */}
        <Animated.View 
          entering={FadeInUp.delay(400)}
          style={styles.card}
        >
          <Text style={styles.cardTitle}>Process Steps</Text>
          <View style={styles.stepsContainer}>
            {steps.map((step, index) => (
              <View key={index} style={styles.step}>
                <View style={[styles.stepNumber, { backgroundColor: step.color }]}>
                  <Text style={styles.stepNumberText}>{step.number}</Text>
                </View>
                <Text style={styles.stepTitle}>{step.title}</Text>
                {index < steps.length - 1 && (
                  <View style={[styles.stepLine, { backgroundColor: step.color }]} />
                )}
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Progress Bars */}
        <Animated.View 
          entering={FadeInUp.delay(500)}
          style={styles.card}
        >
          <Text style={styles.cardTitle}>Performance Metrics</Text>
          {[
            { label: 'Revenue', progress: 0.75, color: '#7B52FF' },
            { label: 'Sales', progress: 0.45, color: '#4ECDC4' },
            { label: 'Growth', progress: 0.60, color: '#FF6B6B' },
          ].map((item, index) => (
            <View key={index} style={styles.progressBar}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>{item.label}</Text>
                <Text style={styles.progressValue}>{Math.round(item.progress * 100)}%</Text>
              </View>
              <View style={styles.progressTrack}>
                <View 
                  style={[
                    styles.progressFill,
                    { 
                      width: `${item.progress * 100}%`,
                      backgroundColor: item.color
                    }
                  ]} 
                />
              </View>
            </View>
          ))}
        </Animated.View>
      </View>
      <PaperProvider theme={{ dark: false, mode: 'exact' }}>
      <View style={{ flex: 1, padding: 16 }}>
      <TablaComponente
          data={data}
          columns={columns}
          keyExtractor={(item) => item.id.toString()}
          onSort={(key, order) => console.log('Ordenando por:', key, order)}
          onSearch={(query) => console.log('Buscando:', query)}
          onFilter={(filters) => console.log('Filtrando:', filters)}
        />
       </View>
        </PaperProvider>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  star: {
    color: '#FFD700',
    fontSize: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  step: {
    alignItems: 'center',
    flex: 1,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepNumberText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepTitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  stepLine: {
    position: 'absolute',
    top: 16,
    right: -50,
    width: 100,
    height: 2,
    zIndex: -1,
  },
  progressBar: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
  },
  progressValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});


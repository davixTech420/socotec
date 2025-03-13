/* import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const indexEmplo = () => {
  const [data, setData] = useState({
    title: 'Bienvenido',
    subtitle: 'Estadísticas generales',
    stats: [
      { label: 'Usuarios', value: 100, color: '#4CAF50' },
      { label: 'Ventas', value: 500, color: '#FF9800' },
      { label: 'Ingresos', value: 1000, color: '#2196F3' },
    ],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.subtitle}>{data.subtitle}</Text>
      </View>
      <View style={styles.statsContainer}>
        {data.stats.map((stat, index) => (
          <View key={index} style={[styles.stat, { backgroundColor: stat.color }]}>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
          </View>
        ))}
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <AntDesign name="plus" size={24} color="#fff" />
          <Text style={styles.actionText}>Agregar nuevo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <AntDesign name="edit" size={24} color="#fff" />
          <Text style={styles.actionText}>Editar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  header: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
  },
  statsContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  stat: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 18,
    color: '#fff',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  actionText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default indexEmplo; */









import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, FlatList, StatusBar } from 'react-native';
import { Text, Card, Avatar, Button, Appbar, useTheme, Divider, IconButton, Surface, Badge, ProgressBar } from 'react-native-paper';
import Animated, { 
  FadeInDown, 
  FadeInRight, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  withSequence, 
  withDelay,
  interpolate,
  Extrapolate,
  SlideInRight
} from 'react-native-reanimated';
import { MaterialCommunityIcons, Ionicons, FontAwesome5, Feather, MaterialIcons } from '@expo/vector-icons';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';

const { width, height } = Dimensions.get('window');

// Custom components
const StatCard = ({ icon, title, value, trend, trendValue, color, delay }) => {
  const scale = useSharedValue(0.8);
  
  useEffect(() => {
    scale.value = withDelay(delay, withSpring(1, { damping: 12 }));
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: interpolate(scale.value, [0.8, 1], [0, 1], Extrapolate.CLAMP)
    };
  });
  
  return (
    <Animated.View style={[styles.statCardContainer, animatedStyle]}>
      <Surface style={styles.statCard}>
        <View style={styles.statIconContainer}>
          <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
            {icon}
          </View>
        </View>
        <View style={styles.statContent}>
          <Text style={styles.statTitle}>{title}</Text>
          <Text style={styles.statValue}>{value}</Text>
          <View style={styles.statTrend}>
            <MaterialIcons 
              name={trend === 'up' ? 'trending-up' : 'trending-down'} 
              size={16} 
              color={trend === 'up' ? '#4CAF50' : '#F44336'} 
            />
            <Text style={[styles.statTrendValue, { color: trend === 'up' ? '#4CAF50' : '#F44336' }]}>
              {trendValue}
            </Text>
          </View>
        </View>
      </Surface>
    </Animated.View>
  );
};

const TaskItem = ({ task, index }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  
  useEffect(() => {
    opacity.value = withDelay(index * 100, withTiming(1, { duration: 500 }));
    translateY.value = withDelay(index * 100, withTiming(0, { duration: 500 }));
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }]
    };
  });
  
  return (
    <Animated.View style={animatedStyle}>
      <Surface style={styles.taskItem}>
        <View style={styles.taskCheckbox}>
          <View style={[styles.checkbox, { borderColor: task.priority === 'High' ? '#F44336' : task.priority === 'Medium' ? '#FF9800' : '#4CAF50' }]} />
        </View>
        <View style={styles.taskContent}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <Text style={styles.taskDate}>Due: {task.dueDate}</Text>
          <View style={styles.taskMeta}>
            <View style={[styles.priorityBadge, { 
              backgroundColor: task.priority === 'High' ? '#F4433620' : task.priority === 'Medium' ? '#FF980020' : '#4CAF5020',
              borderColor: task.priority === 'High' ? '#F44336' : task.priority === 'Medium' ? '#FF9800' : '#4CAF50'
            }]}>
              <Text style={[styles.priorityText, { 
                color: task.priority === 'High' ? '#F44336' : task.priority === 'Medium' ? '#FF9800' : '#4CAF50' 
              }]}>{task.priority}</Text>
            </View>
            {task.team && (
              <View style={styles.teamBadge}>
                <Text style={styles.teamText}>{task.team}</Text>
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity style={styles.taskAction}>
          <MaterialCommunityIcons name="dots-vertical" size={20} color="#666" />
        </TouchableOpacity>
      </Surface>
    </Animated.View>
  );
};

const ProjectCard = ({ project, index }) => {
  const scale = useSharedValue(0.9);
  
  useEffect(() => {
    scale.value = withDelay(index * 100, withSpring(1, { damping: 12 }));
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: interpolate(scale.value, [0.9, 1], [0, 1], Extrapolate.CLAMP)
    };
  });
  
  return (
    <Animated.View style={animatedStyle}>
      <Surface style={styles.projectCard}>
        <View style={styles.projectHeader}>
          <View style={styles.projectTitleContainer}>
            <Text style={styles.projectTitle}>{project.name}</Text>
            <Text style={styles.projectType}>{project.type}</Text>
          </View>
          <View style={[styles.projectStatusBadge, { 
            backgroundColor: project.status === 'On Track' ? '#4CAF5020' : project.status === 'At Risk' ? '#FF980020' : '#F4433620',
            borderColor: project.status === 'On Track' ? '#4CAF50' : project.status === 'At Risk' ? '#FF9800' : '#F44336'
          }]}>
            <Text style={[styles.projectStatusText, { 
              color: project.status === 'On Track' ? '#4CAF50' : project.status === 'At Risk' ? '#FF9800' : '#F44336' 
            }]}>{project.status}</Text>
          </View>
        </View>
        
        <View style={styles.projectProgress}>
          <View style={styles.progressTextContainer}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressValue}>{project.progress}%</Text>
          </View>
          <ProgressBar 
            progress={project.progress / 100} 
            color={project.progress > 75 ? '#4CAF50' : project.progress > 40 ? '#FF9800' : '#F44336'} 
            style={styles.progressBar} 
          />
        </View>
        
        <View style={styles.projectMeta}>
          <View style={styles.metaItem}>
            <Feather name="calendar" size={14} color="#666" />
            <Text style={styles.metaText}>{project.deadline}</Text>
          </View>
          <View style={styles.teamAvatars}>
            {project.team.map((member, i) => (
              <Avatar.Text 
                key={i}
                size={24} 
                label={member.substring(0, 2)} 
                style={[styles.teamAvatar, { marginLeft: i > 0 ? -10 : 0, zIndex: 10 - i }]} 
              />
            ))}
          </View>
        </View>
      </Surface>
    </Animated.View>
  );
};

const InventoryItem = ({ item, index }) => {
  const translateX = useSharedValue(50);
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    translateX.value = withDelay(index * 100, withTiming(0, { duration: 500 }));
    opacity.value = withDelay(index * 100, withTiming(1, { duration: 500 }));
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value
    };
  });
  
  return (
    <Animated.View style={animatedStyle}>
      <Surface style={styles.inventoryItemCard}>
        <View style={styles.inventoryItemIcon}>
          <View style={[styles.itemIconBg, { 
            backgroundColor: item.status === 'In Stock' ? '#4CAF5020' : item.status === 'Low Stock' ? '#FF980020' : '#F4433620' 
          }]}>
            <MaterialCommunityIcons 
              name={item.icon} 
              size={24} 
              color={item.status === 'In Stock' ? '#4CAF50' : item.status === 'Low Stock' ? '#FF9800' : '#F44336'} 
            />
          </View>
        </View>
        <View style={styles.inventoryItemContent}>
          <Text style={styles.inventoryItemName}>{item.name}</Text>
          <Text style={styles.inventoryItemQuantity}>Quantity: {item.quantity}</Text>
        </View>
        <View style={[styles.inventoryItemStatus, { 
          backgroundColor: item.status === 'In Stock' ? '#4CAF5020' : item.status === 'Low Stock' ? '#FF980020' : '#F4433620',
          borderColor: item.status === 'In Stock' ? '#4CAF50' : item.status === 'Low Stock' ? '#FF9800' : '#F44336'
        }]}>
          <Text style={[styles.inventoryItemStatusText, { 
            color: item.status === 'In Stock' ? '#4CAF50' : item.status === 'Low Stock' ? '#FF9800' : '#F44336' 
          }]}>{item.status}</Text>
        </View>
      </Surface>
    </Animated.View>
  );
};

const MessageBubble = ({ message, index }) => {
  const translateY = useSharedValue(20);
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    translateY.value = withDelay(index * 100, withTiming(0, { duration: 300 }));
    opacity.value = withDelay(index * 100, withTiming(1, { duration: 300 }));
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value
    };
  });
  
  return (
    <Animated.View 
      style={[
        styles.messageBubble,
        message.isUser ? styles.userMessage : styles.botMessage,
        animatedStyle
      ]}
    >
      {!message.isUser && (
        <Avatar.Text 
          size={32} 
          label={message.sender.substring(0, 2)} 
          style={styles.messageAvatar} 
        />
      )}
      <View style={styles.messageContent}>
        {!message.isUser && (
          <Text style={styles.messageSender}>{message.sender}</Text>
        )}
        <Text style={styles.messageText}>{message.text}</Text>
        <Text style={styles.messageTime}>
          {message.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </Animated.View>
  );
};

const EmployeeDashboard = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);
  
  // Animation values
  const tabIndicatorWidth = useSharedValue(0);
  const tabIndicatorLeft = useSharedValue(0);
  
  // Simulated data
  const financeData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: () => '#6200EE',
        strokeWidth: 2
      }
    ]
  };
  
  const expenseData = {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      {
        data: [35, 28, 42, 39],
        color: (opacity = 1) => '#03DAC5'
      }
    ]
  };
  
  const pieData = [
    {
      name: "Hardware",
      population: 35,
      color: "#6200EE",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12
    },
    {
      name: "Software",
      population: 25,
      color: "#03DAC5",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12
    },
    {
      name: "Services",
      population: 40,
      color: "#FF9800",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12
    }
  ];
  
  const stats = [
    { icon: <MaterialCommunityIcons name="chart-line" size={24} color="#6200EE" />, title: "Revenue", value: "$48,352", trend: "up", trendValue: "12.5%", color: "#6200EE" },
    { icon: <MaterialCommunityIcons name="account-group" size={24} color="#03DAC5" />, title: "Team Size", value: "24", trend: "up", trendValue: "3.2%", color: "#03DAC5" },
    { icon: <MaterialCommunityIcons name="clipboard-check" size={24} color="#FF9800" />, title: "Tasks", value: "42", trend: "down", trendValue: "5.1%", color: "#FF9800" },
    { icon: <MaterialCommunityIcons name="package-variant-closed" size={24} color="#F44336" />, title: "Inventory", value: "156", trend: "down", trendValue: "2.3%", color: "#F44336" }
  ];
  
  const tasks = [
    { id: 1, title: 'Complete Q2 Financial Report', dueDate: '2023-06-30', priority: 'High', team: 'Finance' },
    { id: 2, title: 'Team Performance Review Meeting', dueDate: '2023-06-15', priority: 'Medium', team: 'HR' },
    { id: 3, title: 'Update Inventory Management System', dueDate: '2023-06-20', priority: 'Low', team: 'IT' },
    { id: 4, title: 'Client Presentation Preparation', dueDate: '2023-06-18', priority: 'High', team: 'Sales' },
  ];
  
  const projects = [
    { id: 1, name: 'Mobile App Development', type: 'Software', progress: 70, status: 'On Track', deadline: 'Aug 15, 2023', team: ['JD', 'AK', 'TS'] },
    { id: 2, name: 'Website Redesign', type: 'Design', progress: 40, status: 'At Risk', deadline: 'Jul 30, 2023', team: ['RJ', 'MK'] },
    { id: 3, name: 'Data Migration', type: 'IT', progress: 90, status: 'On Track', deadline: 'Jun 25, 2023', team: ['BL', 'CS', 'DM', 'JW'] },
  ];
  
  const inventoryItems = [
    { id: 1, name: 'Laptops', quantity: 24, status: 'In Stock', icon: 'laptop' },
    { id: 2, name: 'Monitors', quantity: 15, status: 'Low Stock', icon: 'monitor' },
    { id: 3, name: 'Keyboards', quantity: 32, status: 'In Stock', icon: 'keyboard' },
    { id: 4, name: 'Mice', quantity: 8, status: 'Critical', icon: 'mouse' },
    { id: 5, name: 'Headphones', quantity: 18, status: 'In Stock', icon: 'headphones' },
  ];

  useEffect(() => {
    // Initialize with some messages
    setMessages([
      {
        id: 1,
        text: 'Hello! Need any assistance with the dashboard?',
        createdAt: new Date(),
        isUser: false,
        sender: 'Support Team',
      },
    ]);
    
    // Set initial tab indicator position
    updateTabIndicator(activeTab);
  }, []);
  
  const updateTabIndicator = (tab) => {
    const tabIndex = ['overview', 'projects', 'inventory', 'chat'].indexOf(tab);
    const tabWidth = width / 4;
    
    tabIndicatorWidth.value = withTiming(tabWidth * 0.6, { duration: 300 });
    tabIndicatorLeft.value = withTiming(tabWidth * tabIndex + (tabWidth * 0.2), { duration: 300 });
  };
  
  const tabIndicatorStyle = useAnimatedStyle(() => {
    return {
      width: tabIndicatorWidth.value,
      left: tabIndicatorLeft.value,
    };
  });

  const sendMessage = () => {
    if (inputText.trim() === '') return;
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      createdAt: new Date(),
      isUser: true,
      sender: 'Me',
    };
    
    setMessages([...messages, userMessage]);
    setInputText('');
    
    // Simulate response after a short delay
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        text: 'Thanks for your message. Our team will get back to you soon.',
        createdAt: new Date(),
        isUser: false,
        sender: 'Support Team',
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    updateTabIndicator(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Animated.View entering={FadeInDown.delay(100).duration(500)}>
              <Text style={styles.welcomeText}>Welcome back, <Text style={styles.userName}>Alex</Text></Text>
              <Text style={styles.dateText}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
            </Animated.View>
            
            <View style={styles.statsContainer}>
              {stats.map((stat, index) => (
                <StatCard 
                  key={index}
                  icon={stat.icon}
                  title={stat.title}
                  value={stat.value}
                  trend={stat.trend}
                  trendValue={stat.trendValue}
                  color={stat.color}
                  delay={index * 100}
                />
              ))}
            </View>
            
            <Animated.View entering={FadeInDown.delay(400).duration(500)}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Financial Overview</Text>
                <TouchableOpacity>
                  <Text style={styles.sectionAction}>View All</Text>
                </TouchableOpacity>
              </View>
              
              <Surface style={styles.chartCard}>
                <LineChart
                  data={financeData}
                  width={width - 48}
                  height={220}
                  chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 0,
                    color: () => '#6200EE',
                    labelColor: () => '#666666',
                    style: {
                      borderRadius: 16,
                    },
                    propsForDots: {
                      r: '6',
                      strokeWidth: '2',
                      stroke: '#6200EE'
                    }
                  }}
                  bezier
                  style={styles.chart}
                />
              </Surface>
            </Animated.View>
            
            <View style={styles.chartsRow}>
              <Animated.View entering={FadeInDown.delay(500).duration(500)} style={styles.smallChartContainer}>
                <Surface style={styles.smallChartCard}>
                  <Text style={styles.smallChartTitle}>Expenses</Text>
                  <BarChart
                    data={expenseData}
                    width={width * 0.45}
                    height={180}
                    chartConfig={{
                      backgroundColor: '#ffffff',
                      backgroundGradientFrom: '#ffffff',
                      backgroundGradientTo: '#ffffff',
                      decimalPlaces: 0,
                      color: () => '#03DAC5',
                      labelColor: () => '#666666',
                    }}
                    style={styles.smallChart}
                    showValuesOnTopOfBars
                  />
                </Surface>
              </Animated.View>
              
              <Animated.View entering={FadeInDown.delay(600).duration(500)} style={styles.smallChartContainer}>
                <Surface style={styles.smallChartCard}>
                  <Text style={styles.smallChartTitle}>Budget Allocation</Text>
                  <PieChart
                    data={pieData}
                    width={width * 0.45}
                    height={180}
                    chartConfig={{
                      backgroundColor: '#ffffff',
                      backgroundGradientFrom: '#ffffff',
                      backgroundGradientTo: '#ffffff',
                      color: () => '#000000',
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="0"
                    absolute
                  />
                </Surface>
              </Animated.View>
            </View>
            
            <Animated.View entering={FadeInDown.delay(700).duration(500)}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
                <TouchableOpacity>
                  <Text style={styles.sectionAction}>View All</Text>
                </TouchableOpacity>
              </View>
              
              {tasks.map((task, index) => (
                <TaskItem key={task.id} task={task} index={index} />
              ))}
            </Animated.View>
            
            <View style={styles.bottomSpacer} />
          </ScrollView>
        );
      
      case 'projects':
        return (
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Animated.View entering={FadeInDown.delay(100).duration(500)}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Active Projects</Text>
                <TouchableOpacity style={styles.addButton}>
                  <Feather name="plus" size={20} color="#6200EE" />
                  <Text style={styles.addButtonText}>New</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
            
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
            
            <Animated.View entering={FadeInDown.delay(500).duration(500)}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Project Analytics</Text>
                <TouchableOpacity>
                  <Text style={styles.sectionAction}>Details</Text>
                </TouchableOpacity>
              </View>
              
              <Surface style={styles.analyticsCard}>
                <View style={styles.analyticsRow}>
                  <View style={styles.analyticItem}>
                    <Text style={styles.analyticValue}>8</Text>
                    <Text style={styles.analyticLabel}>Total Projects</Text>
                  </View>
                  <View style={styles.analyticDivider} />
                  <View style={styles.analyticItem}>
                    <Text style={styles.analyticValue}>5</Text>
                    <Text style={styles.analyticLabel}>On Track</Text>
                  </View>
                  <View style={styles.analyticDivider} />
                  <View style={styles.analyticItem}>
                    <Text style={styles.analyticValue}>3</Text>
                    <Text style={styles.analyticLabel}>At Risk</Text>
                  </View>
                </View>
                
                <Divider style={styles.analyticsSeparator} />
                
                <View style={styles.analyticsRow}>
                  <View style={styles.analyticItem}>
                    <Text style={styles.analyticValue}>68%</Text>
                    <Text style={styles.analyticLabel}>Avg. Progress</Text>
                  </View>
                  <View style={styles.analyticDivider} />
                  <View style={styles.analyticItem}>
                    <Text style={styles.analyticValue}>12</Text>
                    <Text style={styles.analyticLabel}>Team Members</Text>
                  </View>
                  <View style={styles.analyticDivider} />
                  <View style={styles.analyticItem}>
                    <Text style={styles.analyticValue}>4</Text>
                    <Text style={styles.analyticLabel}>Departments</Text>
                  </View>
                </View>
              </Surface>
            </Animated.View>
            
            <View style={styles.bottomSpacer} />
          </ScrollView>
        );
      
      case 'inventory':
        return (
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Animated.View entering={FadeInDown.delay(100).duration(500)}>
              <View style={styles.inventoryHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Inventory Management</Text>
                  <Text style={styles.inventorySubtitle}>Total Items: 156</Text>
                </View>
                <View style={styles.inventoryActions}>
                  <TouchableOpacity style={styles.inventoryAction}>
                    <MaterialCommunityIcons name="filter-variant" size={20} color="#6200EE" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.inventoryAction}>
                    <MaterialCommunityIcons name="sort" size={20} color="#6200EE" />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.inventoryAction, styles.primaryAction]}>
                    <MaterialCommunityIcons name="plus" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                  <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search inventory..."
                    placeholderTextColor="#999"
                  />
                </View>
                <TouchableOpacity style={styles.scanButton}>
                  <MaterialCommunityIcons name="barcode-scan" size={20} color="#6200EE" />
                </TouchableOpacity>
              </View>
            </Animated.View>
            
            <Animated.View entering={FadeInDown.delay(300).duration(500)}>
              <View style={styles.inventoryStats}>
                <Surface style={styles.inventoryStat}>
                  <View style={[styles.inventoryStatIcon, { backgroundColor: '#4CAF5020' }]}>
                    <MaterialCommunityIcons name="check-circle" size={24} color="#4CAF50" />
                  </View>
                  <Text style={styles.inventoryStatValue}>86</Text>
                  <Text style={styles.inventoryStatLabel}>In Stock</Text>
                </Surface>
                
                <Surface style={styles.inventoryStat}>
                  <View style={[styles.inventoryStatIcon, { backgroundColor: '#FF980020' }]}>
                    <MaterialCommunityIcons name="alert-circle" size={24} color="#FF9800" />
                  </View>
                  <Text style={styles.inventoryStatValue}>42</Text>
                  <Text style={styles.inventoryStatLabel}>Low Stock</Text>
                </Surface>
                
                <Surface style={styles.inventoryStat}>
                  <View style={[styles.inventoryStatIcon, { backgroundColor: '#F4433620' }]}>
                    <MaterialCommunityIcons name="alert" size={24} color="#F44336" />
                  </View>
                  <Text style={styles.inventoryStatValue}>28</Text>
                  <Text style={styles.inventoryStatLabel}>Critical</Text>
                </Surface>
              </View>
            </Animated.View>
            
            <Animated.View entering={FadeInDown.delay(400).duration(500)}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Items</Text>
                <TouchableOpacity>
                  <Text style={styles.sectionAction}>View All</Text>
                </TouchableOpacity>
              </View>
              
              {inventoryItems.map((item, index) => (
                <InventoryItem key={item.id} item={item} index={index} />
              ))}
            </Animated.View>
            
            <Animated.View entering={FadeInDown.delay(700).duration(500)}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
              </View>
              
              <View style={styles.quickActions}>
                <TouchableOpacity style={styles.quickAction}>
                  <View style={[styles.quickActionIcon, { backgroundColor: '#6200EE20' }]}>
                    <MaterialCommunityIcons name="clipboard-list" size={24} color="#6200EE" />
                  </View>
                  <Text style={styles.quickActionText}>Request</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.quickAction}>
                  <View style={[styles.quickActionIcon, { backgroundColor: '#03DAC520' }]}>
                    <MaterialCommunityIcons name="history" size={24} color="#03DAC5" />
                  </View>
                  <Text style={styles.quickActionText}>History</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.quickAction}>
                  <View style={[styles.quickActionIcon, { backgroundColor: '#FF980020' }]}>
                    <MaterialCommunityIcons name="file-document" size={24} color="#FF9800" />
                  </View>
                  <Text style={styles.quickActionText}>Reports</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
            
            <View style={styles.bottomSpacer} />
          </ScrollView>
        );
      
      case 'chat':
        return (
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.chatContainer}
            keyboardVerticalOffset={80}
          >
            <Animated.View entering={FadeInDown.delay(100).duration(300)} style={styles.chatHeader}>
              <View style={styles.chatHeaderContent}>
                <Avatar.Text size={40} label="ST" style={styles.chatAvatar} />
                <View>
                  <Text style={styles.chatTitle}>Support Team</Text>
                  <Text style={styles.chatSubtitle}>Online • Typically replies in minutes</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.chatHeaderAction}>
                <Feather name="info" size={20} color="#6200EE" />
              </TouchableOpacity>
            </Animated.View>
            
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={item => item.id.toString()}
              style={styles.messageList}
              contentContainerStyle={styles.messageListContent}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              renderItem={({ item, index }) => (
                <MessageBubble message={item} index={index} />
              )}
            />
            
            <Animated.View entering={FadeInDown.delay(200).duration(300)} style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type a message..."
                placeholderTextColor="#999"
                multiline
              />
              <TouchableOpacity 
                style={[styles.sendButton, inputText.trim() === '' ? styles.sendButtonDisabled : styles.sendButtonActive]}
                onPress={sendMessage}
                disabled={inputText.trim() === ''}
              >
                <Feather name="send" size={20} color={inputText.trim() === '' ? "#999" : "#fff"} />
              </TouchableOpacity>
            </Animated.View>
          </KeyboardAvoidingView>
        );
      
      default:
        return <View />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <Appbar.Header style={styles.header}>
        <View style={styles.headerLeft}>
          <Avatar.Image size={40} source={{ uri: 'https://placehold.co/100x100' }} />
          <View style={styles.headerTitles}>
            <Text style={styles.headerTitle}>Dashboard</Text>
            <Text style={styles.headerSubtitle}>Employee Portal</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerAction}>
            <Feather name="search" size={22} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerAction}>
            <View style={styles.notificationContainer}>
              <Feather name="bell" size={22} color="#333" />
              <Badge style={styles.notificationBadge}>3</Badge>
            </View>
          </TouchableOpacity>
        </View>
      </Appbar.Header>
      
      {renderContent()}
      
      <Surface style={styles.bottomNav}>
        <Animated.View style={[styles.tabIndicator, tabIndicatorStyle]} />
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => handleTabChange('overview')}
        >
          <Ionicons 
            name="home" 
            size={22} 
            color={activeTab === 'overview' ? "#6200EE" : "#666"} 
          />
          <Text style={[styles.navText, activeTab === 'overview' && styles.activeNavText]}>Overview</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => handleTabChange('projects')}
        >
          <FontAwesome5 
            name="project-diagram" 
            size={20} 
            color={activeTab === 'projects' ? "#6200EE" : "#666"} 
          />
          <Text style={[styles.navText, activeTab === 'projects' && styles.activeNavText]}>Projects</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => handleTabChange('inventory')}
        >
          <MaterialCommunityIcons 
            name="package-variant-closed" 
            size={22} 
            color={activeTab === 'inventory' ? "#6200EE" : "#666"} 
          />
          <Text style={[styles.navText, activeTab === 'inventory' && styles.activeNavText]}>Inventory</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navItem} 
          onPress={() => handleTabChange('chat')}
        >
          <Ionicons 
            name="chatbubble-ellipses" 
            size={22} 
            color={activeTab === 'chat' ? "#6200EE" : "#666"} 
          />
          <Text style={[styles.navText, activeTab === 'chat' && styles.activeNavText]}>Support</Text>
        </TouchableOpacity>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#ffffff',
    elevation: 0,
    height: 70,
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitles: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAction: {
    marginLeft: 16,
    padding: 4,
  },
  notificationContainer: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#F44336',
  },
  content: {
    flex: 1,
    padding: 16,
    marginBottom: 70,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userName: {
    color: '#6200EE',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCardContainer: {
    width: '48%',
    marginBottom: 16,
  },
  statCard: {
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconContainer: {
    marginRight: 12,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statContent: {
    flex: 1,
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statTrendValue: {
    fontSize: 12,
    marginLeft: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionAction: {
    fontSize: 14,
    color: '#6200EE',
  },
  chartCard: {
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    backgroundColor: '#fff',
    marginBottom: 24,
  },
  chart: {
    borderRadius: 12,
    marginVertical: 8,
  },
  chartsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  smallChartContainer: {
    width: '48%',
  },
  smallChartCard: {
    borderRadius: 16,
    padding: 12,
    elevation: 2,
    backgroundColor: '#fff',
  },
  smallChartTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  smallChart: {
    borderRadius: 8,
  },
  taskItem: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    backgroundColor: '#fff',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  taskCheckbox: {
    marginRight: 12,
    marginTop: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  taskDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  teamBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
  },
  teamText: {
    fontSize: 10,
    color: '#333',
  },
  taskAction: {
    padding: 4,
  },
  projectCard: {
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  projectTitleContainer: {
    flex: 1,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  projectType: {
    fontSize: 12,
    color: '#666',
  },
  projectStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  projectStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  projectProgress: {
    marginBottom: 12,
  },
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: '#666',
  },
  progressValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  projectMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  teamAvatars: {
    flexDirection: 'row',
  },
  teamAvatar: {
    backgroundColor: '#6200EE',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6200EE20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addButtonText: {
    fontSize: 14,
    color: '#6200EE',
    marginLeft: 4,
  },
  analyticsCard: {
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    backgroundColor: '#fff',
    marginBottom: 24,
  },
  analyticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  analyticItem: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
  },
  analyticValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  analyticLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  analyticDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  analyticsSeparator: {
    marginVertical: 16,
  },
  inventoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  inventorySubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  inventoryActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inventoryAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6200EE20',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  primaryAction: {
    backgroundColor: '#6200EE',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 14,
    color: '#333',
  },
  scanButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    elevation: 2,
  },
  inventoryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  inventoryStat: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  inventoryStatIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  inventoryStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  inventoryStatLabel: {
    fontSize: 12,
    color: '#666',
  },
  inventoryItemCard: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    backgroundColor: '#fff',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inventoryItemIcon: {
    marginRight: 16,
  },
  itemIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inventoryItemContent: {
    flex: 1,
  },
  inventoryItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  inventoryItemQuantity: {
    fontSize: 12,
    color: '#666',
  },
  inventoryItemStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  inventoryItemStatusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#333',
  },
  chatContainer: {
    flex: 1,
    marginBottom: 70,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  chatHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatAvatar: {
    backgroundColor: '#6200EE',
    marginRight: 12,
  },
  chatTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  chatSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  chatHeaderAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6200EE20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageList: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  messageListContent: {
    padding: 16,
  },
  messageBubble: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#6200EE',
    borderRadius: 20,
    borderBottomRightRadius: 4,
    padding: 12,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    padding: 12,
    flexDirection: 'row',
    elevation: 2,
  },
  messageAvatar: {
    marginRight: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#6200EE',
  },
  messageContent: {
    flex: 1,
  },
  messageSender: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  messageText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
  messageText: {
    color: '#333',
  },
  messageTime: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  messageTime: {
    color: '#999',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingRight: 48,
    fontSize: 14,
    color: '#333',
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 16,
  },
  sendButtonActive: {
    backgroundColor: '#6200EE',
  },
  sendButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabIndicator: {
    position: 'absolute',
    height: 4,
    backgroundColor: '#6200EE',
    bottom: 0,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    flex: 1,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
  activeNavText: {
    color: '#6200EE',
    fontWeight: 'bold',
  },
  bottomSpacer: {
    height: 80,
  },
});

export default EmployeeDashboard;
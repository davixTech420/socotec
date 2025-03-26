import React, { useState, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Pressable,
  Text,
} from "react-native";
import {
  Card,
  Avatar,
  Button,
  FAB,
  Portal,
  Modal,
  TextInput,
  Chip,
  Title,
  Paragraph,
  Divider,
  useTheme,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
  SlideInRight,
  SlideOutLeft,
} from "react-native-reanimated";
import Breadcrumb from "@/components/BreadcrumbComponent";
import { createTask, getTaskMyGroup } from "@/services/employeeService";
import { useAuth } from "@/context/userContext";
import { useFocusEffect, router } from "expo-router";
const { width } = Dimensions.get("window");

// Sample data
const initialTeamMembers = [
  {
    id: 1,
    name: "Alex Chen",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    role: "UI Designer",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    role: "Frontend Developer",
  },
  {
    id: 3,
    name: "Miguel Rodriguez",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
    role: "Backend Developer",
  },
  {
    id: 4,
    name: "Aisha Patel",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    role: "Project Manager",
  },
];

const initialTasks = [
  {
    id: 1,
    title: "Design new dashboard",
    description: "Create wireframes for the new analytics dashboard",
    status: "In Progress",
    assignedTo: 1,
    priority: "High",
    dueDate: "2023-12-15",
  },
  {
    id: 2,
    title: "Implement authentication",
    description: "Add OAuth integration with Google and Apple",
    status: "To Do",
    assignedTo: 3,
    priority: "Medium",
    dueDate: "2023-12-20",
  },
  {
    id: 3,
    title: "Fix responsive layout",
    description: "Address layout issues on mobile devices",
    status: "In Progress",
    assignedTo: 2,
    priority: "High",
    dueDate: "2023-12-10",
  },
  {
    id: 4,
    title: "Weekly team meeting",
    description: "Discuss project progress and blockers",
    status: "To Do",
    assignedTo: 4,
    priority: "Low",
    dueDate: "2023-12-08",
  },
  {
    id: 5,
    title: "API documentation",
    description: "Update the API documentation with new endpoints",
    status: "Done",
    assignedTo: 3,
    priority: "Medium",
    dueDate: "2023-12-05",
  },
];

// Priority colors
const priorityColors = {
  High: "#FF5252",
  Medium: "#FFB74D",
  Low: "#4CAF50",
};
// Status colors
const statusColors = {
  "To Do": "#9C27B0",
  "In Progress": "#2196F3",
  Done: "#4CAF50",
};

// Animated Task Card Component
const TaskCard = ({ task, teamMembers, onPress }) => {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const assignedMember = teamMembers.find(
    (member) => member.id === task.asignadoId
  );
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { rotateZ: `${rotation.value}deg` }],
    };
  });
  const handlePressIn = () => {
    scale.value = withSpring(1.05);
    rotation.value = withSpring(1);
  };
  const handlePressOut = () => {
    scale.value = withSpring(1);
    rotation.value = withSpring(0);
  };
  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.taskCardContainer, animatedStyle]}>
        <Card
          style={[
            styles.taskCard,
            { borderLeftColor: priorityColors[task.priority] },
          ]}
        >
          <Card.Content>
            <View style={styles.taskHeader}>
              <Title style={styles.taskTitle}>{task.titulo}</Title>
              <Chip
                style={{ backgroundColor: statusColors[task.status] }}
                textStyle={{ color: "white", fontSize: 10 }}
              >
                {task.estado}
              </Chip>
            </View>
            <Paragraph style={styles.taskDescription}>
              {task.descripcion}
            </Paragraph>
            <Divider style={styles.divider} />
            <View style={styles.taskFooter}>
              <View style={styles.assigneeContainer}>
                <Avatar.Image
                  size={24}
                  source={{ uri: assignedMember?.avatar }}
                />
                <Text style={styles.assigneeName}>{assignedMember?.name}</Text>
              </View>
              <View style={styles.taskMeta}>
                <MaterialCommunityIcons
                  name="calendar-clock"
                  size={16}
                  color={theme.colors.primary}
                />
                <Text style={styles.dueDate}>{task.createdAt}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </Animated.View>
    </Pressable>
  );
};

// Team Member Component
const TeamMember = ({ member, tasks, onPress, isSelected }) => {
  const theme = useTheme();
  const memberTasks = tasks.filter((task) => task.asignadoId === member.id);
  const completedTasks = memberTasks.filter(
    (task) => task.estado === false
  ).length;
  const progress =
    memberTasks.length > 0 ? completedTasks / memberTasks.length : 0;
  const progressWidth = useSharedValue(0);
  React.useEffect(() => {
    progressWidth.value = withSpring(progress);
  }, [progress]);
  // Fixed: Use direct color values instead of interpolateColor
  const progressStyle = useAnimatedStyle(() => {
    // Determine color based on progress value
    let backgroundColor;
    if (progress < 0.3) {
      backgroundColor = "#FF5252"; // Error/red for low progress
    } else if (progress < 0.7) {
      backgroundColor = "#FFB74D"; // Warning/orange for medium progress
    } else {
      backgroundColor = "#4CAF50"; // Success/green for high progress
    }
    return {
      width: `${progressWidth.value * 100}%`,
      backgroundColor,
    };
  });

  return (
    <Pressable onPress={() => onPress(member)}>
      <Animated.View
        entering={FadeIn.duration(500)}
        style={[
          styles.teamMemberCard,
          isSelected && { borderColor: theme.colors.primary, borderWidth: 2 },
        ]}
      >
        <Avatar.Image size={60} source={{ uri: member.avatar }} />
        <View style={styles.memberInfo}>
          <Title style={styles.memberName}>{member.nombre}</Title>
          <Paragraph style={styles.memberRole}>{member.role}</Paragraph>
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <Animated.View style={[styles.progressFill, progressStyle]} />
            </View>
            <Text style={styles.progressText}>
              {completedTasks}/{memberTasks.length} tasks
            </Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

// Main Component
const TaskBoard = () => {
  const theme = useTheme();
  const [teamMembers, setTeamMembers] = useState(initialTeamMembers);
  const [tasks, setTasks] = useState(initialTasks);
  const [visible, setVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [logueado, setLogueado] = useState(null);
  const { user } = useAuth();
  const [newTask, setNewTask] = useState({
    asignadoId: "",
    titulo: "",
    descripcion: "",
  });
  const [taskView, setTaskView] = useState("all");
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const userData = await user();
        setLogueado(userData);
        const api = await getTaskMyGroup(userData.id);
        setTeamMembers(api.users);
        setTasks(api.tasks);
      };
      fetchData();
    }, [])
  );
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const handleSelectMember = (member) => {
    if (selectedMember && selectedMember.id === member.id) {
      setSelectedMember(null);
      setTaskView("all");
    } else {
      console.log();
      setNewTask({ ...newTask, asignadoId: member.id });
      setSelectedMember(member);
      setTaskView("member");
    }
  };
  const handleAddTask = async () => {
    if (!newTask.titulo) return;
    const task = {
      id: tasks.length + 1,
      ...newTask,
      asignadoId: selectedMember ? selectedMember.id : null,
    };
    setTasks([...tasks, task]);
    setNewTask({
      asignadoId: selectedMember?.id,
      titulo: "",
      descripcion: "",
    });
    await createTask(newTask).then(console.log).catch(console.error);
    hideModal();
  };

  const filteredTasks =
    taskView === "all"
      ? tasks
      : tasks.filter((task) => task.asignadoId === selectedMember?.id);

  // Animation for task list
  const taskListRef = useRef(null);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Breadcrumb
          items={[
            {
              label: "Dashboard",
              onPress: () => router.navigate("/(employee)/DashboardE"),
            },
            {
              label: "Mi Grupo De Trabajo",
            },
          ]}
        />
        <Title style={styles.headerTitle}>Team Tasks</Title>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.teamMembersContainer}
        contentContainerStyle={styles.teamMembersContent}
      >
        {teamMembers.map((member) => (
          <TeamMember
            key={member.id}
            member={member}
            tasks={tasks}
            onPress={handleSelectMember}
            isSelected={selectedMember?.id === member.id}
          />
        ))}
      </ScrollView>
      <View style={styles.filterContainer}>
        <Title style={styles.taskListTitle}>
          {taskView === "all"
            ? "All Tasks"
            : `${selectedMember?.nombre}'s Tasks`}
        </Title>
        {selectedMember && (
          <Button
            mode="text"
            onPress={() => {
              setSelectedMember(null);
              setTaskView("all");
            }}
          >
            View All
          </Button>
        )}
      </View>
      <ScrollView
        ref={taskListRef}
        style={styles.tasksContainer}
        contentContainerStyle={styles.tasksContent}
      >
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <Animated.View
              key={task.id}
              entering={SlideInRight.duration(300).delay(task.id * 100)}
              exiting={SlideOutLeft.duration(300)}
            >
              <TaskCard
                task={task}
                teamMembers={teamMembers}
                onPress={() => console.log("Task pressed:", task)}
              />
            </Animated.View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={64} />
            <Text style={styles.emptyStateText}>No Ahy Tareas Disponibles</Text>
          </View>
        )}
      </ScrollView>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modalContainer}
        >
          <Title style={styles.modalTitle}>Create New Task</Title>
          <TextInput
            label="Task Title"
            value={newTask.titulo}
            onChangeText={(text) => setNewTask({ ...newTask, titulo: text })}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Description"
            value={newTask.descripcion}
            onChangeText={(text) =>
              setNewTask({ ...newTask, descripcion: text })
            }
            style={styles.input}
            multiline
            numberOfLines={3}
            mode="outlined"
          />

          <View style={styles.modalActions}>
            <Button onPress={hideModal} style={styles.modalButton}>
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleAddTask}
              disabled={!newTask.titulo}
              style={styles.modalButton}
            >
              Create Task
            </Button>
          </View>
        </Modal>
      </Portal>

      <FAB style={styles.fab} icon="plus" onPress={showModal} />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f7",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  teamMembersContainer: {
    maxHeight: 140,
    marginBottom: 16,
  },
  teamMembersContent: {
    paddingRight: 16,
  },
  teamMemberCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    width: width * 0.7,
    maxWidth: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  memberInfo: {
    marginLeft: 12,
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  memberRole: {
    fontSize: 12,
    color: "#666",
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBackground: {
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 10,
    marginTop: 4,
    color: "#666",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  taskListTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  tasksContainer: {
    flex: 1,
  },
  tasksContent: {
    paddingBottom: 80,
  },
  taskCardContainer: {
    marginBottom: 12,
  },
  taskCard: {
    borderLeftWidth: 4,
    borderRadius: 8,
    backgroundColor: "white",
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    marginRight: 8,
  },
  taskDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  divider: {
    marginVertical: 8,
  },
  taskFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  assigneeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  assigneeName: {
    fontSize: 12,
    marginLeft: 8,
    color: "#666",
  },
  taskMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  dueDate: {
    fontSize: 12,
    marginLeft: 4,
    color: "#666",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  modalTitle: {
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  inputHalf: {
    width: "48%",
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  modalButton: {
    marginLeft: 8,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default TaskBoard;

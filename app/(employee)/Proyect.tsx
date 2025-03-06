"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import {
  Card,
  Title,
  Paragraph,
  Button,
  FAB,
  Provider as PaperProvider,
  Chip,
  Avatar,
  ProgressBar,
  Appbar,
  List,
  Searchbar,
  IconButton,
} from "react-native-paper"
import { Calendar } from "react-native-calendars"
import { PieChart } from "react-native-chart-kit"

// Types
interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in-progress" | "review" | "done"
  priority: "low" | "medium" | "high"
  assignee: string
  dueDate: string
  comments: Comment[]
  attachments: Attachment[]
}

interface Comment {
  id: string
  author: string
  text: string
  timestamp: string
}

interface Attachment {
  id: string
  name: string
  url: string
  type: "image" | "document" | "other"
}

interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
}

interface ProjectUpdate {
  id: string
  title: string
  description: string
  author: string
  timestamp: string
  attachments: Attachment[]
}

interface Project {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  status: "active" | "completed" | "on-hold"
  progress: number
  tasks: Task[]
  team: TeamMember[]
  updates: ProjectUpdate[]
}

// Sample data
const sampleProject: Project = {
  id: "1",
  name: "Website Redesign",
  description: "Redesign and development of company website",
  startDate: "2023-06-01",
  endDate: "2023-08-31",
  status: "active",
  progress: 35,
  tasks: [
    {
      id: "1",
      title: "Create wireframes",
      description: "Design initial wireframes for homepage and key pages",
      status: "done",
      priority: "high",
      assignee: "Sarah Williams",
      dueDate: "2023-06-15",
      comments: [],
      attachments: [],
    },
    {
      id: "2",
      title: "Develop frontend",
      description: "Implement the frontend based on approved designs",
      status: "in-progress",
      priority: "high",
      assignee: "Alex Johnson",
      dueDate: "2023-07-31",
      comments: [],
      attachments: [],
    },
    {
      id: "3",
      title: "Backend integration",
      description: "Integrate the frontend with backend APIs",
      status: "todo",
      priority: "medium",
      assignee: "Michael Chen",
      dueDate: "2023-08-15",
      comments: [],
      attachments: [],
    },
  ],
  team: [
    { id: "1", name: "Sarah Williams", role: "Designer", avatar: "https://i.pravatar.cc/150?img=47" },
    { id: "2", name: "Alex Johnson", role: "Frontend Developer", avatar: "https://i.pravatar.cc/150?img=68" },
    { id: "3", name: "Michael Chen", role: "Backend Developer", avatar: "https://i.pravatar.cc/150?img=12" },
  ],
  updates: [
    {
      id: "1",
      title: "Design phase completed",
      description: "All wireframes and mockups have been approved by the client",
      author: "Sarah Williams",
      timestamp: "2023-06-20T10:30:00Z",
      attachments: [],
    },
  ],
}

// Components
const TaskCard = ({ task, onPress }: { task: Task; onPress: () => void }) => {
  const priorityColors = {
    low: "#4CAF50",
    medium: "#FFC107",
    high: "#F44336",
  }

  return (
    <Card style={styles.taskCard} onPress={onPress}>
      <Card.Content>
        <Title>{task.title}</Title>
        <Paragraph numberOfLines={2}>{task.description}</Paragraph>
        <View style={styles.taskCardFooter}>
          <Chip icon="flag" selectedColor={priorityColors[task.priority]}>
            {task.priority}
          </Chip>
          <Chip icon="account">{task.assignee}</Chip>
          <Chip icon="calendar">{task.dueDate}</Chip>
        </View>
      </Card.Content>
    </Card>
  )
}

const ProjectDashboard = ({ project }: { project: Project }) => {
  const [activeTab, setActiveTab] = useState("overview")

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <ProjectOverview project={project} />
      case "tasks":
        return <TaskList tasks={project.tasks} />
      case "team":
        return <TeamList team={project.team} />
      case "updates":
        return <UpdatesList updates={project.updates} />
      case "calendar":
        return <ProjectCalendar project={project} />
      case "files":
        return <FileManager />
      default:
        return null
    }
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title={project.name} subtitle={`Progress: ${project.progress}%`} />
        <Appbar.Action icon="bell" onPress={() => {}} />
        <Appbar.Action icon="dots-vertical" onPress={() => {}} />
      </Appbar.Header>
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Button
            mode={activeTab === "overview" ? "contained" : "outlined"}
            onPress={() => setActiveTab("overview")}
            style={styles.tabButton}
          >
            Overview
          </Button>
          <Button
            mode={activeTab === "tasks" ? "contained" : "outlined"}
            onPress={() => setActiveTab("tasks")}
            style={styles.tabButton}
          >
            Tasks
          </Button>
          <Button
            mode={activeTab === "team" ? "contained" : "outlined"}
            onPress={() => setActiveTab("team")}
            style={styles.tabButton}
          >
            Team
          </Button>
          <Button
            mode={activeTab === "updates" ? "contained" : "outlined"}
            onPress={() => setActiveTab("updates")}
            style={styles.tabButton}
          >
            Updates
          </Button>
          <Button
            mode={activeTab === "calendar" ? "contained" : "outlined"}
            onPress={() => setActiveTab("calendar")}
            style={styles.tabButton}
          >
            Calendar
          </Button>
          <Button
            mode={activeTab === "files" ? "contained" : "outlined"}
            onPress={() => setActiveTab("files")}
            style={styles.tabButton}
          >
            Files
          </Button>
        </ScrollView>
      </View>
      <ScrollView style={styles.content}>{renderTabContent()}</ScrollView>
      <FAB style={styles.fab} icon="plus" onPress={() => {}} label="Add Task" />
    </View>
  )
}

const ProjectOverview = ({ project }: { project: Project }) => {
  return (
    <View>
      <Card style={styles.overviewCard}>
        <Card.Content>
          <Title>Project Status</Title>
          <Paragraph>{project.status}</Paragraph>
          <ProgressBar progress={project.progress / 100} color="#6200ee" style={styles.progressBar} />
          <Paragraph>Start Date: {project.startDate}</Paragraph>
          <Paragraph>End Date: {project.endDate}</Paragraph>
        </Card.Content>
      </Card>
      <Card style={styles.overviewCard}>
        <Card.Content>
          <Title>Task Overview</Title>
          <PieChart
            data={[
              {
                name: "To Do",
                population: project.tasks.filter((t) => t.status === "todo").length,
                color: "#F44336",
                legendFontColor: "#7F7F7F",
                legendFontSize: 12,
              },
              {
                name: "In Progress",
                population: project.tasks.filter((t) => t.status === "in-progress").length,
                color: "#2196F3",
                legendFontColor: "#7F7F7F",
                legendFontSize: 12,
              },
              {
                name: "Review",
                population: project.tasks.filter((t) => t.status === "review").length,
                color: "#FFEB3B",
                legendFontColor: "#7F7F7F",
                legendFontSize: 12,
              },
              {
                name: "Done",
                population: project.tasks.filter((t) => t.status === "done").length,
                color: "#4CAF50",
                legendFontColor: "#7F7F7F",
                legendFontSize: 12,
              },
            ]}
            width={300}
            height={200}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </Card.Content>
      </Card>
    </View>
  )
}

const TaskList = ({ tasks }: { tasks: Task[] }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredTasks, setFilteredTasks] = useState(tasks)

  useEffect(() => {
    const filtered = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredTasks(filtered)
  }, [searchQuery, tasks])

  return (
    <View>
      <Searchbar
        placeholder="Search tasks"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      {filteredTasks.map((task) => (
        <TaskCard key={task.id} task={task} onPress={() => {}} />
      ))}
    </View>
  )
}

const TeamList = ({ team }: { team: TeamMember[] }) => {
  return (
    <View>
      {team.map((member) => (
        <List.Item
          key={member.id}
          title={member.name}
          description={member.role}
          left={(props) => <Avatar.Image {...props} source={{ uri: member.avatar }} />}
          right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => {}} />}
        />
      ))}
    </View>
  )
}

const UpdatesList = ({ updates }: { updates: ProjectUpdate[] }) => {
  return (
    <View>
      {updates.map((update) => (
        <Card key={update.id} style={styles.updateCard}>
          <Card.Content>
            <Title>{update.title}</Title>
            <Paragraph>{update.description}</Paragraph>
            <View style={styles.updateCardFooter}>
              <Chip icon="account">{update.author}</Chip>
              <Chip icon="clock-outline">{new Date(update.timestamp).toLocaleString()}</Chip>
            </View>
          </Card.Content>
        </Card>
      ))}
    </View>
  )
}

const ProjectCalendar = ({ project }: { project: Project }) => {
  const markedDates = project.tasks.reduce((acc, task) => {
    acc[task.dueDate] = { marked: true, dotColor: "#6200ee" }
    return acc
  }, {})

  return (
    <View>
      <Calendar
        markedDates={markedDates}
        theme={{
          backgroundColor: "#ffffff",
          calendarBackground: "#ffffff",
          textSectionTitleColor: "#b6c1cd",
          textSectionTitleDisabledColor: "#d9e1e8",
          selectedDayBackgroundColor: "#6200ee",
          selectedDayTextColor: "#ffffff",
          todayTextColor: "#6200ee",
          dayTextColor: "#2d4150",
          textDisabledColor: "#d9e1e8",
          dotColor: "#6200ee",
          selectedDotColor: "#ffffff",
          arrowColor: "#6200ee",
          disabledArrowColor: "#d9e1e8",
          monthTextColor: "#6200ee",
          indicatorColor: "#6200ee",
          textDayFontFamily: "monospace",
          textMonthFontFamily: "monospace",
          textDayHeaderFontFamily: "monospace",
          textDayFontWeight: "300",
          textMonthFontWeight: "bold",
          textDayHeaderFontWeight: "300",
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 16,
        }}
      />
    </View>
  )
}

const FileManager = () => {
  const [files, setFiles] = useState([
    { id: "1", name: "Project Proposal.pdf", type: "document" },
    { id: "2", name: "Design Mockups.zip", type: "other" },
    { id: "3", name: "Team Photo.jpg", type: "image" },
  ])

  const getFileIcon = (type) => {
    switch (type) {
      case "document":
        return "file-document-outline"
      case "image":
        return "file-image-outline"
      default:
        return "file-outline"
    }
  }

  return (
    <View>
      {files.map((file) => (
        <List.Item
          key={file.id}
          title={file.name}
          left={(props) => <List.Icon {...props} icon={getFileIcon(file.type)} />}
          right={(props) => <IconButton {...props} icon="download" onPress={() => {}} />}
        />
      ))}
      <Button icon="upload" mode="contained" onPress={() => {}} style={styles.uploadButton}>
        Upload File
      </Button>
    </View>
  )
}

const Proyect = () => {
  return (
    <PaperProvider>
      <ProjectDashboard project={sampleProject} />
    </PaperProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  tabContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: "#ffffff",
  },
  tabButton: {
    marginHorizontal: 5,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  taskCard: {
    marginBottom: 10,
  },
  taskCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  overviewCard: {
    marginBottom: 10,
  },
  progressBar: {
    marginVertical: 10,
  },
  updateCard: {
    marginBottom: 10,
  },
  updateCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  searchBar: {
    marginBottom: 10,
  },
  uploadButton: {
    marginTop: 10,
  },
})

export default Proyect


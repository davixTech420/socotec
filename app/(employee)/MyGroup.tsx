"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet, Pressable } from "react-native"
import {
  Text,
  IconButton,
  Searchbar,
  Provider as PaperProvider,
  configureFonts,
  MD3DarkTheme,
  Avatar,
} from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import Animated, {
  FadeIn,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation,
  withTiming,
  withDelay,
  useAnimatedScrollHandler,
  Easing,
  withRepeat,
  withSequence,
} from "react-native-reanimated"

// Types for our team members
type TeamMemberStatus = "online" | "offline" | "busy" | "away"
type TeamMemberRole = "developer" | "designer" | "manager" | "marketing" | "sales"

interface TeamMember {
  id: string
  name: string
  role: TeamMemberRole
  avatar: string
  status: TeamMemberStatus
  email: string
  phone: string
  department: string
  projects: string[]
  skills: string[]
  availability: number
}

// Sample data
const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "1",
    name: "Alex Johnson",
    role: "developer",
    avatar: "https://i.pravatar.cc/300?img=68",
    status: "online",
    email: "alex@example.com",
    phone: "+1 (555) 123-4567",
    department: "Engineering",
    projects: ["Mobile App", "Website Redesign"],
    skills: ["React Native", "TypeScript", "Node.js"],
    availability: 85,
  },
  {
    id: "2",
    name: "Sarah Williams",
    role: "designer",
    avatar: "https://i.pravatar.cc/300?img=47",
    status: "busy",
    email: "sarah@example.com",
    phone: "+1 (555) 987-6543",
    department: "Design",
    projects: ["Brand Guidelines", "UI Kit"],
    skills: ["UI/UX", "Figma", "Motion Design"],
    availability: 60,
  },
  {
    id: "3",
    name: "Michael Chen",
    role: "manager",
    avatar: "https://i.pravatar.cc/300?img=12",
    status: "online",
    email: "michael@example.com",
    phone: "+1 (555) 456-7890",
    department: "Product",
    projects: ["Q3 Roadmap", "Team Growth"],
    skills: ["Leadership", "Strategy", "Agile"],
    availability: 90,
  },
  {
    id: "4",
    name: "Emily Rodriguez",
    role: "marketing",
    avatar: "https://i.pravatar.cc/300?img=25",
    status: "away",
    email: "emily@example.com",
    phone: "+1 (555) 234-5678",
    department: "Marketing",
    projects: ["Social Media Campaign", "Product Launch"],
    skills: ["Content Strategy", "Analytics", "SEO"],
    availability: 75,
  },
  {
    id: "5",
    name: "David Kim",
    role: "developer",
    avatar: "https://i.pravatar.cc/300?img=15",
    status: "offline",
    email: "david@example.com",
    phone: "+1 (555) 876-5432",
    department: "Engineering",
    projects: ["API Integration", "Performance Optimization"],
    skills: ["Backend", "DevOps", "Python"],
    availability: 0,
  },
  {
    id: "6",
    name: "Lisa Patel",
    role: "sales",
    avatar: "https://i.pravatar.cc/300?img=32",
    status: "online",
    email: "lisa@example.com",
    phone: "+1 (555) 345-6789",
    department: "Sales",
    projects: ["Enterprise Deals", "Client Retention"],
    skills: ["Negotiation", "CRM", "Presentations"],
    availability: 95,
  },
]

// Custom theme
const fontConfig = {
  fontFamily: "System",
}

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#6C5CE7",
    secondary: "#00CFFD",
    tertiary: "#FF2D92",
    background: "#0A0A1A",
    surface: "#13132B",
    surfaceVariant: "#1E1E42",
    error: "#FF4757",
  },
  fonts: configureFonts({ config: fontConfig }),
}

// Status indicator component with animation
const StatusIndicator = ({ status }: { status: TeamMemberStatus }) => {
  const statusColors = {
    online: "#00F5A0",
    offline: "#A0A0B9",
    busy: "#FF4757",
    away: "#FDCB6E",
  }

  const pulseAnim = useSharedValue(1)

  useEffect(() => {
    if (status === "online") {
      pulseAnim.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      )
    } else {
      pulseAnim.value = 1
    }
  }, [status])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseAnim.value }],
      opacity: interpolate(pulseAnim.value, [1, 1.2], [1, 0.7], Extrapolation.CLAMP),
    }
  })

  return (
    <View style={styles.statusContainer}>
      <Animated.View style={[styles.statusDot, { backgroundColor: statusColors[status] }, animatedStyle]} />
    </View>
  )
}

// Role icon component with futuristic styling
const RoleIcon = ({ role, size = 18 }: { role: TeamMemberRole; size?: number }) => {
  const iconMap = {
    developer: "code-braces",
    designer: "palette-swatch",
    manager: "account-tie",
    marketing: "bullhorn",
    sales: "chart-line",
  }

  const colors = {
    developer: "#6C5CE7",
    designer: "#FF2D92",
    manager: "#00CFFD",
    marketing: "#FDCB6E",
    sales: "#00F5A0",
  }

  return (
    <View
      style={[
        styles.roleIconContainer,
        { backgroundColor: colors[role], width: size * 2, height: size * 2, borderRadius: size },
      ]}
    >
      <MaterialCommunityIcons name={iconMap[role]} size={size} color="#FFF" />
    </View>
  )
}

// Skill tag component
const SkillTag = ({ skill }: { skill: string }) => {
  return (
    <View style={styles.skillTag}>
      <Text style={styles.skillText}>{skill}</Text>
    </View>
  )
}

// Availability indicator
const AvailabilityIndicator = ({ percentage }: { percentage: number }) => {
  const width = useSharedValue(0)

  useEffect(() => {
    width.value = withTiming(percentage / 100, { duration: 1000 })
  }, [percentage])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${width.value * 100}%`,
    }
  })

  const getColor = () => {
    if (percentage >= 80) return "#00F5A0"
    if (percentage >= 50) return "#FDCB6E"
    if (percentage > 0) return "#FF4757"
    return "#A0A0B9"
  }

  return (
    <View style={styles.availabilityContainer}>
      <Text style={styles.availabilityText}>{percentage > 0 ? `${percentage}% Available` : "Unavailable"}</Text>
      <View style={styles.availabilityTrack}>
        <Animated.View style={[styles.availabilityIndicator, animatedStyle, { backgroundColor: getColor() }]} />
      </View>
    </View>
  )
}

// Team member card component with futuristic design
const TeamMemberCard = ({
  member,
  expanded,
  onPress,
  onMessage,
  onCall,
  onEmail,
  index,
}: {
  member: TeamMember
  expanded: boolean
  onPress: () => void
  onMessage: () => void
  onCall: () => void
  onEmail: () => void
  index: number
}) => {
  const scale = useSharedValue(1)
  const translateY = useSharedValue(50)
  const opacity = useSharedValue(0)

  useEffect(() => {
    translateY.value = withDelay(index * 100, withTiming(0, { duration: 800, easing: Easing.out(Easing.cubic) }))
    opacity.value = withDelay(index * 100, withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) }))
  }, [])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { translateY: translateY.value }],
      opacity: opacity.value,
    }
  })

  const handlePressIn = () => {
    scale.value = withTiming(0.97, { duration: 200, easing: Easing.out(Easing.cubic) })
  }

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) })
  }

  return (
    <Animated.View style={[styles.cardContainer, animatedStyle]}>
      <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.avatarContainer}>
              <Avatar.Image source={{ uri: member.avatar }} size={50} />
              <StatusIndicator status={member.status} />
            </View>

            <View style={styles.nameContainer}>
              <Text style={styles.nameText}>{member.name}</Text>
              <View style={styles.roleContainer}>
                <RoleIcon role={member.role} size={14} />
                <Text style={styles.roleText}>{member.role.charAt(0).toUpperCase() + member.role.slice(1)}</Text>
              </View>
              <Text style={styles.departmentText}>{member.department}</Text>
            </View>

            <IconButton
              icon={expanded ? "chevron-up" : "chevron-down"}
              iconColor="rgba(255,255,255,0.8)"
              size={20}
              onPress={onPress}
              style={styles.expandButton}
            />
          </View>

          <AvailabilityIndicator percentage={member.availability} />

          {expanded && (
            <Animated.View entering={SlideInRight.duration(300).springify()} style={styles.expandedContent}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Skills</Text>
                <View style={styles.skillsContainer}>
                  {member.skills.map((skill, idx) => (
                    <SkillTag key={idx} skill={skill} />
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Current Projects</Text>
                <View style={styles.projectsContainer}>
                  {member.projects.map((project, idx) => (
                    <View key={idx} style={styles.projectItem}>
                      <MaterialCommunityIcons name="folder-outline" size={16} color="rgba(255,255,255,0.6)" />
                      <Text style={styles.projectText}>{project}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Contact</Text>
                <View style={styles.contactContainer}>
                  <View style={styles.contactItem}>
                    <MaterialCommunityIcons name="email-outline" size={16} color="rgba(255,255,255,0.6)" />
                    <Text style={styles.contactText}>{member.email}</Text>
                  </View>
                  <View style={styles.contactItem}>
                    <MaterialCommunityIcons name="phone-outline" size={16} color="rgba(255,255,255,0.6)" />
                    <Text style={styles.contactText}>{member.phone}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.actionButtons}>
                <Pressable onPress={onMessage} style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}>
                  <MaterialCommunityIcons name="message-outline" size={18} color="#FFF" />
                  <Text style={styles.actionText}>Message</Text>
                </Pressable>

                <Pressable onPress={onCall} style={[styles.actionButton, { backgroundColor: theme.colors.secondary }]}>
                  <MaterialCommunityIcons name="phone-outline" size={18} color="#FFF" />
                  <Text style={styles.actionText}>Call</Text>
                </Pressable>

                <Pressable onPress={onEmail} style={[styles.actionButton, { backgroundColor: theme.colors.tertiary }]}>
                  <MaterialCommunityIcons name="email-outline" size={18} color="#FFF" />
                  <Text style={styles.actionText}>Email</Text>
                </Pressable>
              </View>
            </Animated.View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  )
}

// Filter chip component
const FilterChip = ({
  label,
  active,
  onPress,
  icon,
  color,
}: {
  label: string
  active: boolean
  onPress: () => void
  icon: string
  color: string
}) => {
  const scale = useSharedValue(1)

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 200 })
  }

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 300 })
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    }
  })

  return (
    <Animated.View style={animatedStyle}>
      <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <View style={[styles.filterChip, active && { backgroundColor: color }]}>
          <MaterialCommunityIcons name={icon} size={16} color={active ? "#FFF" : "rgba(255,255,255,0.6)"} />
          <Text style={[styles.filterText, active && styles.activeFilterText]}>{label}</Text>
        </View>
      </Pressable>
    </Animated.View>
  )
}

// Custom circular progress component
const CircularProgress = ({ percentage }: { percentage: number }) => {
  const animatedPercentage = useSharedValue(0)

  useEffect(() => {
    animatedPercentage.value = withTiming(percentage, { duration: 1500 })
  }, [percentage])

  const animatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(animatedPercentage.value, [0, 100], [0, 360])
    return {
      transform: [{ rotate: `${rotation}deg` }],
    }
  })

  return (
    <View style={styles.circularProgressContainer}>
      <View style={styles.circularProgressBackground} />
      <Animated.View style={[styles.circularProgressFill, animatedStyle]} />
      <View style={styles.circularProgressCenter} />
      <Text style={styles.circularProgressText}>{`${Math.round(percentage)}%`}</Text>
    </View>
  )
}

// Team stats component with animated progress
const TeamStats = ({ members }: { members: TeamMember[] }) => {
  const onlineCount = members.filter((m) => m.status === "online").length
  const totalCount = members.length
  const onlinePercentage = Math.round((onlineCount / totalCount) * 100)

  return (
    <Animated.View entering={FadeIn.duration(800).delay(200)} style={styles.statsContainer}>
      <View style={styles.statsCard}>
        <View style={styles.statsHeader}>
          <Text style={styles.statsTitle}>Team Overview</Text>
          <MaterialCommunityIcons name="dots-horizontal" size={24} color="rgba(255,255,255,0.6)" />
        </View>

        <View style={styles.statsContent}>
          <CircularProgress percentage={onlinePercentage} />

          <View style={styles.statsDetails}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalCount}</Text>
              <Text style={styles.statLabel}>Team Members</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statValue}>{onlineCount}</Text>
              <Text style={styles.statLabel}>Currently Active</Text>
            </View>

            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {Math.round(members.reduce((sum, member) => sum + member.availability, 0) / members.length)}%
              </Text>
              <Text style={styles.statLabel}>Avg. Availability</Text>
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  )
}

// Main component
const MyGroup = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>(TEAM_MEMBERS)
  const [activeFilter, setActiveFilter] = useState<TeamMemberRole | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const scrollY = useSharedValue(0)

  // Animated header
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y
    },
  })

  const headerStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [0, 50], [1, 0.9], Extrapolation.CLAMP),
      transform: [
        {
          translateY: interpolate(scrollY.value, [0, 100], [0, -20], Extrapolation.CLAMP),
        },
      ],
    }
  })

  const searchBarStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(scrollY.value, [0, 100], [1, 0.95], Extrapolation.CLAMP),
        },
        {
          translateY: interpolate(scrollY.value, [0, 100], [0, -10], Extrapolation.CLAMP),
        },
      ],
    }
  })

  // Handle filter changes
  const handleFilterChange = (filter: TeamMemberRole | "all") => {
    setActiveFilter(filter)
  }

  // Apply filters and search
  useEffect(() => {
    let result = [...TEAM_MEMBERS]

    // Apply role filter
    if (activeFilter !== "all") {
      result = result.filter((member) => member.role === activeFilter)
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (member) =>
          member.name.toLowerCase().includes(query) ||
          member.role.toLowerCase().includes(query) ||
          member.department.toLowerCase().includes(query) ||
          member.projects.some((project) => project.toLowerCase().includes(query)) ||
          member.skills.some((skill) => skill.toLowerCase().includes(query)),
      )
    }

    setFilteredMembers(result)
  }, [activeFilter, searchQuery])

  // Action handlers
  const handleMessage = (member: TeamMember) => {
    // In a real app, this would open a messaging interface
    alert(`Messaging ${member.name}`)
  }

  const handleCall = (member: TeamMember) => {
    // In a real app, this would initiate a call
    alert(`Calling ${member.name} at ${member.phone}`)
  }

  const handleEmail = (member: TeamMember) => {
    // In a real app, this would open the email client
    alert(`Emailing ${member.name} at ${member.email}`)
  }

  // Filter options
  const filterOptions = [
    { label: "All", value: "all", icon: "account-group", color: theme.colors.primary },
    { label: "Developers", value: "developer", icon: "code-braces", color: "#6C5CE7" },
    { label: "Designers", value: "designer", icon: "palette-swatch", color: "#FF2D92" },
    { label: "Managers", value: "manager", icon: "account-tie", color: "#00CFFD" },
    { label: "Marketing", value: "marketing", icon: "bullhorn", color: "#FDCB6E" },
    { label: "Sales", value: "sales", icon: "chart-line", color: "#00F5A0" },
  ]

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <Animated.View style={[styles.header, headerStyle]}>
          <Text style={styles.title}>Team Nexus</Text>
          <View style={styles.headerActions}>
            <IconButton icon="bell-outline" iconColor="rgba(255,255,255,0.8)" size={24} style={styles.headerButton} />
            <IconButton icon="cog-outline" iconColor="rgba(255,255,255,0.8)" size={24} style={styles.headerButton} />
          </View>
        </Animated.View>

        <Animated.View style={[styles.searchBarContainer, searchBarStyle]}>
          <Searchbar
            placeholder="Search team members..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            inputStyle={styles.searchInput}
            iconColor="rgba(255,255,255,0.6)"
            placeholderTextColor="rgba(255,255,255,0.4)"
          />
        </Animated.View>

        <TeamStats members={filteredMembers} />

        <View style={styles.filtersContainer}>
          <Animated.ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScroll}
          >
            {filterOptions.map((option) => (
              <FilterChip
                key={option.value}
                label={option.label}
                active={activeFilter === option.value}
                onPress={() => handleFilterChange(option.value)}
                icon={option.icon}
                color={option.color}
              />
            ))}
          </Animated.ScrollView>
        </View>

        <Animated.FlatList
          data={filteredMembers}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <TeamMemberCard
              member={item}
              expanded={expandedId === item.id}
              onPress={() => setExpandedId(expandedId === item.id ? null : item.id)}
              onMessage={() => handleMessage(item)}
              onCall={() => handleCall(item)}
              onEmail={() => handleEmail(item)}
              index={index}
            />
          )}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          showsVerticalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="account-search" size={60} color="rgba(255,255,255,0.3)" />
              <Text style={styles.emptyText}>No team members found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your filters or search</Text>
            </View>
          )}
        />
      </View>
    </PaperProvider>
  )
}

// Styles with futuristic design
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "black",
    letterSpacing: 0.5,
  },
  headerActions: {
    flexDirection: "row",
  },
  headerButton: {
    margin: 0,
  },
  searchBarContainer: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
  searchBar: {
    elevation: 0,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 16,
  },
  searchInput: {
    color: "#FFF",
  },
  statsContainer: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
  statsCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  statsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
  },
  statsContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  circularProgressContainer: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  circularProgressBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 8,
    borderColor: "rgba(255,255,255,0.1)",
    position: "absolute",
  },
  circularProgressFill: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 8,
    borderColor: theme.colors.primary,
    borderLeftColor: "transparent",
    borderBottomColor: "transparent",
    position: "absolute",
    transform: [{ rotate: "45deg" }],
  },
  circularProgressCenter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: theme.colors.surface,
    position: "absolute",
  },
  circularProgressText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
  },
  statsDetails: {
    flex: 1,
    marginLeft: 16,
  },
  statItem: {
    marginBottom: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
  },
  filtersContainer: {
    marginBottom: 20,
  },
  filtersScroll: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    gap: 12,
    flexDirection: "row",
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  filterText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    marginLeft: 6,
  },
  activeFilterText: {
    color: "#FFF",
    fontWeight: "500",
  },
  list: {
    paddingBottom: 24,
  },
  cardContainer: {
    borderRadius: 16,
    overflow: "hidden",
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  statusContainer: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  statusDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  nameContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 2,
  },
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  roleIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  roleText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  departmentText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
  },
  expandButton: {
    margin: 0,
  },
  availabilityContainer: {
    marginTop: 12,
    marginBottom: 8,
  },
  availabilityText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 4,
  },
  availabilityTrack: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 2,
    overflow: "hidden",
  },
  availabilityIndicator: {
    height: "100%",
  },
  expandedContent: {
    marginTop: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.8)",
    marginBottom: 8,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillTag: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  skillText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
  },
  projectsContainer: {
    gap: 8,
  },
  projectItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  projectText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginLeft: 8,
  },
  contactContainer: {
    gap: 8,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFF",
  },
  emptyState: {
    marginTop: 40,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "rgba(255,255,255,0.8)",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    marginTop: 8,
    textAlign: "center",
  },
})

export default MyGroup


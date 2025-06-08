import { memo, useMemo, useCallback } from "react"
import { ScrollView, View, Text, Pressable, ImageBackground, useWindowDimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { router } from "expo-router"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import FooterComponent from "@/components/partials/FooterComponent"

const FEATURES = [
  {
    title: "Automatización de Cálculos",
    icon: "calculator-variant",
    desc: "Cálculo automático de salarios, deducciones, horas extras y más.",
    color: "#4CAF50",
  },
  {
    title: "Generación de Reportes",
    icon: "file-chart",
    desc: "Reportes detallados de nómina, fiscales y análisis de tendencias.",
    color: "#2196F3",
  },
  {
    title: "Cumplimiento Legal",
    icon: "gavel",
    desc: "Actualización automática de leyes fiscales y laborales.",
    color: "#FFC107",
  },
  {
    title: "Gestión de Permisos",
    icon: "calendar-check",
    desc: "Solicitud y aprobación de vacaciones con políticas personalizadas.",
    color: "#9C27B0",
  },
]

const STATS = [
  { num: "99", title: "Precisión en Cálculos", icon: "check-circle" },
  { num: "50", title: "Ahorro de Tiempo", icon: "clock-fast" },
  { num: "100", title: "Cumplimiento Legal", icon: "shield-check" },
]

const BENEFITS = [
  "Reducción de errores en cálculos de nómina",
  "Ahorro de tiempo en procesos administrativos",
  "Mejora en la satisfacción de los empleados",
  "Cumplimiento actualizado con regulaciones fiscales",
  "Acceso a datos en tiempo real para toma de decisiones",
]

const Card = memo(({ children, style, bg }) => (
  <View style={[s.card, style, bg && { backgroundColor: bg }]}>{children}</View>
))

const Button = memo(({ children, onPress, style, icon }) => (
  <Pressable onPress={onPress} style={[s.btn, style]}>
    {icon && <MaterialCommunityIcons name={icon} size={20} color="#fff" style={s.btnIcon} />}
    <Text style={s.btnText}>{children}</Text>
  </Pressable>
))

const Chip = memo(({ children, icon }) => (
  <View style={s.chip}>
    <MaterialCommunityIcons name={icon} size={16} color="#fff" style={s.chipIcon} />
    <Text style={s.chipText}>{children}</Text>
  </View>
))

const FeatureCard = memo(({ title, icon, desc, color }) => (
  <Card style={s.featureCard} bg={color}>
    <MaterialCommunityIcons name={icon} size={48} color="#fff" style={s.featureIcon} />
    <Text style={s.featureTitle}>{title}</Text>
    <Text style={s.featureDesc}>{desc}</Text>
  </Card>
))

const StatCard = memo(({ num, title, icon }) => (
  <View style={s.statCard}>
    <MaterialCommunityIcons name={icon} size={36} color="#0061f2" />
    <Text style={s.statNum}>{num}%</Text>
    <Text style={s.statTitle}>{title}</Text>
  </View>
))

const ProgressBar = memo(({ progress, color }) => (
  <View style={s.progressContainer}>
    <View style={[s.progressFill, { width: `${progress * 100}%`, backgroundColor: color }]} />
  </View>
))

const UIKitLanding = memo(() => {
  const { width } = useWindowDimensions()
  const isMobile = width < 768

  const navigate = useCallback(() => router.navigate("/singIn"), [])

  const heroStyle = useMemo(() => [s.hero, isMobile && s.heroMobile], [isMobile])
  const heroContentStyle = useMemo(() => [s.heroContent, !isMobile && s.heroContentWeb], [isMobile])

  return (
    <SafeAreaView style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <ImageBackground
          source={{ uri: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=2340&q=80" }}
          style={s.heroBg}
        >
          <View style={heroStyle}>
            <View style={heroContentStyle}>
              <Text style={s.heroTitle}>Socotec Colombia</Text>
              <Text style={s.heroSubtitle}>
                Automatice, simplifique y optimice todos sus procesos con nuestra plataforma integral de última
                generación.
              </Text>
              <View style={s.chipContainer}>
                <Chip icon="check">Preciso</Chip>
                <Chip icon="flash">Rápido</Chip>
                <Chip icon="shield">Seguro</Chip>
              </View>
              <Button onPress={navigate} style={s.primaryBtn} icon="rocket-launch">
                Comenzar Ahora
              </Button>
            </View>
            <View style={[s.heroImage, isMobile && s.heroImageMobile]}>
              <MaterialCommunityIcons name="account-cash" size={200} color="#fff" />
            </View>
          </View>
        </ImageBackground>

        {/* Features */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Características Principales</Text>
          <Text style={s.sectionSubtitle}>Descubra cómo nuestra plataforma puede transformar su trabajo</Text>
          <View style={s.grid}>
            {FEATURES.map((f, i) => (
              <FeatureCard key={i} {...f} />
            ))}
          </View>
        </View>

        {/* Stats */}
        <View style={s.statsSection}>
          {STATS.map((s, i) => (
            <StatCard key={i} {...s} />
          ))}
        </View>

        {/* Benefits */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Beneficios de Nuestra Solución</Text>
          <Card style={s.benefitsCard}>
            {BENEFITS.map((b, i) => (
              <View key={i} style={s.benefitItem}>
                <MaterialCommunityIcons name="star" size={20} color="#FFC107" />
                <Text style={s.benefitText}>{b}</Text>
              </View>
            ))}
          </Card>
        </View>

        {/* Progress */}
        <View style={s.progressSection}>
          <Text style={s.sectionTitle}>Mejore sus Procesos de Nómina</Text>
          {[
            { label: "Eficiencia en Cálculos", progress: 0.9, color: "#4CAF50" },
            { label: "Reducción de Errores", progress: 0.95, color: "#2196F3" },
            { label: "Satisfacción del Empleado", progress: 0.85, color: "#FFC107" },
          ].map((p, i) => (
            <View key={i} style={s.progressItem}>
              <Text style={s.progressLabel}>{p.label}</Text>
              <ProgressBar progress={p.progress} color={p.color} />
            </View>
          ))}
        </View>

        {/* CTA */}
        <Card style={s.ctaCard} bg="#0061f2">
          <Text style={s.ctaTitle}>¿Listo para revolucionar su gestión de nómina?</Text>
          <Text style={s.ctaText}>
            Únase a miles de empresas que ya han optimizado sus procesos de nómina con nuestra plataforma líder en el
            mercado.
          </Text>
          <Button onPress={navigate} style={s.ctaBtn} icon="rocket-launch">
            Iniciar Prueba Gratuita
          </Button>
        </Card>

        <FooterComponent />
      </ScrollView>
    </SafeAreaView>
  )
})

const s = {
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  heroBg: { width: "100%" },
  hero: { flexDirection: "row", padding: 20, paddingBottom: 60, backgroundColor: "rgba(0,97,242,0.8)" },
  heroMobile: { flexDirection: "column" },
  heroContent: { flex: 1, justifyContent: "center", padding: 20 },
  heroContentWeb: { paddingRight: 40 },
  heroTitle: { fontSize: 42, fontWeight: "bold", marginBottom: 20, color: "#fff" },
  heroSubtitle: { fontSize: 18, color: "#fff", marginBottom: 24, lineHeight: 24 },
  chipContainer: { flexDirection: "row", marginBottom: 24, flexWrap: "wrap" },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  chipIcon: { marginRight: 4 },
  chipText: { color: "#fff", fontSize: 14, fontWeight: "500" },
  heroImage: { flex: 1, alignItems: "center", justifyContent: "center" },
  heroImageMobile: { marginTop: 20 },

  section: { padding: 40 },
  sectionTitle: { fontSize: 32, fontWeight: "bold", textAlign: "center", marginBottom: 16, color: "#1a1f71" },
  sectionSubtitle: { fontSize: 18, textAlign: "center", marginBottom: 32, color: "#6c757d", lineHeight: 24 },

  card: {
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 20 },
  featureCard: { width: 300, margin: 10, alignItems: "center", padding: 20 },
  featureIcon: { marginBottom: 10 },
  featureTitle: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "#fff" },
  featureDesc: { textAlign: "center", color: "#fff", lineHeight: 20 },

  statsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 40,
    backgroundColor: "#f1f8ff",
    gap: 20,
  },
  statCard: { alignItems: "center" },
  statNum: { fontSize: 36, fontWeight: "bold", color: "#0061f2", marginVertical: 8 },
  statTitle: { fontSize: 16, color: "#6c757d", textAlign: "center" },

  benefitsCard: { padding: 20 },
  benefitItem: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  benefitText: { flex: 1, fontSize: 16, color: "#333", lineHeight: 22, marginLeft: 12 },

  progressSection: { padding: 40, backgroundColor: "#f8f9fa" },
  progressItem: { marginBottom: 16 },
  progressLabel: { fontSize: 16, marginBottom: 8, color: "#6c757d" },
  progressContainer: { height: 8, backgroundColor: "#e9ecef", borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 4 },

  ctaCard: { margin: 20, padding: 30, alignItems: "center" },
  ctaTitle: { color: "#fff", textAlign: "center", fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  ctaText: { color: "#fff", textAlign: "center", marginBottom: 24, lineHeight: 22, fontSize: 16 },

  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 48,
  },
  btnIcon: { marginRight: 8 },
  btnText: { fontSize: 16, fontWeight: "600", color: "#fff" },
  primaryBtn: { backgroundColor: "#FFC107" },
  ctaBtn: { backgroundColor: "#FFC107", minWidth: 200 },
}

export default UIKitLanding
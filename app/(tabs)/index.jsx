import { memo, useMemo, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  Pressable,
  ImageBackground,
  useWindowDimensions,
  Platform,
  StyleSheet,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FooterComponent from "@/components/partials/FooterComponent";

const FEATURES = [
  {
    title: "Gestión de Informes Técnicos",
    icon: "file-document-check-outline",
    desc: "Generación, revisión y exportación de reportes de campo y laboratorio en tiempo real.",
    color: "#00ACE8",
  },
  {
    title: "Control de Ensayos y Apiques",
    icon: "layers-triple-outline",
    desc: "Trazabilidad completa de muestras, registros geotécnicos y control de calidad operativa.",
    color: "#0B2545",
  },
  {
    title: "Gestión Ambiental y SST",
    icon: "shield-leaf-outline",
    desc: "Seguimiento riguroso de normatividad, permisos, dotación y auditorías de seguridad.",
    color: "#10B981",
  },
  {
    title: "Inventario y Recursos",
    icon: "warehouse",
    desc: "Administración integral de equipos técnicos, insumos, calibraciones y movimientos.",
    color: "#6366F1",
  },
];

const STATS = [
  { num: "99.9", title: "Precisión Técnica", icon: "check-decagram" },
  { num: "60", title: "Ahorro de Tiempo", icon: "clock-fast" },
  { num: "100", title: "Cumplimiento Normativo", icon: "shield-check" },
];

const BENEFITS = [
  "Centralización de datos técnicos de campo y laboratorio en una sola plataforma",
  "Generación automatizada de informes en formatos oficiales (Excel y PDF)",
  "Trazabilidad garantizada para auditorías y certificaciones internacionales",
  "Asignación inteligente de tareas, personal técnico y seguimiento de proyectos",
  "Acceso seguro multiplataforma desde cualquier dispositivo o navegador web",
];

const Card = memo(({ children, style, bg }) => (
  <View style={[s.card, style, bg && { backgroundColor: bg }]}>{children}</View>
));

const Button = memo(({ children, onPress, style, icon }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      s.btn,
      style,
      pressed && s.btnPressed,
      Platform.OS === "web" && { cursor: "pointer" },
    ]}
  >
    {icon && (
      <MaterialCommunityIcons
        name={icon}
        size={20}
        color="#fff"
        style={s.btnIcon}
      />
    )}
    <Text style={s.btnText}>{children}</Text>
  </Pressable>
));

const Chip = memo(({ children, icon }) => (
  <View style={s.chip}>
    <MaterialCommunityIcons
      name={icon}
      size={16}
      color="#fff"
      style={s.chipIcon}
    />
    <Text style={s.chipText}>{children}</Text>
  </View>
));

const FeatureCard = memo(({ title, icon, desc, color }) => (
  <View style={[s.featureCard, { borderTopColor: color }]}>
    <View style={[s.featureIconWrapper, { backgroundColor: `${color}18` }]}>
      <MaterialCommunityIcons name={icon} size={30} color={color} />
    </View>
    <Text style={s.featureTitle}>{title}</Text>
    <Text style={s.featureDesc}>{desc}</Text>
  </View>
));

const StatCard = memo(({ num, title, icon }) => (
  <View style={s.statCard}>
    <View style={s.statIconCircle}>
      <MaterialCommunityIcons name={icon} size={28} color="#00ACE8" />
    </View>
    <Text style={s.statNum}>{num}%</Text>
    <Text style={s.statTitle}>{title}</Text>
  </View>
));

const ProgressBar = memo(({ progress, color }) => (
  <View style={s.progressContainer}>
    <View
      style={[
        s.progressFill,
        { width: `${progress * 100}%`, backgroundColor: color },
      ]}
    />
  </View>
));

const UIKitLanding = memo(() => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isMobile = width < 768;
  const isLarge = width >= 1024;

  const navigate = useCallback(() => router.push("/(tabs)/singIn"), []);

  return (
    <SafeAreaView style={s.container} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom:
            Platform.OS === "web" ? 40 : Math.max(insets.bottom, 16) + 90,
        }}
      >
        {/* Hero Section */}
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=2400&q=80",
          }}
          style={s.heroBg}
        >
          <View style={s.heroOverlay}>
            <View style={[s.heroContainer, isMobile && s.heroContainerMobile]}>
              <View style={[s.heroContent, !isMobile && s.heroContentWeb]}>
                <View style={s.heroBadge}>
                  <MaterialCommunityIcons
                    name="certificate-outline"
                    size={16}
                    color="#00ACE8"
                  />
                  <Text style={s.heroBadgeText}>
                    Líderes en Calidad e Inspección Técnica
                  </Text>
                </View>

                <Text
                  style={[
                    s.heroTitle,
                    isMobile && s.heroTitleMobile,
                    isLarge && s.heroTitleLarge,
                  ]}
                >
                  Socotec Colombia
                </Text>

                <Text style={[s.heroSubtitle, isMobile && s.heroSubtitleMobile]}>
                  Automatice, simplifique y optimice todos sus procesos de
                  control técnico, geotecnia, informes y gestión con nuestra
                  plataforma integral de última generación.
                </Text>

                <View style={s.chipContainer}>
                  <Chip icon="check-bold">Preciso</Chip>
                  <Chip icon="flash">Rápido</Chip>
                  <Chip icon="shield-check">Seguro</Chip>
                  <Chip icon="cellphone-link">Multiplataforma</Chip>
                </View>

                <View style={s.heroBtnRow}>
                  <Button
                    onPress={navigate}
                    style={s.primaryBtn}
                    icon="rocket-launch-outline"
                  >
                    Comenzar Ahora
                  </Button>
                  <Pressable
                    onPress={() => router.push("/(tabs)/singUp")}
                    style={[
                      s.secondaryBtn,
                      Platform.OS === "web" && { cursor: "pointer" },
                    ]}
                  >
                    <Text style={s.secondaryBtnText}>Crear Cuenta</Text>
                  </Pressable>
                </View>
              </View>

              {/* Gráfico Tecnológico Hero */}
              <View style={[s.heroGraphic, isMobile && s.heroGraphicMobile]}>
                <View style={s.graphicHalo}>
                  <MaterialCommunityIcons
                    name="office-building-cog"
                    size={isMobile ? 100 : 130}
                    color="#00ACE8"
                  />
                </View>

                {/* Badge flotante 1 */}
                <View style={[s.floatingBadge, s.floatingBadgeTop]}>
                  <MaterialCommunityIcons
                    name="shield-check"
                    size={20}
                    color="#10B981"
                  />
                  <Text style={s.floatingBadgeText}>
                    Norma ISO / NTC 17025
                  </Text>
                </View>

                {/* Badge flotante 2 */}
                <View style={[s.floatingBadge, s.floatingBadgeBottom]}>
                  <MaterialCommunityIcons
                    name="chart-timeline-variant"
                    size={20}
                    color="#00ACE8"
                  />
                  <Text style={s.floatingBadgeText}>
                    Reportes en Tiempo Real
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>

        {/* Sección Características Principales */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionBadge}>FUNCIONALIDADES</Text>
            <Text style={s.sectionTitle}>Plataforma Especializada</Text>
            <Text style={s.sectionSubtitle}>
              Herramientas de alto rendimiento diseñadas para la ingeniería,
              inspección técnica y gestión ambiental.
            </Text>
          </View>

          <View style={s.featuresGrid}>
            {FEATURES.map((f, i) => (
              <FeatureCard key={i} {...f} />
            ))}
          </View>
        </View>

        {/* Sección Estadísticas */}
        <View style={s.statsWrapper}>
          <View style={[s.statsSection, isMobile && s.statsSectionMobile]}>
            {STATS.map((item, i) => (
              <StatCard key={i} {...item} />
            ))}
          </View>
        </View>

        {/* Sección Beneficios */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionBadge}>VENTAJAS COMPETITIVAS</Text>
            <Text style={s.sectionTitle}>Beneficios de Nuestra Solución</Text>
            <Text style={s.sectionSubtitle}>
              Máxima productividad para equipos en campo, laboratorio y
              dirección técnica.
            </Text>
          </View>

          <View style={[s.benefitsGrid, isMobile && s.benefitsGridMobile]}>
            {BENEFITS.map((b, i) => (
              <View key={i} style={s.benefitCard}>
                <View style={s.benefitIconCircle}>
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={22}
                    color="#00ACE8"
                  />
                </View>
                <Text style={s.benefitText}>{b}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Sección Progreso / Métricas */}
        <View style={s.progressSection}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionBadge}>IMPACTO OPERATIVO</Text>
            <Text style={s.sectionTitle}>Evolución de Procesos Técnicos</Text>
          </View>

          <View style={s.progressCardWrapper}>
            {[
              {
                label: "Precisión en Ensayos e Informes",
                progress: 0.99,
                color: "#00ACE8",
              },
              {
                label: "Reducción de Tiempos de Entrega",
                progress: 0.85,
                color: "#10B981",
              },
              {
                label: "Conformidad y Auditorías Aprobadas",
                progress: 0.95,
                color: "#6366F1",
              },
            ].map((p, i) => (
              <View key={i} style={s.progressItem}>
                <View style={s.progressLabelRow}>
                  <Text style={s.progressLabel}>{p.label}</Text>
                  <Text style={[s.progressValue, { color: p.color }]}>
                    {Math.round(p.progress * 100)}%
                  </Text>
                </View>
                <ProgressBar progress={p.progress} color={p.color} />
              </View>
            ))}
          </View>
        </View>

        {/* CTA Card */}
        <View style={s.ctaContainer}>
          <View style={s.ctaCard}>
            <Text style={s.ctaTitle}>
              ¿Listo para transformar su gestión técnica?
            </Text>
            <Text style={s.ctaText}>
              Acceda a la suite integral de Socotec Colombia para optimizar la
              operación de sus proyectos con estándares de clase mundial.
            </Text>
            <Button
              onPress={navigate}
              style={s.ctaBtn}
              icon="rocket-launch-outline"
            >
              Acceder a la Plataforma
            </Button>
          </View>
        </View>

        {/* Footer */}
        <FooterComponent />
      </ScrollView>
    </SafeAreaView>
  );
});

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  heroBg: {
    width: "100%",
  },
  heroOverlay: {
    backgroundColor: "rgba(11, 37, 69, 0.92)",
    paddingTop: Platform.OS === "web" ? 110 : 36,
    paddingBottom: 60,
    paddingHorizontal: 20,
  },
  heroContainer: {
    width: "100%",
    maxWidth: 1240,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroContainerMobile: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  heroContent: {
    flex: 1.2,
    justifyContent: "center",
  },
  heroContentWeb: {
    paddingRight: 48,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(0, 172, 232, 0.15)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 172, 232, 0.3)",
  },
  heroBadgeText: {
    color: "#00ACE8",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 16,
    lineHeight: 50,
  },
  heroTitleMobile: {
    fontSize: 30,
    lineHeight: 38,
  },
  heroTitleLarge: {
    fontSize: 48,
    lineHeight: 56,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.85)",
    marginBottom: 24,
    lineHeight: 24,
    maxWidth: 620,
  },
  heroSubtitleMobile: {
    fontSize: 14,
    lineHeight: 22,
  },
  chipContainer: {
    flexDirection: "row",
    marginBottom: 28,
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  chipIcon: {
    marginRight: 6,
  },
  chipText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  heroBtnRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 14,
  },
  primaryBtn: {
    backgroundColor: "#00ACE8",
    borderRadius: 12,
    shadowColor: "#00ACE8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  secondaryBtn: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  heroGraphic: {
    flex: 0.9,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    minHeight: 280,
  },
  heroGraphicMobile: {
    width: "100%",
    marginTop: 36,
    minHeight: 220,
  },
  graphicHalo: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(0, 172, 232, 0.12)",
    borderWidth: 2,
    borderColor: "rgba(0, 172, 232, 0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  floatingBadge: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  floatingBadgeTop: {
    top: 20,
    left: Platform.OS === "web" ? 10 : 20,
  },
  floatingBadgeBottom: {
    bottom: 20,
    right: Platform.OS === "web" ? 10 : 20,
  },
  floatingBadgeText: {
    color: "#0F172A",
    fontSize: 12,
    fontWeight: "700",
  },

  // Secciones Comunes
  section: {
    paddingVertical: 48,
    paddingHorizontal: 20,
    width: "100%",
    maxWidth: 1240,
    alignSelf: "center",
  },
  sectionHeader: {
    alignItems: "center",
    marginBottom: 36,
  },
  sectionBadge: {
    fontSize: 12,
    fontWeight: "800",
    color: "#00ACE8",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
    color: "#0F172A",
  },
  sectionSubtitle: {
    fontSize: 15,
    textAlign: "center",
    color: "#64748B",
    lineHeight: 22,
    maxWidth: 600,
  },

  // Grid Características
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    justifyContent: "center",
  },
  featureCard: {
    flex: 1,
    minWidth: 260,
    maxWidth: 380,
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderTopWidth: 4,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  featureIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 8,
  },
  featureDesc: {
    color: "#64748B",
    fontSize: 13,
    lineHeight: 20,
  },

  // Estadísticas
  statsWrapper: {
    backgroundColor: "#F1F5F9",
    paddingVertical: 24,
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 20,
    width: "100%",
    maxWidth: 1200,
    alignSelf: "center",
  },
  statsSectionMobile: {
    flexWrap: "wrap",
    gap: 20,
  },
  statCard: {
    alignItems: "center",
    padding: 16,
    minWidth: 160,
  },
  statIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#E0F2FE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  statNum: {
    fontSize: 34,
    fontWeight: "800",
    color: "#0B2545",
  },
  statTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
    textAlign: "center",
    marginTop: 4,
  },

  // Beneficios Grid
  benefitsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "center",
  },
  benefitsGridMobile: {
    flexDirection: "column",
  },
  benefitCard: {
    flex: 1,
    minWidth: 320,
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  benefitIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0F9FF",
    alignItems: "center",
    justifyContent: "center",
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#1E293B",
    lineHeight: 20,
  },

  // Progreso
  progressSection: {
    paddingVertical: 48,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E2E8F0",
  },
  progressCardWrapper: {
    width: "100%",
    maxWidth: 800,
    alignSelf: "center",
    gap: 20,
  },
  progressItem: {
    width: "100%",
  },
  progressLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },
  progressValue: {
    fontSize: 14,
    fontWeight: "700",
  },
  progressContainer: {
    height: 8,
    backgroundColor: "#F1F5F9",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },

  // CTA
  ctaContainer: {
    paddingVertical: 48,
    paddingHorizontal: 20,
  },
  ctaCard: {
    width: "100%",
    maxWidth: 1100,
    alignSelf: "center",
    backgroundColor: "#0B2545",
    padding: Platform.OS === "web" ? 48 : 28,
    borderRadius: 24,
    alignItems: "center",
    shadowColor: "#0B2545",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  ctaTitle: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 12,
  },
  ctaText: {
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 24,
    fontSize: 15,
    maxWidth: 680,
  },
  ctaBtn: {
    backgroundColor: "#00ACE8",
    minWidth: 220,
    borderRadius: 12,
  },

  // Botón genérico
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 48,
  },
  btnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.98 }],
  },
  btnIcon: {
    marginRight: 8,
  },
  btnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

export default UIKitLanding;

import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  Platform,
  ActivityIndicator,
  SafeAreaView,
 
} from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import Breadcrumb from "@/components/BreadcrumbComponent";
import  { router } from "expo-router";

// Obtenemos las dimensiones de la pantalla
const windowDimensions = Dimensions.get("window")

// Tipos de contratos colombianos
const contractTypes = {
  laboralFijo: {
    name: "Contrato Laboral a Término Fijo",
    icon: "file-document-outline",
    description: "Contrato con duración determinada, incluye prestaciones sociales.",
    template: "laboralFijo",
    fields: [
      { key: "empleador", label: "Empleador", type: "text", required: true },
      { key: "empleadorId", label: "NIT/Cédula Empleador", type: "text", required: true },
      { key: "empleadorDir", label: "Dirección Empleador", type: "text", required: true },
      { key: "trabajador", label: "Trabajador", type: "text", required: true },
      { key: "trabajadorId", label: "Cédula Trabajador", type: "text", required: true },
      { key: "trabajadorDir", label: "Dirección Trabajador", type: "text", required: true },
      { key: "cargo", label: "Cargo", type: "text", required: true },
      { key: "salario", label: "Salario Mensual", type: "number", required: true },
      { key: "duracionMeses", label: "Duración (meses)", type: "number", required: true },
      { key: "inicioContrato", label: "Fecha Inicio", type: "date", required: true },
    ],
  },
  laboralIndefinido: {
    name: "Contrato Laboral a Término Indefinido",
    icon: "file-document",
    description: "Contrato sin fecha de terminación específica.",
    template: "laboralIndefinido",
    fields: [
      { key: "empleador", label: "Empleador", type: "text", required: true },
      { key: "empleadorId", label: "NIT/Cédula Empleador", type: "text", required: true },
      { key: "empleadorDir", label: "Dirección Empleador", type: "text", required: true },
      { key: "trabajador", label: "Trabajador", type: "text", required: true },
      { key: "trabajadorId", label: "Cédula Trabajador", type: "text", required: true },
      { key: "trabajadorDir", label: "Dirección Trabajador", type: "text", required: true },
      { key: "cargo", label: "Cargo", type: "text", required: true },
      { key: "salario", label: "Salario Mensual", type: "number", required: true },
      { key: "inicioContrato", label: "Fecha Inicio", type: "date", required: true },
    ],
  },
  prestacionServicios: {
    name: "Contrato de Prestación de Servicios",
    icon: "briefcase-outline",
    description: "Contrato civil sin relación laboral.",
    template: "prestacionServicios",
    fields: [
      { key: "contratante", label: "Contratante", type: "text", required: true },
      { key: "contratanteId", label: "NIT/Cédula Contratante", type: "text", required: true },
      { key: "contratanteDir", label: "Dirección Contratante", type: "text", required: true },
      { key: "contratista", label: "Contratista", type: "text", required: true },
      { key: "contratistaId", label: "Cédula/NIT Contratista", type: "text", required: true },
      { key: "contratistaDir", label: "Dirección Contratista", type: "text", required: true },
      { key: "objeto", label: "Objeto del Contrato", type: "textarea", required: true },
      { key: "valorTotal", label: "Valor Total", type: "number", required: true },
      {
        key: "formaPago",
        label: "Forma de Pago",
        type: "select",
        options: ["Único pago", "Mensual", "Por entregables"],
        required: true,
      },
      { key: "duracionMeses", label: "Duración (meses)", type: "number", required: true },
      { key: "inicioContrato", label: "Fecha Inicio", type: "date", required: true },
    ],
  },
  arrendamiento: {
    name: "Contrato de Arrendamiento",
    icon: "home-outline",
    description: "Contrato para alquiler de inmuebles.",
    template: "arrendamiento",
    fields: [
      { key: "arrendador", label: "Arrendador", type: "text", required: true },
      { key: "arrendadorId", label: "Cédula/NIT Arrendador", type: "text", required: true },
      { key: "arrendadorDir", label: "Dirección Arrendador", type: "text", required: true },
      { key: "arrendatario", label: "Arrendatario", type: "text", required: true },
      { key: "arrendatarioId", label: "Cédula/NIT Arrendatario", type: "text", required: true },
      { key: "arrendatarioDir", label: "Dirección Arrendatario", type: "text", required: true },
      { key: "inmuebleDir", label: "Dirección del Inmueble", type: "text", required: true },
      { key: "canonMensual", label: "Canon Mensual", type: "number", required: true },
      { key: "duracionMeses", label: "Duración (meses)", type: "number", required: true },
      { key: "inicioContrato", label: "Fecha Inicio", type: "date", required: true },
      {
        key: "destinacion",
        label: "Destinación",
        type: "select",
        options: ["Vivienda", "Comercial", "Mixto"],
        required: true,
      },
    ],
  },
  compraventa: {
    name: "Contrato de Compraventa",
    icon: "cart-outline",
    description: "Contrato para compra y venta de bienes.",
    template: "compraventa",
    fields: [
      { key: "vendedor", label: "Vendedor", type: "text", required: true },
      { key: "vendedorId", label: "Cédula/NIT Vendedor", type: "text", required: true },
      { key: "vendedorDir", label: "Dirección Vendedor", type: "text", required: true },
      { key: "comprador", label: "Comprador", type: "text", required: true },
      { key: "compradorId", label: "Cédula/NIT Comprador", type: "text", required: true },
      { key: "compradorDir", label: "Dirección Comprador", type: "text", required: true },
      { key: "bienDescripcion", label: "Descripción del Bien", type: "textarea", required: true },
      { key: "precio", label: "Precio", type: "number", required: true },
      {
        key: "formaPago",
        label: "Forma de Pago",
        type: "select",
        options: ["Contado", "Crédito", "Plazos"],
        required: true,
      },
      { key: "fechaEntrega", label: "Fecha de Entrega", type: "date", required: true },
    ],
  },
}

// Cálculos según la ley colombiana
const colombianLawCalculations = {
  // Cálculo de prestaciones sociales para contratos laborales
  calcularPrestacionesSociales: (salarioMensual) => {
    const salario = Number.parseFloat(salarioMensual) || 0
    const prima = salario * 0.0833 // Prima de servicios (1/12 del salario)
    const cesantias = salario * 0.0833 // Cesantías (1/12 del salario)
    const intCesantias = cesantias * 0.12 // Intereses sobre cesantías (12% anual)
    const vacaciones = salario * 0.0417 // Vacaciones (15 días por año)

    return {
      prima: prima.toFixed(2),
      cesantias: cesantias.toFixed(2),
      intCesantias: intCesantias.toFixed(2),
      vacaciones: vacaciones.toFixed(2),
      total: (prima + cesantias + intCesantias + vacaciones).toFixed(2),
    }
  },

  // Cálculo de seguridad social para contratos laborales
  calcularSeguridadSocial: (salarioMensual) => {
    const salario = Number.parseFloat(salarioMensual) || 0
    const salud = salario * 0.085 // Aporte a salud (8.5% empleador)
    const pension = salario * 0.12 // Aporte a pensión (12% empleador)
    const arl = salario * 0.00522 // ARL riesgo I (0.522%)
    const parafiscales = salario * 0.09 // Parafiscales (9%)

    return {
      salud: salud.toFixed(2),
      pension: pension.toFixed(2),
      arl: arl.toFixed(2),
      parafiscales: parafiscales.toFixed(2),
      total: (salud + pension + arl + parafiscales).toFixed(2),
    }
  },

  // Cálculo de retención en la fuente para prestación de servicios
  calcularRetencionFuente: (valorTotal) => {
    const valor = Number.parseFloat(valorTotal) || 0
    // Retención del 10% para servicios generales
    const retencion = valor * 0.1
    return retencion.toFixed(2)
  },

  // Cálculo de IVA para compraventa
  calcularIVA: (precio) => {
    const valor = Number.parseFloat(precio) || 0
    const iva = valor * 0.19 // IVA del 19%
    return iva.toFixed(2)
  },

  // Cálculo de fechas para contratos
  calcularFechaFin: (fechaInicio, duracionMeses) => {
    if (!fechaInicio) return ""
    
    try {
      const inicio = new Date(fechaInicio)
      const fin = new Date(inicio)
      fin.setMonth(inicio.getMonth() + Number.parseInt(duracionMeses || "0", 10))
      return fin.toISOString().split("T")[0]
    } catch (error) {
      console.error("Error al calcular fecha fin:", error)
      return ""
    }
  },
}

export default function GeneratorReport() {
  // Estado para opciones de PDF
  const [contractType, setContractType] = useState("laboralFijo")
  const [formData, setFormData] = useState({})
  const [calculations, setCalculations] = useState({})
  const [showOptions, setShowOptions] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [previewContent, setPreviewContent] = useState(null)
  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
  })

  // Referencia para el ScrollView
  const scrollViewRef = useRef(null)

  // Determinar si estamos en modo web o móvil
  const isWeb = Platform.OS === "web"

  // Actualizar dimensiones cuando cambia el tamaño de la pantalla
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions({ window })
    })
    return () => {
      if (subscription?.remove) {
        subscription.remove()
      }
    }
  }, [])

  const { width, height } = dimensions.window
  const isLandscape = width > height
  const isLargeScreen = width >= 1024

  // Animation values
  const optionsAnimation = useSharedValue(0)
  const previewScale = useSharedValue(1)
  const previewOpacity = useSharedValue(1)
  const contractTypeAnimation = useSharedValue(0)

  // Toggle options panel
  const toggleOptions = () => {
    setShowOptions(!showOptions)
    optionsAnimation.value = withTiming(showOptions ? 0 : 1, {
      duration: 400,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    })

    previewScale.value = withTiming(showOptions ? 1 : isLargeScreen ? 1 : 0.98, {
      duration: 400,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    })

    previewOpacity.value = withTiming(showOptions ? 1 : 0.9, {
      duration: 300,
    })
  }

  // Animated styles
  const optionsAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: optionsAnimation.value,
      transform: [
        {
          translateY: interpolate(optionsAnimation.value, [0, 1], [50, 0], Extrapolate.CLAMP),
        },
      ],
      display: optionsAnimation.value === 0 ? "none" : "flex",
    }
  })

  const previewAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: previewScale.value }],
      opacity: previewOpacity.value,
    }
  })

  const contractTypeAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(contractTypeAnimation.value, [0, 1], [20, 0], Extrapolate.CLAMP),
        },
      ],
      opacity: contractTypeAnimation.value,
    }
  })

  // Animar la aparición de los tipos de contrato
  useEffect(() => {
    contractTypeAnimation.value = withTiming(1, {
      duration: 600,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    })
  }, [])

  // Manejar cambio de datos del formulario
  const handleFormDataChange = (key, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [key]: value }

      // Realizar cálculos automáticos según el tipo de contrato
      if (contractType === "laboralFijo" || contractType === "laboralIndefinido") {
        if (key === "salario" && value) {
          const prestaciones = colombianLawCalculations.calcularPrestacionesSociales(value)
          const seguridadSocial = colombianLawCalculations.calcularSeguridadSocial(value)

          setCalculations((prev) => ({
            ...prev,
            prestaciones,
            seguridadSocial,
            costoTotal: (
              Number.parseFloat(value || "0") +
              Number.parseFloat(prestaciones.total || "0") +
              Number.parseFloat(seguridadSocial.total || "0")
            ).toFixed(2),
          }))
        }

        if ((key === "inicioContrato" || key === "duracionMeses") && newData.inicioContrato && newData.duracionMeses) {
          const fechaFin = colombianLawCalculations.calcularFechaFin(newData.inicioContrato, newData.duracionMeses)
          setCalculations((prev) => ({ ...prev, fechaFin }))
        }
      } else if (contractType === "prestacionServicios") {
        if (key === "valorTotal" && value) {
          const retencion = colombianLawCalculations.calcularRetencionFuente(value)
          setCalculations((prev) => ({
            ...prev,
            retencion,
            valorNeto: (Number.parseFloat(value || "0") - Number.parseFloat(retencion || "0")).toFixed(2),
          }))
        }

        if ((key === "inicioContrato" || key === "duracionMeses") && newData.inicioContrato && newData.duracionMeses) {
          const fechaFin = colombianLawCalculations.calcularFechaFin(newData.inicioContrato, newData.duracionMeses)
          setCalculations((prev) => ({ ...prev, fechaFin }))
        }
      } else if (contractType === "compraventa") {
        if (key === "precio" && value) {
          const iva = colombianLawCalculations.calcularIVA(value)
          setCalculations((prev) => ({
            ...prev,
            iva,
            precioTotal: (Number.parseFloat(value || "0") + Number.parseFloat(iva || "0")).toFixed(2),
          }))
        }
      } else if (contractType === "arrendamiento") {
        if ((key === "inicioContrato" || key === "duracionMeses") && newData.inicioContrato && newData.duracionMeses) {
          const fechaFin = colombianLawCalculations.calcularFechaFin(newData.inicioContrato, newData.duracionMeses)
          setCalculations((prev) => ({ ...prev, fechaFin }))
        }
      }

      return newData
    })
  }

  // Generar HTML para el PDF según el tipo de contrato
  const generateContractHTML = () => {
    let html = ""

    switch (contractType) {
      case "laboralFijo":
        html = `
          <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.5;">
            <h1 style="text-align: center; font-size: 18px; margin-bottom: 20px;">CONTRATO INDIVIDUAL DE TRABAJO A TÉRMINO FIJO</h1>
            
            <div style="margin-bottom: 15px;">
              Entre los suscritos a saber: <strong>${formData.empleador || "[EMPLEADOR]"}</strong>, identificado con NIT/Cédula No. ${formData.empleadorId || "[ID]"}, con domicilio en ${formData.empleadorDir || "[DIRECCIÓN]"}, quien en adelante se denominará EL EMPLEADOR, y <strong>${formData.trabajador || "[TRABAJADOR]"}</strong>, identificado con Cédula de Ciudadanía No. ${formData.trabajadorId || "[ID]"}, con domicilio en ${formData.trabajadorDir || "[DIRECCIÓN]"}, quien en adelante se denominará EL TRABAJADOR, han celebrado el presente CONTRATO INDIVIDUAL DE TRABAJO A TÉRMINO FIJO, regido por las siguientes cláusulas:
            </div>
            
            <div style="margin-bottom: 15px;">
              <div style="font-weight: bold;">PRIMERA - OBJETO:</div>
              EL EMPLEADOR contrata los servicios personales de EL TRABAJADOR para desempeñar el cargo de ${formData.cargo || "[CARGO]"} y las funciones inherentes al mismo.
            </div>
            
            <div style="margin-bottom: 15px;">
              <div style="font-weight: bold;">SEGUNDA - DURACIÓN:</div>
              El presente contrato tendrá una duración de ${formData.duracionMeses || "[DURACIÓN]"} meses, contados a partir del ${formData.inicioContrato || "[FECHA INICIO]"} hasta el ${calculations.fechaFin || "[FECHA FIN]"}.
            </div>
            
            <div style="margin-bottom: 15px;">
              <div style="font-weight: bold;">TERCERA - REMUNERACIÓN:</div>
              EL EMPLEADOR pagará a EL TRABAJADOR por la prestación de sus servicios el salario mensual de ${formData.salario || "[SALARIO]"} pesos colombianos, pagaderos en periodos quincenales.
            </div>
            
            <div style="margin-bottom: 15px;">
              <div style="font-weight: bold;">CUARTA - JORNADA DE TRABAJO:</div>
              EL TRABAJADOR se obliga a laborar la jornada ordinaria en los turnos y dentro de las horas señaladas por EL EMPLEADOR, pudiendo hacer éste ajustes o cambios de horario cuando lo estime conveniente.
            </div>
            
            <div style="margin-bottom: 15px;">
              <div style="font-weight: bold;">QUINTA - OBLIGACIONES DEL TRABAJADOR:</div>
              EL TRABAJADOR se obliga a cumplir con todas las instrucciones que reciba de sus superiores y con los reglamentos de trabajo, higiene y seguridad industrial establecidos o que se establezcan en el futuro.
            </div>
            
            <div style="margin-bottom: 15px;">
              <div style="font-weight: bold;">SEXTA - PRESTACIONES SOCIALES:</div>
              EL TRABAJADOR tendrá derecho a todas las prestaciones sociales establecidas en la legislación laboral colombiana, incluyendo prima de servicios, cesantías, intereses sobre cesantías y vacaciones.
            </div>
            
            <div style="margin-bottom: 15px;">
              <div style="font-weight: bold;">SÉPTIMA - TERMINACIÓN DEL CONTRATO:</div>
              El presente contrato podrá darse por terminado por mutuo consentimiento, por las causales establecidas en el artículo 61 del Código Sustantivo del Trabajo o por el vencimiento del plazo fijo pactado.
            </div>
            
            <div style="margin-top: 30px; border: 1px solid #ddd; padding: 10px;">
              <h3>Cálculos según la Ley Colombiana:</h3>
              <div style="margin-bottom: 5px;"><strong>Prestaciones Sociales Mensuales:</strong></div>
              <div style="margin-bottom: 5px;">Prima de Servicios: ${calculations.prestaciones?.prima || "0"}</div>
              <div style="margin-bottom: 5px;">Cesantías: ${calculations.prestaciones?.cesantias || "0"}</div>
              <div style="margin-bottom: 5px;">Intereses sobre Cesantías: ${calculations.prestaciones?.intCesantias || "0"}</div>
              <div style="margin-bottom: 5px;">Vacaciones: ${calculations.prestaciones?.vacaciones || "0"}</div>
              
              <div style="margin-bottom: 5px;"><strong>Seguridad Social (Aportes del Empleador):</strong></div>
              <div style="margin-bottom: 5px;">Salud (8.5%): ${calculations.seguridadSocial?.salud || "0"}</div>
              <div style="margin-bottom: 5px;">Pensión (12%): ${calculations.seguridadSocial?.pension || "0"}</div>
              <div style="margin-bottom: 5px;">ARL: ${calculations.seguridadSocial?.arl || "0"}</div>
              <div style="margin-bottom: 5px;">Parafiscales: ${calculations.seguridadSocial?.parafiscales || "0"}</div>
              
              <div style="margin-bottom: 5px;"><strong>Costo Total Mensual para el Empleador: ${calculations.costoTotal || "0"}</strong></div>
            </div>
            
            <div style="margin-top: 50px; display: flex; justify-content: space-between;">
              <div>
                <div style="border-top: 1px solid #000; width: 200px; text-align: center; padding-top: 5px;">EL EMPLEADOR</div>
                <div>${formData.empleador || "[EMPLEADOR]"}</div>
                <div>C.C./NIT: ${formData.empleadorId || "[ID]"}</div>
              </div>
              
              <div>
                <div style="border-top: 1px solid #000; width: 200px; text-align: center; padding-top: 5px;">EL TRABAJADOR</div>
                <div>${formData.trabajador || "[TRABAJADOR]"}</div>
                <div>C.C.: ${formData.trabajadorId || "[ID]"}</div>
              </div>
            </div>
          </div>
        `
        break

      case "laboralIndefinido":
        html = `
          <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.5;">
            <h1 style="text-align: center; font-size: 18px; margin-bottom: 20px;">CONTRATO INDIVIDUAL DE TRABAJO A TÉRMINO INDEFINIDO</h1>
            
            <div style="margin-bottom: 15px;">
              Entre los suscritos a saber: <strong>${formData.empleador || "[EMPLEADOR]"}</strong>, identificado con NIT/Cédula No. ${formData.empleadorId || "[ID]"}, con domicilio en ${formData.empleadorDir || "[DIRECCIÓN]"}, quien en adelante se denominará EL EMPLEADOR, y <strong>${formData.trabajador || "[TRABAJADOR]"}</strong>, identificado con Cédula de Ciudadanía No. ${formData.trabajadorId || "[ID]"}, con domicilio en ${formData.trabajadorDir || "[DIRECCIÓN]"}, quien en adelante se denominará EL TRABAJADOR, han celebrado el presente CONTRATO INDIVIDUAL DE TRABAJO A TÉRMINO INDEFINIDO, regido por las siguientes cláusulas:
            </div>
            
            <div style="margin-bottom: 15px;">
              <div style="font-weight: bold;">PRIMERA - OBJETO:</div>
              EL EMPLEADOR contrata los servicios personales de EL TRABAJADOR para desempeñar el cargo de ${formData.cargo || "[CARGO]"} y las funciones inherentes al mismo.
            </div>
            
            <div style="margin-bottom: 15px;">
              <div style="font-weight: bold;">SEGUNDA - DURACIÓN:</div>
              El presente contrato tendrá una duración indefinida, iniciando el día ${formData.inicioContrato || "[FECHA INICIO]"}.
            </div>
            
            <div style="margin-bottom: 15px;">
              <div style="font-weight: bold;">TERCERA - REMUNERACIÓN:</div>
              EL EMPLEADOR pagará a EL TRABAJADOR por la prestación de sus servicios el salario mensual de ${formData.salario || "[SALARIO]"} pesos colombianos, pagaderos en periodos quincenales.
            </div>
            
            <div style="margin-bottom: 15px;">
              <div style="font-weight: bold;">CUARTA - JORNADA DE TRABAJO:</div>
              EL TRABAJADOR se obliga a laborar la jornada ordinaria en los turnos y dentro de las horas señaladas por EL EMPLEADOR, pudiendo hacer éste ajustes o cambios de horario cuando lo estime conveniente.
            </div>
            
            <div style="margin-bottom: 15px;">
              <div style="font-weight: bold;">QUINTA - OBLIGACIONES DEL TRABAJADOR:</div>
              EL TRABAJADOR se obliga a cumplir con todas las instrucciones que reciba de sus superiores y con los reglamentos de trabajo, higiene y seguridad industrial establecidos o que se establezcan en el futuro.
            </div>
            
            <div style="margin-bottom: 15px;">
              <div style="font-weight: bold;">SEXTA - PRESTACIONES SOCIALES:</div>
              EL TRABAJADOR tendrá derecho a todas las prestaciones sociales establecidas en la legislación laboral colombiana, incluyendo prima de servicios, cesantías, intereses sobre cesantías y vacaciones.
            </div>
            
            <div style="margin-bottom: 15px;">
              <div style="font-weight: bold;">SÉPTIMA - TERMINACIÓN DEL CONTRATO:</div>
              El presente contrato podrá darse por terminado por mutuo consentimiento o por las causales establecidas en el artículo 61 del Código Sustantivo del Trabajo.
            </div>
            
            <div style="margin-top: 30px; border: 1px solid #ddd; padding: 10px;">
              <h3>Cálculos según la Ley Colombiana:</h3>
              <div style="margin-bottom: 5px;"><strong>Prestaciones Sociales Mensuales:</strong></div>
              <div style="margin-bottom: 5px;">Prima de Servicios: ${calculations.prestaciones?.prima || "0"}</div>
              <div style="margin-bottom: 5px;">Cesantías: ${calculations.prestaciones?.cesantias || "0"}</div>
              <div style="margin-bottom: 5px;">Intereses sobre Cesantías: ${calculations.prestaciones?.intCesantias || "0"}</div>
              <div style="margin-bottom: 5px;">Vacaciones: ${calculations.prestaciones?.vacaciones || "0"}</div>
              
              <div style="margin-bottom: 5px;"><strong>Seguridad Social (Aportes del Empleador):</strong></div>
              <div style="margin-bottom: 5px;">Salud (8.5%): ${calculations.seguridadSocial?.salud || "0"}</div>
              <div style="margin-bottom: 5px;">Pensión (12%): ${calculations.seguridadSocial?.pension || "0"}</div>
              <div style="margin-bottom: 5px;">ARL: ${calculations.seguridadSocial?.arl || "0"}</div>
              <div style="margin-bottom: 5px;">Parafiscales: ${calculations.seguridadSocial?.parafiscales || "0"}</div>
              
              <div style="margin-bottom: 5px;"><strong>Costo Total Mensual para el Empleador: ${calculations.costoTotal || "0"}</strong></div>
            </div>
            
            <div style="margin-top: 50px; display: flex; justify-content: space-between;">
              <div>
                <div style="border-top: 1px solid #000; width: 200px; text-align: center; padding-top: 5px;">EL EMPLEADOR</div>
                <div>${formData.empleador || "[EMPLEADOR]"}</div>
                <div>C.C./NIT: ${formData.empleadorId || "[ID]"}</div>
              </div>
              
              <div>
                <div style="border-top: 1px solid #000; width: 200px; text-align: center; padding-top: 5px;">EL TRABAJADOR</div>
                <div>${formData.trabajador || "[TRABAJADOR]"}</div>
                <div>C.C.: ${formData.trabajadorId || "[ID]"}</div>
              </div>
            </div>
          </div>
        `
        break

      case "prestacionServicios":
        html = `
          <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.5;">
            <h1 style="text-align: center; font-size: 18px; margin-bottom: 20px;">CONTRATO DE PRESTACIÓN DE SERVICIOS</h1>
            
            <div style="margin-bottom: 15px;">
              Entre los suscritos a saber: <strong>${formData.contratante || "[CONTRATANTE]"}</strong>, identificado con NIT/Cédula No. ${formData.contratanteId || "[ID]"}, con domicilio en ${formData.contratanteDir || "[DIRECCIÓN]"}, quien en adelante se denominará EL CONTRATANTE, y <strong>${formData.contratista || "[CONTRATISTA]"}</strong>, identificado con Cédula de Ciudadanía/NIT No. ${formData.contratistaId || "[ID]"}, con domicilio en ${formData.contratistaDir || "[DIRECCIÓN]"}, quien en adelante se denominará EL CONTRATISTA, han celebrado el presente CONTRATO DE PRESTACIÓN DE SERVICIOS, regido por las siguientes cláusulas:
            </div>
            
            <div style="margin-bottom: 15px;">
              <div style="font-weight: bold;">PRIMERA - OBJETO:</div>
              EL CONTRATISTA se obliga para con EL CONTRATANTE a prestar sus servicios profesionales de manera independiente en: ${formData.objeto || "[OBJETO DEL CONTRATO]"}.
            </div>
            
            <div style="margin-bottom: 15px;">
              <div style="font-weight: bold;">SEGUNDA - DURACIÓN:</div>
              El presente contrato tendrá una duración de ${formData.duracionMeses || "[DURACIÓN]"} meses, contados a partir del ${formData.inicioContrato || "[FECHA INICIO]"} hasta el ${calculations.fechaFin || "[FECHA FIN]"}.
            </div>
            
            <div style="margin-bottom: 15px;">
              <div style="font-weight: bold;">TERCERA - VALOR Y FORMA DE PAGO:</div>
              El valor total del presente contrato es la suma de ${formData.valorTotal || "[VALOR]"} pesos colombianos, que serán pagados por EL CONTRATANTE a EL CONTRATISTA de la siguiente manera: ${formData.formaPago || "[FORMA DE PAGO]"}.
            </div>
            
            <div style="margin-bottom: 15px;">
              <div style="font-weight: bold;">CUARTA - NATURALEZA DEL CONTRATO:</div>
              El presente contrato es de naturaleza civil y no genera relación laboral ni prestaciones sociales a favor de EL CONTRATISTA.
            </div>
            
            <div style="margin-bottom: 15px;">
              <div style="font-weight: bold;">QUINTA - OBLIGACIONES DEL CONTRATISTA:</div>
              EL CONTRATISTA se obliga a: 1) Cumplir con el objeto del contrato. 2) Actuar con diligencia y profesionalismo. 3) Presentar informes periódicos de sus actividades. 4) Las demás que se deriven del objeto del contrato.
            </div>
            
            <div style="margin-bottom: 15px;">
              <div style="font-weight: bold;">SEXTA - OBLIGACIONES DEL CONTRATANTE:</div>
              EL CONTRATANTE se obliga a: 1) Pagar el valor del contrato en la forma y tiempo convenidos. 2) Suministrar la información necesaria para el desarrollo del objeto contractual.
            </div>
            
            <div style="margin-bottom: 15px;">
              <div style="font-weight: bold;">SÉPTIMA - TERMINACIÓN DEL CONTRATO:</div>
              El presente contrato podrá darse por terminado por: 1) Mutuo acuerdo. 2) Incumplimiento de las obligaciones. 3) Vencimiento del plazo.
            </div>
            
            <div style="margin-top: 30px; border: 1px solid #ddd; padding: 10px;">
              <h3>Cálculos según la Ley Colombiana:</h3>
              <div style="margin-bottom: 5px;"><strong>Retención en la Fuente (10%): ${calculations.retencion || "0"}</strong></div>
              <div style="margin-bottom: 5px;"><strong>Valor Neto a Recibir: ${calculations.valorNeto || "0"}</strong></div>
              <div style="margin-bottom: 5px;">Nota: El contratista debe asumir el pago de seguridad social como trabajador independiente.</div>
            </div>
            
            <div style="margin-top: 50px; display: flex; justify-content: space-between;">
              <div>
                <div style="border-top: 1px solid #000; width: 200px; text-align: center; padding-top: 5px;">EL CONTRATANTE</div>
                <div>${formData.contratante || "[CONTRATANTE]"}</div>
                <div>C.C./NIT: ${formData.contratanteId || "[ID]"}</div>
              </div>
              
              <div>
                <div style="border-top: 1px solid #000; width: 200px; text-align: center; padding-top: 5px;">EL CONTRATISTA</div>
                <div>${formData.contratista || "[CONTRATISTA]"}</div>
                <div>C.C./NIT: ${formData.contratistaId || "[ID]"}</div>
              </div>
            </div>
          </div>
        `
        break

      case "arrendamiento":
        html = `
          <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.5;">
            <h1 style="text-align: center; font-size: 18px; margin-bottom: 20px;">CONTRATO DE ARRENDAMIENTO DE INMUEBLE</h1>
            
            <div style="margin-bottom: 15px;">
              Entre los suscritos a saber: <strong>${formData.arrendador || "[ARRENDADOR]"}</strong>, identificado con Cédula/NIT No. ${formData.arrendadorId || "[ID]"}, con domicilio en ${formData.arrendadorDir || "[DIRECCIÓN]"}, quien en adelante se denominará EL ARRENDADOR, y <strong>${formData.arrendatario || "[ARRENDATARIO]"}</strong>, identificado con Cédula/NIT No. ${formData.arrendatarioId || "[ID]"}, con domicilio en ${formData.arrendatarioDir || "[DIRECCIÓN]"}, quien en adelante se denominará EL ARRENDATARIO, han celebrado el presente CONTRATO DE ARRENDAMIENTO, regido por las siguientes cláusulas:
            </div>
            
            <div style="margin-bottom: 15px;">
              <div style="font-weight: bold;">PRIMERA - OBJETO:</div>
              EL ARRENDADOR entrega a EL ARRENDATARIO, a título de arrendamiento, el inmueble ubicado en ${formData.inmuebleDir || "[DIRECCIÓN DEL INMUEBLE]"}.
            </div>
            
            <div style="margin-bottom: 15px;">
              <div style="font-weight: bold;">SEGUNDA - DESTINACIÓN:</div>
              El inmueble objeto de este contrato será destinado exclusivamente para ${formData.destinacion || "[DESTINACIÓN]"}, sin que pueda variar su destinación sin previo consentimiento escrito de EL ARRENDADOR.
            </div>
            
            <div style="margin-bottom: 15px;">
              <div style="font-weight: bold;">TERCERA - DURACIÓN:</div>
              El término de duración del presente contrato es de ${formData.duracionMeses || "[DURACIÓN]"} meses, contados a partir del ${formData.inicioContrato || "[FECHA INICIO]"} hasta el ${calculations.fechaFin || "[FECHA FIN]"}.
            </div>
            
            <div style="margin-bottom: 15px;">
              <div style="font-weight: bold;">CUARTA - CANON DE ARRENDAMIENTO:</div>
              El canon mensual de arrendamiento es la suma de ${formData.canonMensual || "[CANON]"} pesos colombianos, que EL ARRENDATARIO pagará a EL ARRENDADOR dentro de los cinco (5) primeros días de cada mes.
            </div>
            
            <div style="margin-bottom: 15px;">
              <div style="font-weight: bold;">QUINTA - SERVICIOS PÚBLICOS:</div>
              Los servicios públicos domiciliarios serán a cargo de EL ARRENDATARIO, quien deberá pagarlos oportunamente.
            </div>
            
            <div style="margin-bottom: 15px;">
              <div style="font-weight: bold;">SEXTA - ESTADO DEL INMUEBLE:</div>
              EL ARRENDATARIO declara haber recibido el inmueble en buen estado y se obliga a devolverlo en el mismo estado, salvo el deterioro natural por el uso y goce legítimos.
            </div>
            
            <div style="margin-bottom: 15px;">
              <div style="font-weight: bold;">SÉPTIMA - PROHIBICIONES:</div>
              EL ARRENDATARIO no podrá subarrendar, ceder o traspasar este contrato sin autorización previa y escrita de EL ARRENDADOR.
            </div>
            
            <div style="margin-bottom: 15px;">
              <div style="font-weight: bold;">OCTAVA - TERMINACIÓN DEL CONTRATO:</div>
              El presente contrato podrá darse por terminado por: 1) Vencimiento del plazo. 2) Mutuo acuerdo. 3) Incumplimiento de las obligaciones. 4) Las demás causales establecidas en la Ley 820 de 2003.
            </div>
            
            <div style="margin-top: 50px; display: flex; justify-content: space-between;">
              <div>
                <div style="border-top: 1px solid #000; width: 200px; text-align: center; padding-top: 5px;">EL ARRENDADOR</div>
                <div>${formData.arrendador || "[ARRENDADOR]"}</div>
                <div>C.C./NIT: ${formData.arrendadorId || "[ID]"}</div>
              </div>
              
              <div>
                <div style="border-top: 1px solid #000; width: 200px; text-align: center; padding-top: 5px;">EL ARRENDATARIO</div>
                <div>${formData.arrendatario || "[ARRENDATARIO]"}</div>
                <div>C.C./NIT: ${formData.arrendatarioId || "[ID]"}</div>
              </div>
            </div>
          </div>
        `
        break

      case "compraventa":
        html = `
          <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.5;">
            <h1 style="text-align: center; font-size: 18px; margin-bottom: 20px;">CONTRATO DE COMPRAVENTA</h1>
            
            <div style="margin-bottom: 15px;">
              Entre los suscritos a saber: <strong>${formData.vendedor || "[VENDEDOR]"}</strong>, identificado con Cédula/NIT No. ${formData.vendedorId || "[ID]"}, con domicilio en ${formData.vendedorDir || "[DIRECCIÓN]"}, quien en adelante se denominará EL VENDEDOR, y <strong>${formData.comprador || "[COMPRADOR]"}</strong>, identificado con Cédula/NIT No. ${formData.compradorId || "[ID]"}, con domicilio en ${formData.compradorDir || "[DIRECCIÓN]"}, quien en adelante se denominará EL COMPRADOR, han celebrado el presente CONTRATO DE COMPRAVENTA, regido por las siguientes cláusulas:
            </div>
            
            <div style="margin-bottom: 15px;">
              <div style="font-weight: bold;">PRIMERA - OBJETO:</div>
              EL VENDEDOR transfiere a título de venta real y efectiva a favor de EL COMPRADOR el dominio y posesión sobre el siguiente bien: ${formData.bienDescripcion || "[DESCRIPCIÓN DEL BIEN]"}.
            </div>
            
            <div style="margin-bottom: 15px;">
              <div style="font-weight: bold;">SEGUNDA - PRECIO Y FORMA DE PAGO:</div>
              El precio de venta es la suma de ${formData.precio || "[PRECIO]"} pesos colombianos, que EL COMPRADOR pagará a EL VENDEDOR de la siguiente manera: ${formData.formaPago || "[FORMA DE PAGO]"}.
            </div>
            
            <div style="margin-bottom: 15px;">
              <div style="font-weight: bold;">TERCERA - ENTREGA:</div>
              EL VENDEDOR hará entrega material del bien objeto de este contrato a EL COMPRADOR el día ${formData.fechaEntrega || "[FECHA DE ENTREGA]"}.
            </div>
            
            <div style="margin-bottom: 15px;">
              <div style="font-weight: bold;">CUARTA - SANEAMIENTO:</div>
              EL VENDEDOR garantiza que el bien objeto de este contrato es de su exclusiva propiedad, que no lo ha enajenado anteriormente y que está libre de gravámenes, embargos, condiciones resolutorias y limitaciones de dominio.
            </div>
            
            <div style="margin-bottom: 15px;">
              <div style="font-weight: bold;">QUINTA - GASTOS:</div>
              Los gastos que ocasione la celebración de este contrato, así como los impuestos y derechos que se causen, serán asumidos por partes iguales entre EL VENDEDOR y EL COMPRADOR.
            </div>
            
            <div style="margin-top: 30px; border: 1px solid #ddd; padding: 10px;">
              <h3>Cálculos según la Ley Colombiana:</h3>
              <div style="margin-bottom: 5px;"><strong>Precio Base: ${formData.precio || "0"}</strong></div>
              <div style="margin-bottom: 5px;"><strong>IVA (19%): ${calculations.iva || "0"}</strong></div>
              <div style="margin-bottom: 5px;"><strong>Precio Total con IVA: ${calculations.precioTotal || "0"}</strong></div>
            </div>
            
            <div style="margin-top: 50px; display: flex; justify-content: space-between;">
              <div>
                <div style="border-top: 1px solid #000; width: 200px; text-align: center; padding-top: 5px;">EL VENDEDOR</div>
                <div>${formData.vendedor || "[VENDEDOR]"}</div>
                <div>C.C./NIT: ${formData.vendedorId || "[ID]"}</div>
              </div>
              
              <div>
                <div style="border-top: 1px solid #000; width: 200px; text-align: center; padding-top: 5px;">EL COMPRADOR</div>
                <div>${formData.comprador || "[COMPRADOR]"}</div>
                <div>C.C./NIT: ${formData.compradorId || "[ID]"}</div>
              </div>
            </div>
          </div>
        `
        break

      default:
        html = "<div><h1>Tipo de contrato no soportado</h1></div>"
    }

    return html
  }

  // Generar vista previa del contrato
  const generatePreview = () => {
    try {
      setIsGenerating(true)
      const html = generateContractHTML()
      setPreviewContent(html)
      setIsGenerating(false)
    } catch (error) {
      console.error("Error generando vista previa:", error)
      setIsGenerating(false)
      setPreviewContent("<div><p>Error al generar la vista previa. Por favor intente de nuevo.</p></div>")
    }
  }

  // Descargar contrato como HTML (para web)
  const downloadAsHTML = () => {
    if (isWeb) {
      try {
        const html = generateContractHTML()
        const blob = new Blob([html], { type: "text/html" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `Contrato_${contractType}_${new Date().getTime()}.html`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      } catch (error) {
        console.error("Error al descargar HTML:", error)
        alert("Error al descargar el contrato. Por favor intente de nuevo.")
      }
    }
  }

  // Renderizar los campos del formulario según el tipo de contrato
  const renderFormFields = () => {
    const fields = contractTypes[contractType]?.fields || []

    return fields.map((field, index) => (
      <Animated.View
        key={field.key}
        style={[
          styles.customField,
          {
            transform: [
              {
                translateY: interpolate(contractTypeAnimation.value, [0, 1], [20, 0], Extrapolate.CLAMP),
              },
            ],
            opacity: interpolate(contractTypeAnimation.value, [0, 1], [0, 1], Extrapolate.CLAMP),
          },
        ]}
      >
        <Text style={styles.customFieldLabel}>
          {field.label}
          {field.required ? " *" : ""}:
        </Text>

        {field.type === "select" ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectScrollView}>
            <View style={styles.selectContainer}>
              {field.options && field.options.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[styles.selectOption, formData[field.key] === option && styles.selectOptionActive]}
                  onPress={() => handleFormDataChange(field.key, option)}
                >
                  <Text
                    style={[styles.selectOptionText, formData[field.key] === option && styles.selectOptionTextActive]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        ) : field.type === "textarea" ? (
          <TextInput
            style={[styles.customFieldInput, styles.textareaInput]}
            value={formData[field.key] || ""}
            onChangeText={(text) => handleFormDataChange(field.key, text)}
            placeholder={field.label}
            multiline={true}
            numberOfLines={3}
          />
        ) : field.type === "date" ? (
          <TextInput
            style={styles.customFieldInput}
            value={formData[field.key] || ""}
            onChangeText={(text) => handleFormDataChange(field.key, text)}
            placeholder="AAAA-MM-DD"
            keyboardType={isWeb ? "text" : "default"}
            inputMode="text"
          />
        ) : (
          <TextInput
            style={styles.customFieldInput}
            value={formData[field.key] || ""}
            onChangeText={(text) => handleFormDataChange(field.key, text)}
            placeholder={field.label}
            keyboardType={field.type === "number" ? "numeric" : "default"}
          />
        )}
      </Animated.View>
    ))
  }

  // Renderizar la previsualización del contrato
  const renderContractPreview = () => {
    return (
      <View style={styles.previewContainer}>
        
        {isGenerating ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.loadingText}>Generando vista previa...</Text>
          </View>
        ) : previewContent ? (
          <View style={styles.pdfContainer}>
            {isWeb ? (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  overflow: "auto",
                  backgroundColor: "#fff",
                  padding: "20px",
                  borderRadius: "8px",
                }}
                dangerouslySetInnerHTML={{ __html: previewContent }}
              />
            ) : (
              <ScrollView style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
                <Text>{previewContent ? previewContent.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ") : ""}</Text>
              </ScrollView>
            )}
          </View>
        ) : (
          <View style={styles.emptyPreview}>
            <MaterialCommunityIcons name="file-document-outline" size={60} color="#d1d5db" />
            <Text style={styles.emptyPreviewText}>
              Complete el formulario y genere la vista previa para ver el contrato
            </Text>
            <TouchableOpacity
              style={styles.emptyPreviewButton}
              onPress={() => {
                toggleOptions()
              }}
            >
              <Text style={styles.emptyPreviewButtonText}>Configurar contrato</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    )
  }

  // Renderizar los cálculos según el tipo de contrato
  const renderCalculations = () => {
    if (!calculations || Object.keys(calculations).length === 0) return null

    return (
      <View style={styles.calculationsContainer}>
        <Text style={styles.calculationsTitle}>Cálculos Automáticos:</Text>

        {(contractType === "laboralFijo" || contractType === "laboralIndefinido") && calculations.prestaciones ? (
          <>
            <Text style={styles.calculationSubtitle}>Prestaciones Sociales Mensuales:</Text>
            <Text style={styles.calculationItem}>Prima de Servicios: ${calculations.prestaciones?.prima || "0"}</Text>
            <Text style={styles.calculationItem}>Cesantías: ${calculations.prestaciones?.cesantias || "0"}</Text>
            <Text style={styles.calculationItem}>
              Intereses sobre Cesantías: ${calculations.prestaciones?.intCesantias || "0"}
            </Text>
            <Text style={styles.calculationItem}>Vacaciones: ${calculations.prestaciones?.vacaciones || "0"}</Text>

            <Text style={styles.calculationSubtitle}>Seguridad Social (Aportes del Empleador):</Text>
            <Text style={styles.calculationItem}>Salud (8.5%): ${calculations.seguridadSocial?.salud || "0"}</Text>
            <Text style={styles.calculationItem}>Pensión (12%): ${calculations.seguridadSocial?.pension || "0"}</Text>
            <Text style={styles.calculationItem}>ARL: ${calculations.seguridadSocial?.arl || "0"}</Text>
            <Text style={styles.calculationItem}>
              Parafiscales: ${calculations.seguridadSocial?.parafiscales || "0"}
            </Text>

            <Text style={styles.calculationTotal}>
              Costo Total Mensual para el Empleador: ${calculations.costoTotal || "0"}
            </Text>
          </>
        ) : contractType === "prestacionServicios" ? (
          <>
            <Text style={styles.calculationSubtitle}>Retención en la Fuente (10%):</Text>
            <Text style={styles.calculationItem}>${calculations.retencion || "0"}</Text>

            <Text style={styles.calculationTotal}>Valor Neto a Recibir: ${calculations.valorNeto || "0"}</Text>
            <Text style={styles.calculationNote}>
              Nota: El contratista debe asumir el pago de seguridad social como trabajador independiente.
            </Text>
          </>
        ) : contractType === "compraventa" ? (
          <>
            <Text style={styles.calculationSubtitle}>Precio Base:</Text>
            <Text style={styles.calculationItem}>${formData.precio || "0"}</Text>

            <Text style={styles.calculationSubtitle}>IVA (19%):</Text>
            <Text style={styles.calculationItem}>${calculations.iva || "0"}</Text>

            <Text style={styles.calculationTotal}>Precio Total con IVA: ${calculations.precioTotal || "0"}</Text>
          </>
        ) : null}

        {calculations.fechaFin && (
          <>
            <Text style={styles.calculationSubtitle}>Fecha de Finalización:</Text>
            <Text style={styles.calculationItem}>{calculations.fechaFin}</Text>
          </>
        )}
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
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
                
              </View>
        {/* Layout para pantallas grandes (web) */}
        {isLargeScreen ? (
          <View style={styles.webLayout}>
            {/* Panel izquierdo (vista previa) */}
            <Animated.View style={[styles.webPreviewPanel, previewAnimatedStyle]}>
              <View style={styles.previewCard}>
                <View style={styles.previewHeader}>
                  <Text style={styles.previewTitle}>Vista previa del Contrato</Text>
                  <TouchableOpacity onPress={toggleOptions} style={styles.optionsButton} activeOpacity={0.7}>
                    <MaterialCommunityIcons
                      name={showOptions ? "chevron-right" : "tune-vertical"}
                      size={24}
                      color="#fff"
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.previewBody}>{renderContractPreview()}</View>
              </View>
            </Animated.View>

            {/* Panel derecho (opciones) */}
            <Animated.View style={[styles.webOptionsPanel, optionsAnimatedStyle]}>
              <ScrollView style={styles.optionsScrollView} contentContainerStyle={styles.optionsContent}>
                <Text style={styles.optionsTitle}>Generador de Contratos</Text>

                {/* Selección de tipo de contrato */}
                <View style={styles.optionRow}>
                  <Text style={styles.optionLabel}>Tipo de Contrato:</Text>
                  <Animated.View style={[styles.contractTypeGrid, contractTypeAnimatedStyle]}>
                    {Object.entries(contractTypes).map(([key, type]) => (
                      <TouchableOpacity
                        key={key}
                        style={[styles.contractTypeCard, contractType === key && styles.contractTypeCardActive]}
                        onPress={() => {
                          setContractType(key)
                          setFormData({})
                          setCalculations({})
                          setPreviewContent(null)
                        }}
                      >
                        <MaterialCommunityIcons
                          name={type.icon}
                          size={32}
                          color={contractType === key ? "#fff" : "#4b5563"}
                        />
                        <Text style={[styles.contractTypeText, contractType === key && styles.contractTypeTextActive]}>
                          {type.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </Animated.View>
                </View>

                {/* Descripción del contrato */}
                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionText}>{contractTypes[contractType]?.description}</Text>
                </View>

                {/* Campos del formulario */}
                <View style={styles.formContainer}>
                  <Text style={styles.formTitle}>Datos del Contrato:</Text>
                  {renderFormFields()}
                </View>

                {/* Cálculos */}
                {renderCalculations()}

                {/* Botones de acción */}
                <View style={styles.actionButtonsContainer}>
                  <TouchableOpacity
                    style={[styles.generateButton, isGenerating && styles.disabledButton]}
                    onPress={generatePreview}
                    disabled={isGenerating}
                    activeOpacity={0.8}
                  >
                    <MaterialCommunityIcons name="file-document-outline" size={20} color="#fff" />
                    <Text style={styles.generateButtonText}>Generar Vista Previa</Text>
                  </TouchableOpacity>

                  {previewContent && isWeb && (
                    <TouchableOpacity style={styles.downloadButton} onPress={downloadAsHTML} activeOpacity={0.8}>
                      <MaterialCommunityIcons name="download" size={20} color="#fff" />
                      <Text style={styles.generateButtonText}>Descargar HTML</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </ScrollView>
            </Animated.View>
          </View>
        ) : (
          // Layout para pantallas pequeñas (móvil)
          <View style={styles.mobileLayout}>
            {/* Vista previa */}
            <Animated.View
              style={[styles.mobilePreviewSection, previewAnimatedStyle, { height: showOptions ? "40%" : "100%" }]}
            >
              <View style={styles.previewCard}>
                <View style={styles.previewHeader}>
                  <Text style={styles.previewTitle}>Vista previa del Contrato</Text>
                  <TouchableOpacity onPress={toggleOptions} style={styles.optionsButton} activeOpacity={0.7}>
                    <MaterialCommunityIcons
                      name={showOptions ? "chevron-down" : "tune-vertical"}
                      size={24}
                      color="#fff"
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.previewBody}>{renderContractPreview()}</View>
              </View>
            </Animated.View>

            {/* Panel de opciones */}
            <Animated.View
              style={[styles.mobileOptionsSection, optionsAnimatedStyle, { height: showOptions ? "60%" : 0 }]}
            >
              <ScrollView style={styles.optionsScrollView} contentContainerStyle={styles.optionsContent}>
                <Text style={styles.optionsTitle}>Generador de Contratos</Text>

                {/* Selección de tipo de contrato */}
                <View style={styles.optionRow}>
                  <Text style={styles.optionLabel}>Tipo de Contrato:</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.contractTypeContainer}
                  >
                    {Object.entries(contractTypes).map(([key, type]) => (
                      <TouchableOpacity
                        key={key}
                        style={[styles.contractTypeButton, contractType === key && styles.contractTypeButtonActive]}
                        onPress={() => {
                          setContractType(key)
                          setFormData({})
                          setCalculations({})
                          setPreviewContent(null)
                        }}
                        activeOpacity={0.7}
                      >
                        <MaterialCommunityIcons
                          name={type.icon}
                          size={24}
                          color={contractType === key ? "#fff" : "#4b5563"}
                        />
                        <Text style={[styles.contractTypeText, contractType === key && styles.contractTypeTextActive]}>
                          {type.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Descripción del contrato */}
                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionText}>{contractTypes[contractType]?.description}</Text>
                </View>

                {/* Campos del formulario */}
                <View style={styles.formContainer}>
                  <Text style={styles.formTitle}>Datos del Contrato:</Text>
                  {renderFormFields()}
                </View>

                {/* Cálculos */}
                {renderCalculations()}

                {/* Botones de acción */}
                <View style={styles.actionButtonsContainer}>
                  <TouchableOpacity
                    style={[styles.generateButton, isGenerating && styles.disabledButton]}
                    onPress={generatePreview}
                    disabled={isGenerating}
                    activeOpacity={0.8}
                  >
                    <MaterialCommunityIcons name="file-document-outline" size={20} color="#fff" />
                    <Text style={styles.generateButtonText}>Generar Vista Previa</Text>
                  </TouchableOpacity>

                  {previewContent && isWeb && (
                    <TouchableOpacity style={styles.downloadButton} onPress={downloadAsHTML} activeOpacity={0.8}>
                      <MaterialCommunityIcons name="download" size={20} color="#fff" />
                      <Text style={styles.generateButtonText}>Descargar HTML</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </ScrollView>
            </Animated.View>
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  container: {
    flex: 1,
  },
  header: {
     flexDirection: 'row',
         justifyContent: 'space-between',
         alignItems: 'center',
         padding: 16,
         backgroundColor: 'white',
         ...Platform.select({
           ios: {
             shadowColor: '#000',
             shadowOffset: { width: 0, height: 2 },
             shadowOpacity: 0.25,
             shadowRadius: 3.84,
           },
           android: {
             elevation: 4,
           },
         }),
    },
  webLayout: {
    flex: 1,
    flexDirection: "row",
  },
  webPreviewPanel: {
    flex: 3,
    padding: 16,
  },
  webOptionsPanel: {
    flex: 2,
    backgroundColor: "#fff",
    borderLeftWidth: 1,
    borderLeftColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 5,
  },
  mobileLayout: {
    flex: 1,
    position: "relative",
  },
  mobilePreviewSection: {
    padding: 8,
    backgroundColor: "#f9fafb",
  },
  mobileOptionsSection: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  previewCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#00ACE8",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  previewTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  optionsButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  previewBody: {
    flex: 1,
  },
  optionsScrollView: {
    flex: 1,
  },
  optionsContent: {
    padding: 24,
    paddingBottom: 40,
  },
  optionsTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
    color: "#111827",
  },
  optionRow: {
    marginBottom: 24,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#374151",
  },
  contractTypeContainer: {
    flexDirection: "row",
    paddingVertical: 8,
  },
  contractTypeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  contractTypeButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
    marginRight: 12,
    minWidth: 180,
  },
  contractTypeButtonActive: {
    backgroundColor: "#00ACE8",
  },
  contractTypeCard: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    width: "48%",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  contractTypeCardActive: {
    backgroundColor: "#6366f1",
  },
  contractTypeText: {
    fontSize: 14,
    color: "#4b5563",
    marginLeft: 8,
    fontWeight: "500",
  },
  contractTypeTextActive: {
    color: "#fff",
  },
  descriptionContainer: {
    backgroundColor: "#f3f4f6",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: "#00ACE8",
  },
  descriptionText: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },
  formContainer: {
    marginBottom: 24,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#111827",
  },
  customField: {
    marginBottom: 16,
  },
  customFieldLabel: {
    fontSize: 14,
    marginBottom: 6,
    color: "#4b5563",
    fontWeight: "500",
  },
  customFieldInput: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    width: "100%",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  textareaInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  selectScrollView: {
    maxWidth: "100%",
  },
  selectContainer: {
    flexDirection: "row",
    flexWrap: "nowrap",
  },
  selectOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
    marginRight: 8,
    marginBottom: 8,
  },
  selectOptionActive: {
    backgroundColor: "#00ACE8",
  },
  selectOptionText: {
    fontSize: 14,
    color: "#4b5563",
    fontWeight: "500",
  },
  selectOptionTextActive: {
    color: "#fff",
  },
  calculationsContainer: {
    marginBottom: 24,
    padding: 20,
    backgroundColor: "#f0f7ff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  calculationsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#1e40af",
  },
  calculationSubtitle: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 6,
    color: "#3b82f6",
  },
  calculationItem: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 4,
    paddingLeft: 12,
  },
  calculationTotal: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    color: "#1e40af",
  },
  calculationNote: {
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 12,
    color: "#6b7280",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    flexWrap: "wrap",
    gap: 12,
  },
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6366f1",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10b981",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.6,
  },
  generateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  pdfContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
  },
  emptyPreview: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyPreviewText: {
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
    color: "#6b7280",
    fontSize: 16,
  },
  emptyPreviewButton: {
    backgroundColor: "#00ACE8",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  emptyPreviewButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    color: "#6366f1",
    fontSize: 16,
    fontWeight: "500",
  },
})

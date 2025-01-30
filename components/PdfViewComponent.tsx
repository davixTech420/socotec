import type React from "react"
import { useState } from "react"
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, Platform } from "react-native"
import { AntDesign } from "@expo/vector-icons"
import * as FileSystem from "expo-file-system"
import * as Sharing from "expo-sharing"
import * as Print from "expo-print"
import { WebView } from "react-native-webview"

interface SimpleDynamicFileViewerProps {
  pdfContent?: string
  excelData?: Array<Array<string | number>>
}

const SimpleDynamicFileViewer: React.FC<SimpleDynamicFileViewerProps> = ({
  pdfContent = "Este es un contenido de ejemplo para el PDF.",
  excelData = [
    ["Nombre", "Edad", "Ciudad"],
    ["Juan", 30, "Madrid"],
    ["María", 25, "Barcelona"],
    ["Pedro", 35, "Valencia"],
  ],
}) => {
  const [fileType, setFileType] = useState<"pdf" | "excel" | null>(null)
  const [showFile, setShowFile] = useState(false)
  const [pdfUri, setPdfUri] = useState<string | null>(null)

  const toggleFileView = async (type: "pdf" | "excel") => {
    if (!showFile || fileType !== type) {
      setFileType(type)
      setShowFile(true)
      if (type === "pdf") {
        const uri = await generatePdf()
        setPdfUri(uri)
      }
    } else {
      setShowFile(false)
      setFileType(null)
      setPdfUri(null)
    }
  }

  const generatePdf = async () => {
    const htmlContent = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        </head>
        <body style="font-family: 'Helvetica'; padding: 20px;">
          <h1 style="color: #333;">PDF Generado</h1>
          <div>${pdfContent}</div>
        </body>
      </html>
    `

    if (Platform.OS === "web") {
      return URL.createObjectURL(new Blob([htmlContent], { type: "text/html" }))
    } else {
      try {
        const { uri } = await Print.printToFileAsync({ html: htmlContent })
        return uri
      } catch (error) {
        console.error("Error generando PDF:", error)
        return null
      }
    }
  }

  const generateExcelContent = () => {
    return excelData.map((row) => row.join(",")).join("\n")
  }

  const handleDownloadOrShare = async () => {
    try {
      if (Platform.OS === "web") {
        if (fileType === "pdf") {
          if (pdfUri) {
            const link = document.createElement("a")
            link.href = pdfUri
            link.download = "documento.pdf"
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        } else {
          const content = generateExcelContent()
          const blob = new Blob([content], { type: "text/csv;charset=utf-8;" })
          const url = URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.setAttribute("href", url)
          link.setAttribute("download", "documento.csv")
          link.style.visibility = "hidden"
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      } else {
        if (fileType === "pdf") {
          if (pdfUri) {
            await Sharing.shareAsync(pdfUri, { UTI: "com.adobe.pdf", mimeType: "application/pdf" })
          } else {
            alert("Error: No se pudo generar el PDF")
          }
        } else {
          const content = generateExcelContent()
          const csvUri = FileSystem.documentDirectory + "documento.csv"
          await FileSystem.writeAsStringAsync(csvUri, content, { encoding: FileSystem.EncodingType.UTF8 })
          await Sharing.shareAsync(csvUri, { mimeType: "text/csv", dialogTitle: "Compartir CSV" })
        }
      }
    } catch (error) {
      console.error("Error al procesar el archivo:", error)
      alert("Error al procesar el archivo")
    }
  }

  const renderPdfPreview = () => {
    if (Platform.OS === "web") {
      return pdfUri ? (
        <iframe src={pdfUri} style={{ width: "100%", height: "400px", border: "none" }} />
      ) : (
        <Text>Cargando PDF...</Text>
      )
    } else {
      return pdfUri ? (
        <WebView source={{ uri: pdfUri }} style={{ width: "100%", height: 400 }} />
      ) : (
        <Text>Cargando PDF...</Text>
      )
    }
  }

  const renderExcelPreview = () => (
    <ScrollView style={{ maxHeight: 400 }}>
      <View style={styles.table}>
        {excelData.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, cellIndex) => (
              <Text key={cellIndex} style={[styles.cell, rowIndex === 0 && styles.header]}>
                {cell}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  )

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => toggleFileView("pdf")} style={styles.button}>
        <AntDesign name="pdffile1" size={24} color="red" style={styles.icon} />
        <Text style={styles.buttonText}>{showFile && fileType === "pdf" ? "Ocultar PDF" : "Mostrar PDF"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => toggleFileView("excel")} style={styles.button}>
        <AntDesign name="fileexcel" size={24} color="green" style={styles.icon} />
        <Text style={styles.buttonText}>{showFile && fileType === "excel" ? "Ocultar Excel" : "Mostrar Excel"}</Text>
      </TouchableOpacity>

      {showFile && (
        <View style={styles.fileContainer}>
          {fileType === "pdf" ? renderPdfPreview() : renderExcelPreview()}
          <TouchableOpacity onPress={handleDownloadOrShare} style={styles.actionButton}>
            <Text style={styles.actionButtonText}>
              {Platform.OS === "web" ? "Descargar" : "Compartir"} {fileType === "pdf" ? "PDF" : "CSV"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    marginLeft: 10,
  },
  icon: {
    marginRight: 10,
  },
  fileContainer: {
    width: "100%",
    marginTop: 16,
  },
  table: {
    borderWidth: 1,
    borderColor: "#ddd",
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  header: {
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
  },
  actionButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  actionButtonText: {
    color: "white",
  },
})

export default SimpleDynamicFileViewer

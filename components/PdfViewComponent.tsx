import type React from "react"
import { useState } from "react"
import { View, StyleSheet, TouchableOpacity, Modal, Platform } from "react-native"
import { Text } from "react-native-paper"
import {AntDesign } from "@expo/vector-icons"
import * as Print from "expo-print"
import * as Sharing from "expo-sharing"

interface Column {
  key: string
  title: string
}

interface PDFViewComponentProps {
  columns: Column[]
  data: any[]
  iconStyle?: object
}

const PDFViewComponent: React.FC<PDFViewComponentProps> = ({ columns, data, iconStyle }) => {
  const [modalVisible, setModalVisible] = useState(false)

  const toggleModal = () => {
    setModalVisible(!modalVisible)
  }

  const generatePDF = async () => {
    const htmlContent = `
      <html>
        <head>
          <style>
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Datos del Informe</h1>
          <table>
            <thead>
              <tr>${columns.map((column) => `<th>${column.title}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${data
                .map(
                  (row) => `
                <tr>
                  ${columns.map((column) => `<td>${row[column.key]}</td>`).join("")}
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `

    if (Platform.OS === "web") {
      const newWindow = window.open("", "_blank")
      if (newWindow) {
        newWindow.document.write(htmlContent)
        newWindow.document.close()
        newWindow.print()
      }
    } else {
      try {
        const { uri } = await Print.printToFileAsync({ html: htmlContent })
        await Sharing.shareAsync(uri)
      } catch (error) {
        console.error("Error al generar o compartir el PDF:", error)
      }
    }
  }

  return (
    <View>
      <TouchableOpacity onPress={toggleModal}>
        <AntDesign name="pdffile1" size={24} color="red" style={[styles.icon, iconStyle]} />
      </TouchableOpacity>
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={toggleModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Previsualización de Datos</Text>
            <View style={styles.table}>
              <View style={styles.headerRow}>
                {columns.map((column) => (
                  <View key={column.key} style={styles.headerCell}>
                    <Text style={styles.headerText}>{column.title}</Text>
                  </View>
                ))}
              </View>
              {data.map((item, index) => (
                <View key={index} style={styles.row}>
                  {columns.map((column) => (
                    <View key={column.key} style={styles.cell}>
                      <Text>{item[column.key]}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={toggleModal} style={styles.button}>
                <Text style={styles.buttonText}>Cerrar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={generatePDF} style={styles.button}>
                <Text style={styles.buttonText}>Generar PDF</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  icon: {
    marginBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  table: {
    borderWidth: 1,
    borderColor: "#ddd",
    maxHeight: 300,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
  },
  headerCell: {
    flex: 1,
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: "#ddd",
  },
  headerText: {
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  cell: {
    flex: 1,
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: "#ddd",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
})

export default PDFViewComponent;

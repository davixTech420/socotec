import type React from "react"
import { useState } from "react"
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, Platform } from "react-native"
import { Text } from "react-native-paper"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import * as FileSystem from "expo-file-system"
import * as Sharing from "expo-sharing"
import * as XLSX from "xlsx"


interface Column {
  key: string
  title: string
}

interface ExcelPreviewButtonProps {
  columns: Column[]
  data: any[]
  iconStyle?: object
}

const ExcelPreviewButton: React.FC<ExcelPreviewButtonProps> = ({ columns, data, iconStyle }) => {
  const [modalVisible, setModalVisible] = useState(false)

  const toggleModal = () => {
    setModalVisible(!modalVisible)
  }
  const generateExcel = async () => {
    // Convertir datos a hoja de Excel
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Generar el archivo en base64
    const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });

    // Definir nombre del archivo
    const fileName = "data.xlsx";

    if (Platform.OS === "web") {
      // 💻 **Solución para la web**: Crear un Blob y descargarlo
      const blob = new Blob([XLSX.write(wb, { type: "array", bookType: "xlsx" })], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // 📱 **Solución para móviles**: Guardar y compartir con `expo-file-system`
      const filePath = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(filePath, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, {
          UTI: ".xlsx",
          mimeType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
      }
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleModal}>
        <MaterialCommunityIcons name="file-excel" size={24} color="green" style={[styles.icon, iconStyle]} />
      </TouchableOpacity>
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={toggleModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Previsualización de Excel</Text>
            <ScrollView style={styles.tableContainer}>
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
            </ScrollView>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={toggleModal} style={styles.button}>
                <Text style={styles.buttonText}>Cerrar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={generateExcel} style={styles.button}>
                <Text style={styles.buttonText}>Descargar Excel</Text>
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
  tableContainer: {
    maxHeight: 300,
  },
  table: {
    borderWidth: 1,
    borderColor: "#ddd",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
  },
  headerCell: {
    width: 100,
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
    width: 100,
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

export default ExcelPreviewButton


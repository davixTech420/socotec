import React, { useState } from "react";
import {
  View, StyleSheet, TouchableOpacity, Modal, Platform, ScrollView
} from "react-native";
import { Text } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Picker } from '@react-native-picker/picker';

interface Column {
  key: string;
  title: string;
}

interface PDFViewComponentProps {
  columns: Column[];
  data: any[];
  iconStyle?: object;
  customContent?: string; // Contenido HTML personalizado
}

const PDFViewComponent: React.FC<PDFViewComponentProps> = ({ columns, data, iconStyle, customContent }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState("all"); // Estado para el filtro

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const generatePDF = async () => {
    const filteredData = filterData(data, filter); // Filtrar los datos según la selección del usuario

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .logo { width: 100px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
           <img src="${require("../assets/images/favicon.png")}" class="logo" alt="Logo" />
          <h1>Reporte de Datos</h1>
          ${customContent || ""}
          <table>
            <thead>
              <tr>${columns.map((column) => `<th>${column.title}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${filteredData.map(row => `
                <tr>
                  ${columns.map(column =>`<td>${row[column.key]}</td>`).join("")}
                </tr>
              `).join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    if (Platform.OS === "web") {
      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.document.write(htmlContent);
        newWindow.document.close();
        newWindow.print();
      }
    } else {
      try {
        const { uri } = await Print.printToFileAsync({ html: htmlContent });
        await Sharing.shareAsync(uri);
      } catch (error) {
        console.error("Error al generar o compartir el PDF:", error);
      }
    }
  };

  const filterData = (data: any[], filter: string) => {
    switch (filter) {
      case "true":
        return data.filter(item => item.estado === true);
      case "false":
        return data.filter(item => item.estado === false);
      default:
        return data;
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleModal}>
        <AntDesign name="pdffile1" size={24} color="red" style={[styles.icon, iconStyle]} />
      </TouchableOpacity>
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={toggleModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Previsualización de Datos</Text>
            <Picker
              selectedValue={filter}
              style={styles.picker}
              onValueChange={(itemValue) => setFilter(itemValue)}
            >
              <Picker.Item label="Todos" value="all" />
              <Picker.Item label="Activos" value={true}/>
              <Picker.Item label="Inactivos" value={false}/>
            </Picker>
            <ScrollView style={styles.scrollContainer} horizontal>
              <ScrollView style={styles.innerScroll}>
                <View style={styles.table}>
                  <View style={styles.headerRow}>
                    {columns.map((column) => (
                      <View key={column.key} style={styles.headerCell}>
                        <Text style={styles.headerText}>{column.title}</Text>
                      </View>
                    ))}
                  </View>
                  {filterData(data, filter).map((item, index) => (
                    <View key={index} style={styles.row}>
                      {columns.map((column) =>(
                        <View key={column.key} style={styles.cell}>
                          <Text style={styles.cellText}> {item[column.key]}</Text>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>
              </ScrollView>
            </ScrollView>
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
  );
};

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
    borderRadius: 10,
    padding: 15,
    width: "90%",
    maxHeight: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  picker: {
    width: "100%",
    marginBottom: 10,
  },
  scrollContainer: {
    maxHeight: 300,
    width: "100%",
  },
  innerScroll: {
    width: "100%",
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
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
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontWeight: "bold",
    textAlign: "center",
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
    justifyContent: "center",
    alignItems: "center",
  },
  cellText: {
    textAlign: "center",
    flexWrap: "wrap", // Para evitar desbordamiento en pantallas pequeñas
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
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
});

export default PDFViewComponent;
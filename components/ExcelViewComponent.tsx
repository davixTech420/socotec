import type React from "react"
import { useState, useCallback } from "react"
import { View, StyleSheet, Platform } from "react-native"
import { Button, Modal, Portal, Provider as PaperProvider, DataTable, Text } from "react-native-paper"
import * as FileSystem from "expo-file-system"
import * as Sharing from "expo-sharing"
import XLSX from "xlsx"

interface Column {
  key: string
  title: string
}

interface ExcelPreviewModalProps {
  columns: Column[]
  data: any[]
  buttonText?: string
}

const ExcelPreviewModal: React.FC<ExcelPreviewModalProps> = ({ columns, data, buttonText = "Previsualizar Excel" }) => {
  const [visible, setVisible] = useState(false)

  const showModal = () => setVisible(true)
  const hideModal = () => setVisible(false)

  const generateExcel = useCallback(async () => {
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1")
    const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" })

    const fileName = "data.xlsx"
    const filePath = `${FileSystem.documentDirectory}${fileName}`

    await FileSystem.writeAsStringAsync(filePath, wbout, {
      encoding: FileSystem.EncodingType.Base64,
    })

    if (Platform.OS === "web") {
      // For web, we'll use a different approach
      const blob = new Blob([s2ab(atob(wbout))], { type: "application/octet-stream" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = fileName
      a.click()
      URL.revokeObjectURL(url)
    } else {
      await Sharing.shareAsync(filePath, {
        UTI: ".xlsx",
        mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })
    }
  }, [data])

  // Helper function for web
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length)
    const view = new Uint8Array(buf)
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff
    return buf
  }

  return (
    <PaperProvider>
      <View>
        <Button onPress={showModal}>{buttonText}</Button>
        <Portal>
          <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
            <Text style={styles.title}>Previsualización de Excel</Text>
            <DataTable>
              <DataTable.Header>
                {columns.map((column) => (
                  <DataTable.Title key={column.key}>{column.title}</DataTable.Title>
                ))}
              </DataTable.Header>

              {data.slice(0, 5).map((item, index) => (
                <DataTable.Row key={index}>
                  {columns.map((column) => (
                    <DataTable.Cell key={column.key}>{item[column.key]}</DataTable.Cell>
                  ))}
                </DataTable.Row>
              ))}
            </DataTable>
            {data.length > 5 && <Text style={styles.moreData}>... y {data.length - 5} filas más</Text>}
            <View style={styles.buttonContainer}>
              <Button onPress={hideModal} style={styles.button}>
                Cerrar
              </Button>
              <Button onPress={generateExcel} style={styles.button}>
                Descargar Excel
              </Button>
            </View>
          </Modal>
        </Portal>
      </View>
    </PaperProvider>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    maxHeight: "80%",
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  moreData: {
    marginTop: 10,
    fontStyle: "italic",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
})

export default ExcelPreviewModal


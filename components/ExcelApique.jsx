import React from "react";
import { View, Button, Alert } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import XLSX from "xlsx";
import { Asset } from "expo-asset";

const ExcelApique = ({ data, onGenerate }) => {
  const generateExcel = async () => {
    try {
      // Crear un nuevo libro de trabajo
      const wb = XLSX.utils.book_new();

      // Crear la hoja de cálculo con los datos estructurados
      const ws = createWorksheet(data);

      // Añadir la hoja al libro
      XLSX.utils.book_append_sheet(wb, ws, "Perfil");

      // Generar el archivo Excel
      const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });

      // Guardar el archivo temporalmente
      const uri = FileSystem.cacheDirectory + "Perfil_estratigrafico.xlsx";
      await FileSystem.writeAsStringAsync(uri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Compartir el archivo
      await Sharing.shareAsync(uri, {
        mimeType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        dialogTitle: "Compartir perfil estratigráfico",
        UTI: "com.microsoft.excel.xlsx",
      });

      onGenerate && onGenerate(true);
    } catch (error) {
      console.error("Error al generar Excel:", error);
      Alert.alert("Error", "No se pudo generar el archivo Excel");
      onGenerate && onGenerate(false);
    }
  };

  // Función para crear la hoja de cálculo con el formato específico
  const createWorksheet = (data) => {
    // Primero creamos una matriz vacía que representará las filas del Excel
    const wsData = [];

    // Añadir filas de encabezado según el formato original
    wsData.push([
      ,
      ,
      ,
      "INFORME DE RESULTADO\nPERFIL ESTRATIGRÁFICO - APIQUE",
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      "Código interno No. BAC-COL-AR-14\nVersión No. 01\nFecha: Marzo 2023",
    ]);
    wsData.push([, , , , , , , , , , , , , , , "Si"]);
    wsData.push([, , , , , , , , , , , , , , , "No"]);
    wsData.push([
      "Informe No.",
      ,
      ,
      data.informeNum,
      ,
      ,
      ,
      ,
      ,
      "Albarán No.",
      ,
      data.albaranNum,
      ,
      ,
      ,
      ,
      "Mecánico",
    ]);
    wsData.push([
      "Cliente:",
      ,
      ,
      data.cliente,
      ,
      ,
      ,
      ,
      ,
      "Fecha de ejecución inicio:\n(aaaa-mm-dd)",
      ,
      data.fechaEjecucionInicio,
      ,
      ,
      ,
      ,
      "Manual",
    ]);
    wsData.push([
      "Título de obra:",
      ,
      ,
      data.tituloObra,
      ,
      ,
      ,
      ,
      ,
      "Fecha de ejecución final:\n(aaaa-mm-dd)",
      ,
      data.fechaEjecucionFinal,
      ,
      ,
      ,
      ,
      "",
    ]);
    wsData.push([
      "Localización:",
      ,
      ,
      data.localizacion,
      ,
      ,
      ,
      ,
      ,
      "Fecha de emisión:",
      ,
      data.fechaEmision,
      ,
      ,
      ,
      ,
      "",
    ]);
    wsData.push([]);
    wsData.push([
      "Nivel freático",
      ,
      ,
      ,
      ,
      "Dimensiones apique",
      ,
      ,
      ,
      ,
      "Identificación",
      ,
      ,
      ,
      ,
    ]);
    wsData.push([
      "¿Existe?",
      ,
      "No",
      ,
      ,
      "Largo (m):",
      ,
      data.largoApique,
      ,
      ,
      ,
      "Apique No.:",
      ,
      "1",
      ,
      ,
      ,
    ]);
    wsData.push([
      "Nivel (m):",
      ,
      "Fecha\n(aaaa-mm-dd)",
      "Hora\n(hh:mm)",
      ,
      ,
      "Ancho (m):",
      ,
      data.anchoApique,
      ,
      ,
      ,
      "Tipo:",
      ,
      data.tipo,
      ,
      ,
    ]);
    wsData.push([
      "N/A",
      ,
      "N/A",
      ,
      ,
      ,
      ,
      "Profundidad (m):",
      ,
      data.profundidadApique,
      ,
      ,
      ,
      "Operario:",
      ,
      data.operario,
      ,
      ,
    ]);
    wsData.push([]);
    wsData.push([
      "Muestra",
      "Profundidad (m)",
      ,
      "Espesor estrato (m)",
      "Estrato",
      "Descripción del estrato",
      ,
      "Resultados ensayos",
      "Granulometría",
      "U.S.C.S",
      "Tipo de muestra",
      "PDC",
      ,
      ,
      ,
    ]);
    wsData.push([
      "No.",
      "Inicio",
      "Fin",
      ,
      ,
      "Descripción",
      ,
      ,
      "Resultados",
      "Composición",
      "Clasificación",
      "Muestra",
      "Li (cm)",
      "Lf (cm)",
      "# Gl",
      ,
    ]);

    // Aquí puedes añadir los datos específicos de los estratos si los tienes
    // Ejemplo:
    // wsData.push(["1", "0", "0.53", "0.53", "", "Material arcilloso...", ...]);

    wsData.push([]);
    wsData.push([]);
    wsData.push(["Observaciones", , , data.observaciones, , , , , , , , , , ,]);
    wsData.push([]);
    wsData.push([, , , "Revisó y aprobó", , , , , , , , , , ,]);
    wsData.push([, , , "Firma:", , , , , , , , , , ,]);
    wsData.push([
      ,
      ,
      ,
      "Nombres:",
      "Roniel Javib Pacheco Valderrama",
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
    ]);
    wsData.push([, , , "Cargo:", "Coordinador Técnico", , , , , , , , , ,]);

    // Convertir la matriz en una hoja de cálculo
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Ajustar el ancho de las columnas (opcional)
    ws["!cols"] = [
      { wch: 10 },
      { wch: 12 },
      { wch: 8 },
      { wch: 12 },
      { wch: 15 },
      { wch: 30 },
      { wch: 8 },
      { wch: 15 },
      { wch: 12 },
      { wch: 12 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
      { wch: 8 },
    ];

    return ws;
  };

  return (
    <View>
      <Button title="Generar Excel" onPress={generateExcel} />
    </View>
  );
};

export default ExcelApique;

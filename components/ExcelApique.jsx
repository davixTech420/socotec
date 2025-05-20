import { Alert, Platform } from "react-native";
import { IconButton } from "react-native-paper";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { utils, writeFile } from "xlsx-js-style";
import logo from "@/assets/images/LogoFiles.png";

const ExcelApique = ({ data, onGenerate, images = [] }) => {
  const generateExcel = async () => {
    try {
      // 1. Create workbook and worksheet
      const wb = utils.book_new();
      const ws = utils.aoa_to_sheet([]);

      // 2. Define styles
      const borderStyle = {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      };

      const headerStyle = {
        fill: { fgColor: { rgb: "FFFFFF" } },
        font: { bold: true, sz: 12 },
        alignment: { horizontal: "center", vertical: "center", wrapText: true },
        border: borderStyle,
      };

      const titleStyle = {
        font: { bold: true, sz: 14 },
        alignment: { horizontal: "center", vertical: "center" },
        border: borderStyle,
      };

      const sectionHeaderStyle = {
        fill: { fgColor: { rgb: "DCE6F1" } }, // Light blue
        font: { bold: true, sz: 11 },
        alignment: { horizontal: "center", vertical: "center", wrapText: true },
        border: borderStyle,
      };

      const cellStyle = {
        alignment: { vertical: "center", horizontal: "center", wrapText: true },
        border: borderStyle,
      };

      const labelStyle = {
        fill: { fgColor: { rgb: "DCE6F1" } }, // Light blue
        font: { bold: true, sz: 11 },
        alignment: { vertical: "center", horizontal: "center", wrapText: true },
        border: borderStyle,
      };

      const tableHeaderStyle = {
        fill: { fgColor: { rgb: "DCE6F1" } }, // Light blue
        font: { bold: true, sz: 10 },
        alignment: { horizontal: "center", vertical: "center", wrapText: true },
        border: borderStyle,
      };

      const soilStyle1 = {
        fill: { fgColor: { rgb: "C65911" } }, // Brown color for soil type 1
        border: borderStyle,
      };

      const soilStyle2 = {
        fill: { fgColor: { rgb: "5F3E1F" } }, // Darker brown for soil type 2
        border: borderStyle,
      };

      const soilStyle3 = {
        fill: { fgColor: { rgb: "DFA67B" } }, // Lighter brown for soil type 3
        border: borderStyle,
      };

      const photoSectionStyle = {
        fill: { fgColor: { rgb: "DCE6F1" } }, // Light blue
        font: { bold: true, sz: 12 },
        alignment: { horizontal: "center", vertical: "center" },
        border: borderStyle,
      };

      const abbreviationsStyle = {
        font: { sz: 8 }, // Smaller font for abbreviations
        alignment: { horizontal: "left", vertical: "center", wrapText: true },
        border: borderStyle,
      };

      // Ajuste crítico: Reducir anchos de columna para que todo quepa en una página
      ws["!cols"] = [
        { width: 5 }, // A - Reducido
        { width: 7 }, // B - Reducido
        { width: 7 }, // C - Reducido
        { width: 7 }, // D - Reducido
        { width: 8 }, // E - Reducido
        { width: 18 }, // F - Reducido
        { width: 8 }, // G - Reducido
        { width: 8 }, // H - Reducido
        { width: 8 }, // I - Reducido
        { width: 7 }, // J - Reducido
        { width: 5 }, // K - Reducido
        { width: 5 }, // L - Reducido
        { width: 5 }, // M - Reducido
      ];

      // Ajuste crítico: Reducir alturas de fila para que todo quepa en una página
      ws["!rows"] = Array(50).fill({ hpt: 15 }); // Altura predeterminada reducida
      ws["!rows"][0] = { hpt: 40 }; // Altura de encabezado reducida

      // Sección de fotos - altura calibrada reducida
      for (let i = 21; i < 26; i++) {
        ws["!rows"][i] = { hpt: 60 }; // Altura de filas de fotos reducida
      }

      // Hacer algunas filas más cortas para ahorrar espacio
      ws["!rows"][25] = { hpt: 12 }; // Fila de abreviaturas
      ws["!rows"][27] = { hpt: 12 }; // Encabezado de observaciones
      ws["!rows"][28] = { hpt: 12 }; // Texto de observaciones

      // 3. Add header with logo and title
      // Logo cell - we'll add the actual logo later as an image
      utils.sheet_add_aoa(ws, [[""]], { origin: "A1" });
      ws["A1"].s = {
        border: borderStyle,
      };

      // Title cells
      utils.sheet_add_aoa(
        ws,
        [["INFORME DE RESULTADO \n PERFIL ESTRATIGRÁFICO - APIQUE"]],
        { origin: "D1" }
      );
      ws["D1"].s = titleStyle;

      /* utils.sheet_add_aoa(ws, [[""]], {
        origin: "D2",
      })
      ws["D2"].s = titleStyle */

      // Reference number cell
      utils.sheet_add_aoa(
        ws,
        [
          [
            "Código Interno No. BAC-COL-AR-14\nTercera Rev. 01\nFecha: Marzo 2023",
          ],
        ],
        {
          origin: "K1",
        }
      );
      ws["K1"].s = {
        font: { sz: 8 }, // Fuente más pequeña
        alignment: { horizontal: "center", vertical: "center", wrapText: true },
        border: borderStyle,
      };

      // 4. Add client information section
      // Left column
      utils.sheet_add_aoa(ws, [["Informe No."]], { origin: "A4" });
      ws["A4"].s = labelStyle;

      utils.sheet_add_aoa(ws, [[data.informeNum || ""]], { origin: "B4" });
      ws["B4"].s = cellStyle;

      utils.sheet_add_aoa(ws, [["Cliente:"]], { origin: "A5" });
      ws["A5"].s = labelStyle;

      utils.sheet_add_aoa(
        ws,
        [[data.cliente || "MYRIAM STELLA PORRAS SIERRA"]],
        { origin: "B5" }
      );
      ws["B5"].s = cellStyle;

      utils.sheet_add_aoa(ws, [["Título de obra:"]], { origin: "A6" });
      ws["A6"].s = labelStyle;

      utils.sheet_add_aoa(ws, [[data.tituloObra || "Proyecto San Blas"]], {
        origin: "B6",
      });
      ws["B6"].s = cellStyle;

      utils.sheet_add_aoa(ws, [["Localización:"]], { origin: "A7" });
      ws["A7"].s = labelStyle;

      utils.sheet_add_aoa(ws, [[data.localizacion || "Rampa Vehicular"]], {
        origin: "B7",
      });
      ws["B7"].s = cellStyle;

      // Right column
      utils.sheet_add_aoa(ws, [["Albarán No."]], { origin: "H4" });
      ws["H4"].s = labelStyle;

      utils.sheet_add_aoa(ws, [[data.albaranNum || "SBOG1761-1"]], {
        origin: "K4",
      });
      ws["K4"].s = cellStyle;

      utils.sheet_add_aoa(ws, [["Fecha de ejecución\ninicio:\n(aaaa-mm-dd)"]], {
        origin: "H5",
      });
      ws["H5"].s = labelStyle;

      utils.sheet_add_aoa(ws, [[data.fechaEjecucionInicio || "2025-03-25"]], {
        origin: "K5",
      });
      ws["K5"].s = cellStyle;

      utils.sheet_add_aoa(ws, [["Fecha de ejecución final:\n(aaaa-mm-dd)"]], {
        origin: "H6",
      });
      ws["H6"].s = labelStyle;

      utils.sheet_add_aoa(ws, [[data.fechaEjecucionFinal || "2025-03-25"]], {
        origin: "K6",
      });
      ws["K6"].s = cellStyle;

      utils.sheet_add_aoa(ws, [["Fecha de emisión:"]], { origin: "H7" });
      ws["H7"].s = labelStyle;

      utils.sheet_add_aoa(ws, [[data.fechaEmision || "2025-04-07"]], {
        origin: "K7",
      });
      ws["K7"].s = cellStyle;

      // 5. Add three sections in the middle
      // Left: Nivel freático
      utils.sheet_add_aoa(ws, [["Nivel freático"]], { origin: "A9" });
      ws["A9"].s = sectionHeaderStyle;

      utils.sheet_add_aoa(ws, [["¿Existe?"]], { origin: "A10" });
      ws["A10"].s = tableHeaderStyle;

      utils.sheet_add_aoa(ws, [["No"]], { origin: "B10" });
      ws["B10"].s = cellStyle;

      utils.sheet_add_aoa(ws, [["Nivel (m):"]], { origin: "A11" });
      ws["A11"].s = tableHeaderStyle;

      utils.sheet_add_aoa(ws, [["Fecha\n(aaaa-mm-dd)"]], { origin: "B11" });
      ws["B11"].s = tableHeaderStyle;

      utils.sheet_add_aoa(ws, [["Hora\n(hh:mm)"]], { origin: "C11" });
      ws["C11"].s = tableHeaderStyle;

      utils.sheet_add_aoa(ws, [["N/A"]], { origin: "A12" });
      ws["A12"].s = cellStyle;

      utils.sheet_add_aoa(ws, [["N/A"]], { origin: "B12" });
      ws["B12"].s = cellStyle;

      utils.sheet_add_aoa(ws, [["N/A"]], { origin: "C12" });
      ws["C12"].s = cellStyle;

      // Center: Dimensiones apique
      utils.sheet_add_aoa(ws, [["Dimensiones apique"]], { origin: "E9" });
      ws["E9"].s = sectionHeaderStyle;

      utils.sheet_add_aoa(ws, [["Largo (m):"]], { origin: "E10" });
      ws["E10"].s = tableHeaderStyle;

      utils.sheet_add_aoa(ws, [[data.largoApique || "-"]], { origin: "F10" });
      ws["F10"].s = cellStyle;

      utils.sheet_add_aoa(ws, [["Ancho (m):"]], { origin: "E11" });
      ws["E11"].s = tableHeaderStyle;

      utils.sheet_add_aoa(ws, [[data.anchoApique || "-"]], { origin: "F11" });
      ws["F11"].s = cellStyle;

      utils.sheet_add_aoa(ws, [["Profundidad (m):"]], { origin: "E12" });
      ws["E12"].s = tableHeaderStyle;

      utils.sheet_add_aoa(ws, [[data.profundidadApique || "1,50"]], {
        origin: "F12",
      });
      ws["F12"].s = cellStyle;

      // Right: Identificación
      utils.sheet_add_aoa(ws, [["Identificación"]], { origin: "I9" });
      ws["I9"].s = sectionHeaderStyle;

      utils.sheet_add_aoa(ws, [["Apique No.:"]], { origin: "I10" });
      ws["I10"].s = tableHeaderStyle;

      utils.sheet_add_aoa(ws, [["1"]], { origin: "K10" });
      ws["K10"].s = cellStyle;

      utils.sheet_add_aoa(ws, [["Tipo:"]], { origin: "I11" });
      ws["I11"].s = tableHeaderStyle;

      utils.sheet_add_aoa(ws, [["Manual"]], { origin: "K11" });
      ws["K11"].s = cellStyle;

      utils.sheet_add_aoa(ws, [["Operario:"]], { origin: "I12" });
      ws["I12"].s = tableHeaderStyle;

      utils.sheet_add_aoa(ws, [[data.operario || "Carlos Díaz"]], {
        origin: "K12",
      });
      ws["K12"].s = cellStyle;

      // 6. Add soil profile table
      // Table headers
      utils.sheet_add_aoa(ws, [["Muestra"]], { origin: "A14" });
      ws["A14"].s = tableHeaderStyle;

      utils.sheet_add_aoa(ws, [["Profundidad (m)"]], { origin: "B14" });
      ws["B14"].s = tableHeaderStyle;

      utils.sheet_add_aoa(ws, [["Espesor estrato (m)"]], { origin: "D14" });
      ws["D14"].s = tableHeaderStyle;

      utils.sheet_add_aoa(ws, [["Estrato"]], { origin: "E14" });
      ws["E14"].s = tableHeaderStyle;

      utils.sheet_add_aoa(ws, [["Descripción del estrato"]], { origin: "F14" });
      ws["F14"].s = tableHeaderStyle;

      utils.sheet_add_aoa(ws, [["Resultados ensayos"]], { origin: "G14" });
      ws["G14"].s = tableHeaderStyle;

      utils.sheet_add_aoa(ws, [["Granulometría"]], { origin: "H14" });
      ws["H14"].s = tableHeaderStyle;

      utils.sheet_add_aoa(ws, [["U.S.C.S"]], { origin: "I14" });
      ws["I14"].s = tableHeaderStyle;

      utils.sheet_add_aoa(ws, [["Tipo de muestra"]], { origin: "J14" });
      ws["J14"].s = tableHeaderStyle;

      utils.sheet_add_aoa(ws, [["PDC"]], { origin: "K14" });
      ws["K14"].s = tableHeaderStyle;

      // Profundidad subheaders
      utils.sheet_add_aoa(ws, [["No."]], { origin: "A15" });
      ws["A15"].s = tableHeaderStyle;

      utils.sheet_add_aoa(ws, [["Inicio"]], { origin: "B15" });
      ws["B15"].s = tableHeaderStyle;

      utils.sheet_add_aoa(ws, [["Fin"]], { origin: "C15" });
      ws["C15"].s = tableHeaderStyle;

      // PDC subheaders
      utils.sheet_add_aoa(ws, [["LI (cm)"]], { origin: "K15" });
      ws["K15"].s = tableHeaderStyle;

      utils.sheet_add_aoa(ws, [["Lf (cm)"]], { origin: "L15" });
      ws["L15"].s = tableHeaderStyle;

      utils.sheet_add_aoa(ws, [["# GI"]], { origin: "M15" });
      ws["M15"].s = tableHeaderStyle;

      // Sample soil layers data (you should replace with actual data)
      const soilLayers = [
        {
          no: 1,
          inicio: "0,00",
          fin: "0,53",
          espesor: "0,53",
          descripcion:
            "Material arcilloso, color marrón oscuro con presencia de material reciclado de construcción, consistencia baja, humedad y plasticidad alta.",
          resultados: "-",
          granulometria: "-",
          uscs: "-",
          tipoMuestra: "Bolsa",
          li: "-",
          lf: "-",
          gi: "-",
          style: soilStyle1,
        },
        {
          no: 2,
          inicio: "0,53",
          fin: "1,10",
          espesor: "0,57",
          descripcion:
            "Material arcilloso, color marrón grisáceo con presencia de material reciclado de construcción, consistencia blanda, humedad y plasticidad alta.",
          resultados: "-",
          granulometria: "-",
          uscs: "-",
          tipoMuestra: "Bolsa",
          li: "-",
          lf: "-",
          gi: "-",
          style: soilStyle2,
        },
        {
          no: 3,
          inicio: "1,10",
          fin: "1,50",
          espesor: "0,40",
          descripcion:
            "Material Arcilloso color marrón parduzco con presencia de gravas.",
          resultados: "LL = 31%\nLP = 18%\nIP = 13%",
          granulometria: "Gravas = 39%\nArenas = 26,6%\nFinos = 34,2%",
          uscs: "GC : Grava arcillosa con arena",
          tipoMuestra: "Bolsa",
          li: "-",
          lf: "-",
          gi: "-",
          style: soilStyle3,
        },
      ];

      // Add soil layers
      soilLayers.forEach((layer, index) => {
        const rowNum = 16 + index;

        utils.sheet_add_aoa(ws, [[layer.no]], { origin: `A${rowNum}` });
        ws[`A${rowNum}`].s = cellStyle;

        utils.sheet_add_aoa(ws, [[layer.inicio]], { origin: `B${rowNum}` });
        ws[`B${rowNum}`].s = cellStyle;

        utils.sheet_add_aoa(ws, [[layer.fin]], { origin: `C${rowNum}` });
        ws[`C${rowNum}`].s = cellStyle;

        utils.sheet_add_aoa(ws, [[layer.espesor]], { origin: `D${rowNum}` });
        ws[`D${rowNum}`].s = cellStyle;

        // Empty cell with soil color
        utils.sheet_add_aoa(ws, [[""]], { origin: `E${rowNum}` });
        ws[`E${rowNum}`].s = layer.style;

        utils.sheet_add_aoa(ws, [[layer.descripcion]], {
          origin: `F${rowNum}`,
        });
        ws[`F${rowNum}`].s = {
          ...cellStyle,
          alignment: { horizontal: "left", vertical: "center", wrapText: true },
        };

        utils.sheet_add_aoa(ws, [[layer.resultados]], { origin: `G${rowNum}` });
        ws[`G${rowNum}`].s = cellStyle;

        utils.sheet_add_aoa(ws, [[layer.granulometria]], {
          origin: `H${rowNum}`,
        });
        ws[`H${rowNum}`].s = cellStyle;

        utils.sheet_add_aoa(ws, [[layer.uscs]], { origin: `I${rowNum}` });
        ws[`I${rowNum}`].s = cellStyle;

        utils.sheet_add_aoa(ws, [[layer.tipoMuestra]], {
          origin: `J${rowNum}`,
        });
        ws[`J${rowNum}`].s = cellStyle;

        utils.sheet_add_aoa(ws, [[layer.li]], { origin: `K${rowNum}` });
        ws[`K${rowNum}`].s = cellStyle;

        utils.sheet_add_aoa(ws, [[layer.lf]], { origin: `L${rowNum}` });
        ws[`L${rowNum}`].s = cellStyle;

        utils.sheet_add_aoa(ws, [[layer.gi]], { origin: `M${rowNum}` });
        ws[`M${rowNum}`].s = cellStyle;
      });

      // 7. Add photo section
      const photoRow = 20;
      utils.sheet_add_aoa(ws, [["Registro fotográfico"]], {
        origin: `A${photoRow}`,
      });
      ws[`A${photoRow}`].s = photoSectionStyle;

      // Photo placeholders - we'll add actual images later
      const photoColumns = ["A", "D", "G", "J", "M"];
      for (let i = 0; i < 5; i++) {
        const col = photoColumns[i];
        const endCol = i < 4 ? String.fromCharCode(col.charCodeAt(0) + 2) : col;

        // Add placeholder text (will be replaced with images if available)
        utils.sheet_add_aoa(ws, [[""]], {
          origin: `${col}${photoRow + 1}`,
        });
        ws[`${col}${photoRow + 1}`].s = {
          ...cellStyle,
          alignment: { horizontal: "center", vertical: "center" },
        };
      }

      // 8. Add abbreviations section
      const abbrRow = 26;
      utils.sheet_add_aoa(ws, [["Abreviaturas de resultados de ensayos:"]], {
        origin: `A${abbrRow}`,
      });
      ws[`A${abbrRow}`].s = labelStyle;

      const abbreviations =
        "W:Humedad - LL:Límite Líquido - LP:Límite Plástico - IP:Índice Plástico - γmax:Densidad Máxima - Wopt:Humedad Óptima - ICBR:Índice CBR - PDC:Penetrómetro Dinámico de Cono | CBR Ant:Antes de inmersión | CBR Dsp:Después de inmersión-H/S:Relación Húmedo / Seco CS:Carga Saturada";

      utils.sheet_add_aoa(ws, [[abbreviations]], { origin: `B${abbrRow}` });
      ws[`B${abbrRow}`].s = abbreviationsStyle;

      // 9. Add observations section
      const obsRow = 28;
      utils.sheet_add_aoa(ws, [["Observaciones"]], { origin: `A${obsRow}` });
      ws[`A${obsRow}`].s = photoSectionStyle;

      utils.sheet_add_aoa(
        ws,
        [["No se toma CBR Inalterado por las condiciones del material."]],
        {
          origin: `A${obsRow + 1}`,
        }
      );
      ws[`A${obsRow + 1}`].s = {
        ...cellStyle,
        alignment: { horizontal: "center", vertical: "center" },
      };

      // 10. Add signature section
      const signRow = 31;
      utils.sheet_add_aoa(ws, [["Revisó y aprobó"]], { origin: `D${signRow}` });
      ws[`D${signRow}`].s = photoSectionStyle;

      utils.sheet_add_aoa(ws, [["Firma:"]], { origin: `C${signRow + 1}` });
      ws[`C${signRow + 1}`].s = labelStyle;

      utils.sheet_add_aoa(ws, [[""]], { origin: `D${signRow + 1}` });
      ws[`D${signRow + 1}`].s = cellStyle;

      utils.sheet_add_aoa(ws, [["Nombres:"]], { origin: `C${signRow + 2}` });
      ws[`C${signRow + 2}`].s = labelStyle;

      utils.sheet_add_aoa(ws, [["Roniel Javib Pacheco Valderrama"]], {
        origin: `D${signRow + 2}`,
      });
      ws[`D${signRow + 2}`].s = cellStyle;

      utils.sheet_add_aoa(ws, [["Cargo:"]], { origin: `C${signRow + 3}` });
      ws[`C${signRow + 3}`].s = labelStyle;

      utils.sheet_add_aoa(ws, [["Coordinador Técnico"]], {
        origin: `D${signRow + 3}`,
      });
      ws[`D${signRow + 3}`].s = cellStyle;

      // 11. Define cell merges
      ws["!merges"] = [
        // Header
        { s: { r: 0, c: 0 }, e: { r: 2, c: 2 } }, // A1:C3 (Logo)
        { s: { r: 0, c: 3 }, e: { r: 1, c: 9 } },
        { s: { r: 0, c: 10 }, e: { r: 2, c: 12 } }, // K1:M3 (Reference)

        // Client info section
        { s: { r: 3, c: 0 }, e: { r: 3, c: 0 } }, // A4 (Informe No.)
        { s: { r: 3, c: 1 }, e: { r: 3, c: 6 } }, // B4:G4 (Informe value)
        { s: { r: 3, c: 7 }, e: { r: 3, c: 9 } }, // H4:J4 (Albarán No.)
        { s: { r: 3, c: 10 }, e: { r: 3, c: 12 } }, // K4:M4 (Albarán value)

        { s: { r: 4, c: 0 }, e: { r: 4, c: 0 } }, // A5 (Cliente)
        { s: { r: 4, c: 1 }, e: { r: 4, c: 6 } }, // B5:G5 (Cliente value)
        { s: { r: 4, c: 7 }, e: { r: 4, c: 9 } }, // H5:J5 (Fecha inicio)
        { s: { r: 4, c: 10 }, e: { r: 4, c: 12 } }, // K5:M5 (Fecha inicio value)

        { s: { r: 5, c: 0 }, e: { r: 5, c: 0 } }, // A6 (Título)
        { s: { r: 5, c: 1 }, e: { r: 5, c: 6 } }, // B6:G6 (Título value)
        { s: { r: 5, c: 7 }, e: { r: 5, c: 9 } }, // H6:J6 (Fecha final)
        { s: { r: 5, c: 10 }, e: { r: 5, c: 12 } }, // K6:M6 (Fecha final value)

        { s: { r: 6, c: 0 }, e: { r: 6, c: 0 } }, // A7 (Localización)
        { s: { r: 6, c: 1 }, e: { r: 6, c: 6 } }, // B7:G7 (Localización value)
        { s: { r: 6, c: 7 }, e: { r: 6, c: 9 } }, // H7:J7 (Fecha emisión)
        { s: { r: 6, c: 10 }, e: { r: 6, c: 12 } }, // K7:M7 (Fecha emisión value)

        // Middle sections
        { s: { r: 8, c: 0 }, e: { r: 8, c: 2 } }, // A9:C9 (Nivel freático)
        { s: { r: 8, c: 4 }, e: { r: 8, c: 5 } }, // E9:F9 (Dimensiones)
        { s: { r: 8, c: 8 }, e: { r: 8, c: 12 } }, // I9:M9 (Identificación)

        { s: { r: 9, c: 0 }, e: { r: 9, c: 0 } }, // A10 (¿Existe?)
        { s: { r: 9, c: 1 }, e: { r: 9, c: 2 } }, // B10:C10 (No)
        { s: { r: 9, c: 4 }, e: { r: 9, c: 4 } }, // E10 (Largo)
        { s: { r: 9, c: 5 }, e: { r: 9, c: 5 } }, // F10 (Largo value)
        { s: { r: 9, c: 8 }, e: { r: 9, c: 9 } }, // I10:J10 (Apique No.)
        { s: { r: 9, c: 10 }, e: { r: 9, c: 12 } }, // K10:M10 (Apique value)

        // Soil table headers
        { s: { r: 13, c: 0 }, e: { r: 14, c: 0 } }, // A14:A15 (Muestra)
        { s: { r: 13, c: 1 }, e: { r: 13, c: 2 } }, // B14:C14 (Profundidad)
        { s: { r: 13, c: 3 }, e: { r: 14, c: 3 } }, // D14:D15 (Espesor)
        { s: { r: 13, c: 4 }, e: { r: 14, c: 4 } }, // E14:E15 (Estrato)
        { s: { r: 13, c: 5 }, e: { r: 14, c: 5 } }, // F14:F15 (Descripción)
        { s: { r: 13, c: 6 }, e: { r: 14, c: 6 } }, // G14:G15 (Resultados)
        { s: { r: 13, c: 7 }, e: { r: 14, c: 7 } }, // H14:H15 (Granulometría)
        { s: { r: 13, c: 8 }, e: { r: 14, c: 8 } }, // I14:I15 (U.S.C.S)
        { s: { r: 13, c: 9 }, e: { r: 14, c: 9 } }, // J14:J15 (Tipo muestra)
        { s: { r: 13, c: 10 }, e: { r: 13, c: 12 } }, // K14:M14 (PDC)

        // Photo section
        { s: { r: 19, c: 0 }, e: { r: 19, c: 12 } }, // A20:M20 (Registro fotográfico header)
        { s: { r: 20, c: 0 }, e: { r: 20, c: 2 } }, // A21:C21 (Photo 1)
        { s: { r: 20, c: 3 }, e: { r: 20, c: 5 } }, // D21:F21 (Photo 2)
        { s: { r: 20, c: 6 }, e: { r: 20, c: 8 } }, // G21:I21 (Photo 3)
        { s: { r: 20, c: 9 }, e: { r: 20, c: 11 } }, // J21:L21 (Photo 4)
        { s: { r: 20, c: 12 }, e: { r: 20, c: 12 } }, // M21 (Photo 5)

        // Abbreviations section
        { s: { r: 25, c: 0 }, e: { r: 25, c: 0 } }, // A26 (Abreviaturas)
        { s: { r: 25, c: 1 }, e: { r: 25, c: 12 } }, // B26:M26 (Abbreviations text)

        // Observations section
        { s: { r: 27, c: 0 }, e: { r: 27, c: 12 } }, // A28:M28 (Observations header)
        { s: { r: 28, c: 0 }, e: { r: 28, c: 12 } }, // A29:M29 (Observations text)

        // Signature section
        { s: { r: 30, c: 3 }, e: { r: 30, c: 6 } }, // D31:G31 (Revisó y aprobó)
        { s: { r: 31, c: 2 }, e: { r: 31, c: 2 } }, // C32 (Firma)
        { s: { r: 31, c: 3 }, e: { r: 31, c: 6 } }, // D32:G32 (Firma value)
        { s: { r: 32, c: 2 }, e: { r: 32, c: 2 } }, // C33 (Nombres)
        { s: { r: 32, c: 3 }, e: { r: 32, c: 6 } }, // D33:G33 (Nombres value)
        { s: { r: 33, c: 2 }, e: { r: 33, c: 2 } }, // C34 (Cargo)
        { s: { r: 33, c: 3 }, e: { r: 33, c: 6 } }, // D34:G34 (Cargo value)
      ];

      // 12. AJUSTES CRÍTICOS para impresión en una sola página
      ws["!printOptions"] = {
        centerHorizontally: true, // Centrar horizontalmente
        centerVertically: true, // Centrar verticalmente
        gridLines: false, // No imprimir líneas de cuadrícula
        orientation: "landscape", // Orientación horizontal
      };

      // Márgenes muy pequeños para maximizar espacio
      ws["!margins"] = {
        left: 0.1,
        right: 0.1,
        top: 0.1,
        bottom: 0.1,
        header: 0,
        footer: 0,
      };

      // Configuración de página para ajustar a 1 página exactamente
      ws["!pageSetup"] = {
        orientation: "landscape", // Orientación horizontal
        paperSize: 9, // A4
        fitToWidth: 1, // Ajustar a 1 página de ancho
        fitToHeight: 1, // Ajustar a 1 página de alto
        scale: 65, // Escala reducida para asegurar que todo quepa
        horizontalDpi: 300, // Mayor DPI para mejor calidad
        verticalDpi: 300,
        printTitlesRow: "1:1", // Repetir primera fila como encabezado
        printTitlesColumn: "A:A", // Repetir primera columna como encabezado
        blackAndWhite: false, // Imprimir en color
      };

      // Definir área de impresión para incluir solo columnas A-M
      const lastRow = 35; // Ajustar según tu contenido
      ws["!print"] = {
        area: { s: { r: 0, c: 0 }, e: { r: lastRow, c: 12 } }, // A1:M35
      };

      // 13. Añadir el logo BAC como imagen
      // Definimos el logo como base64 directamente en el código
      const logoBase64 = "";

      // Para Excel, necesitamos agregar la imagen como un dibujo
      if (!wb.Drawings) wb.Drawings = {};

      // Crear un dibujo para el logo
      const drawing = {
        from: { col: 0, row: 0 }, // Celda A1
        to: { col: 2, row: 2 }, // Celda C3
        editAs: "oneCell",
        picture: {
          data: logoBase64.split(",")[1], // Eliminar el prefijo "data:image/png;base64,"
          format: "png",
          width: 120,
          height: 50,
        },
      };

      // Agregar el dibujo al libro de trabajo
      wb.Drawings["logo"] = drawing;

      // Vincular el dibujo a la hoja de trabajo
      if (!ws.drawings) ws.drawings = [];
      ws.drawings.push({ name: "logo" });

      // 14. Agregar fotos a la sección de fotos si están disponibles
      if (images && images.length > 0) {
        const photoColumns = ["A", "D", "G", "J", "M"];

        // Agregar hasta 5 fotos
        for (let i = 0; i < Math.min(images.length, 5); i++) {
          const col = photoColumns[i];
          const photoBase64 = images[i]; // Suponiendo que el array de imágenes contiene cadenas base64

          if (photoBase64) {
            // Asegurarse de que la imagen esté en formato base64 correcto
            let photoData = photoBase64;
            if (photoBase64.startsWith("data:")) {
              photoData = photoBase64.split(",")[1];
            }

            const photoDrawing = {
              from: { col: col.charCodeAt(0) - 65, row: 20 }, // Convertir letra de columna a índice
              to: { col: col.charCodeAt(0) - 65 + (i === 4 ? 0 : 2), row: 20 }, // Abarcar 3 columnas excepto para la última foto
              editAs: "oneCell",
              picture: {
                data: photoData,
                format: "png",
                width: i === 4 ? 50 : 100, // La última foto es más pequeña
                height: 60,
              },
            };

            // Agregar el dibujo al libro de trabajo
            wb.Drawings[`photo${i + 1}`] = photoDrawing;

            // Vincular el dibujo a la hoja de trabajo
            ws.drawings.push({ name: `photo${i + 1}` });
          }
        }
      }

      // 15. Agregar la hoja de trabajo al libro de trabajo
      utils.book_append_sheet(wb, ws, "Perfil");

      // 16. Generar y compartir el archivo según la plataforma
      if (Platform.OS === "web") {
        // Para web
        const wbout = writeFile(wb, "Perfil.xlsx", {
          bookType: "xlsx",
          type: "array",
          compression: true, // Habilitar compresión para un tamaño de archivo más pequeño
        });
        const blob = new Blob([wbout], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "Perfil.xlsx";
        a.click();

        URL.revokeObjectURL(url);
        if (onGenerate) onGenerate(true);
      } else {
        // Para móvil
        const wbout = writeFile(wb, "Perfil.xlsx", {
          type: "base64",
          compression: true, // Habilitar compresión para un tamaño de archivo más pequeño
        });
        const uri = FileSystem.cacheDirectory + "Perfil.xlsx";

        await FileSystem.writeAsStringAsync(uri, wbout, {
          encoding: FileSystem.EncodingType.Base64,
        });

        await Sharing.shareAsync(uri, {
          mimeType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          dialogTitle: "Compartir Perfil Estratigráfico",
          UTI: "com.microsoft.excel.xlsx",
        });
        if (onGenerate) onGenerate(true);
      }
    } catch (error) {
      console.error("Error en la generación de Excel:", error);
      Alert.alert("Error", "No se pudo generar el Excel: " + error.message);
      if (onGenerate) onGenerate(false);
    }
  };

  return <IconButton icon="file" onPress={generateExcel} iconColor="green" />;
};

export default ExcelApique;
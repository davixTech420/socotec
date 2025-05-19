import React from "react";
import { View, Button, Alert, Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { utils, writeFile } from "xlsx-js-style";
import * as base64 from "base-64"; // Make sure to install this package

// Import the logo image - adjust the path as needed
import logoPath from "@/assets/images/LogoFiles.png"; // Adjust this path to where your logo is stored

const ExcelApique = ({ data, onGenerate }) => {
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

      // Set column widths - precisely calibrated for single page
      ws['!cols'] = [
        { width: 6 }, { width: 8 }, { width: 8 }, { width: 8 }, 
        { width: 10 }, { width: 22 }, { width: 10 }, { width: 10 },
        { width: 10 }, { width: 8 }, { width: 6 }, { width: 6 },
        { width: 6 }
      ];

      // Set row heights - precisely calibrated for single page
      ws['!rows'] = Array(50).fill({ hpt: 18 }); // Default height for all rows
      ws['!rows'][0] = { hpt: 45 }; // Header row taller
      
      // Photo section rows - calibrated height
      for (let i = 21; i < 26; i++) {
        ws['!rows'][i] = { hpt: 70 }; // Photo rows height
      }
      
      // Make some rows shorter to save space
      ws['!rows'][25] = { hpt: 15 }; // Abbreviations row
      ws['!rows'][27] = { hpt: 15 }; // Observations header
      ws['!rows'][28] = { hpt: 15 }; // Observations text

      // 3. Add header with logo and title
      // Logo cell - add empty cell for now, we'll add the image later
      utils.sheet_add_aoa(ws, [[""]], { origin: "A1" });
      ws["A1"].s = {
        border: borderStyle,
      };

      // Title cells
      utils.sheet_add_aoa(ws, [["INFORME DE RESULTADO"]], { origin: "D1" });
      ws["D1"].s = titleStyle;
      
      utils.sheet_add_aoa(ws, [["PERFIL ESTRATIGRÁFICO - APIQUE"]], { origin: "D2" });
      ws["D2"].s = titleStyle;

      // Reference number cell
      utils.sheet_add_aoa(ws, [["Código Interno No. BAC-COL-AR-14\nTercera Rev. 01\nFecha: Marzo 2023"]], { origin: "K1" });
      ws["K1"].s = {
        font: { sz: 9 }, // Smaller font
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
      
      utils.sheet_add_aoa(ws, [[data.cliente || "MYRIAM STELLA PORRAS SIERRA"]], { origin: "B5" });
      ws["B5"].s = cellStyle;
      
      utils.sheet_add_aoa(ws, [["Título de obra:"]], { origin: "A6" });
      ws["A6"].s = labelStyle;
      
      utils.sheet_add_aoa(ws, [[data.tituloObra || "Proyecto San Blas"]], { origin: "B6" });
      ws["B6"].s = cellStyle;
      
      utils.sheet_add_aoa(ws, [["Localización:"]], { origin: "A7" });
      ws["A7"].s = labelStyle;
      
      utils.sheet_add_aoa(ws, [[data.localizacion || "Rampa Vehicular"]], { origin: "B7" });
      ws["B7"].s = cellStyle;

      // Right column
      utils.sheet_add_aoa(ws, [["Albarán No."]], { origin: "H4" });
      ws["H4"].s = labelStyle;
      
      utils.sheet_add_aoa(ws, [[data.albaranNum || "SBOG1761-1"]], { origin: "K4" });
      ws["K4"].s = cellStyle;
      
      utils.sheet_add_aoa(ws, [["Fecha de ejecución\ninicio:\n(aaaa-mm-dd)"]], { origin: "H5" });
      ws["H5"].s = labelStyle;
      
      utils.sheet_add_aoa(ws, [[data.fechaEjecucionInicio || "2025-03-25"]], { origin: "K5" });
      ws["K5"].s = cellStyle;
      
      utils.sheet_add_aoa(ws, [["Fecha de ejecución final:\n(aaaa-mm-dd)"]], { origin: "H6" });
      ws["H6"].s = labelStyle;
      
      utils.sheet_add_aoa(ws, [[data.fechaEjecucionFinal || "2025-03-25"]], { origin: "K6" });
      ws["K6"].s = cellStyle;
      
      utils.sheet_add_aoa(ws, [["Fecha de emisión:"]], { origin: "H7" });
      ws["H7"].s = labelStyle;
      
      utils.sheet_add_aoa(ws, [[data.fechaEmision || "2025-04-07"]], { origin: "K7" });
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
      
      utils.sheet_add_aoa(ws, [[data.profundidadApique || "1,50"]], { origin: "F12" });
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
      
      utils.sheet_add_aoa(ws, [[data.operario || "Carlos Díaz"]], { origin: "K12" });
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
          descripcion: "Material arcilloso, color marrón oscuro con presencia de material reciclado de construcción, consistencia baja, humedad y plasticidad alta.", 
          resultados: "-", 
          granulometria: "-", 
          uscs: "-", 
          tipoMuestra: "Bolsa", 
          li: "-", 
          lf: "-", 
          gi: "-",
          style: soilStyle1 
        },
        { 
          no: 2, 
          inicio: "0,53", 
          fin: "1,10", 
          espesor: "0,57", 
          descripcion: "Material arcilloso, color marrón grisáceo con presencia de material reciclado de construcción, consistencia blanda, humedad y plasticidad alta.", 
          resultados: "-", 
          granulometria: "-", 
          uscs: "-", 
          tipoMuestra: "Bolsa", 
          li: "-", 
          lf: "-", 
          gi: "-",
          style: soilStyle2 
        },
        { 
          no: 3, 
          inicio: "1,10", 
          fin: "1,50", 
          espesor: "0,40", 
          descripcion: "Material Arcilloso color marrón parduzco con presencia de gravas.", 
          resultados: "LL = 31%\nLP = 18%\nIP = 13%", 
          granulometria: "Gravas = 39%\nArenas = 26,6%\nFinos = 34,2%", 
          uscs: "GC : Grava arcillosa con arena", 
          tipoMuestra: "Bolsa", 
          li: "-", 
          lf: "-", 
          gi: "-",
          style: soilStyle3 
        }
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
        
        utils.sheet_add_aoa(ws, [[layer.descripcion]], { origin: `F${rowNum}` });
        ws[`F${rowNum}`].s = { ...cellStyle, alignment: { horizontal: "left", vertical: "center", wrapText: true } };
        
        utils.sheet_add_aoa(ws, [[layer.resultados]], { origin: `G${rowNum}` });
        ws[`G${rowNum}`].s = cellStyle;
        
        utils.sheet_add_aoa(ws, [[layer.granulometria]], { origin: `H${rowNum}` });
        ws[`H${rowNum}`].s = cellStyle;
        
        utils.sheet_add_aoa(ws, [[layer.uscs]], { origin: `I${rowNum}` });
        ws[`I${rowNum}`].s = cellStyle;
        
        utils.sheet_add_aoa(ws, [[layer.tipoMuestra]], { origin: `J${rowNum}` });
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
      utils.sheet_add_aoa(ws, [["Registro fotográfico"]], { origin: `A${photoRow}` });
      ws[`A${photoRow}`].s = photoSectionStyle;
      
      // Photo placeholders (in a real implementation, you would add actual images)
      for (let i = 0; i < 5; i++) {
        const col = String.fromCharCode(65 + i * 3); // A, D, G, J, M
        utils.sheet_add_aoa(ws, [["[Foto " + (i+1) + "]"]], { origin: `${col}${photoRow+1}` });
        ws[`${col}${photoRow+1}`].s = {
          ...cellStyle,
          alignment: { horizontal: "center", vertical: "center" },
        };
      }

      // 8. Add abbreviations section
      const abbrRow = 26;
      utils.sheet_add_aoa(ws, [["Abreviaturas de resultados de ensayos:"]], { origin: `A${abbrRow}` });
      ws[`A${abbrRow}`].s = labelStyle;
      
      const abbreviations = "W:Humedad - LL:Límite Líquido - LP:Límite Plástico - IP:Índice Plástico - γmax:Densidad Máxima - Wopt:Humedad Óptima - ICBR:Índice CBR - PDC:Penetrómetro Dinámico de Cono | CBR Ant:Antes de inmersión | CBR Dsp:Después de inmersión-H/S:Relación Húmedo / Seco CS:Carga Saturada";
      
      utils.sheet_add_aoa(ws, [[abbreviations]], { origin: `B${abbrRow}` });
      ws[`B${abbrRow}`].s = abbreviationsStyle;

      // 9. Add observations section
      const obsRow = 28;
      utils.sheet_add_aoa(ws, [["Observaciones"]], { origin: `A${obsRow}` });
      ws[`A${obsRow}`].s = photoSectionStyle;
      
      utils.sheet_add_aoa(ws, [["No se toma CBR Inalterado por las condiciones del material."]], { origin: `A${obsRow+1}` });
      ws[`A${obsRow+1}`].s = {
        ...cellStyle,
        alignment: { horizontal: "center", vertical: "center" },
      };

      // 10. Add signature section
      const signRow = 31;
      utils.sheet_add_aoa(ws, [["Revisó y aprobó"]], { origin: `D${signRow}` });
      ws[`D${signRow}`].s = photoSectionStyle;
      
      utils.sheet_add_aoa(ws, [["Firma:"]], { origin: `C${signRow+1}` });
      ws[`C${signRow+1}`].s = labelStyle;
      
      utils.sheet_add_aoa(ws, [[""]], { origin: `D${signRow+1}` });
      ws[`D${signRow+1}`].s = cellStyle;
      
      utils.sheet_add_aoa(ws, [["Nombres:"]], { origin: `C${signRow+2}` });
      ws[`C${signRow+2}`].s = labelStyle;
      
      utils.sheet_add_aoa(ws, [["Roniel Javib Pacheco Valderrama"]], { origin: `D${signRow+2}` });
      ws[`D${signRow+2}`].s = cellStyle;
      
      utils.sheet_add_aoa(ws, [["Cargo:"]], { origin: `C${signRow+3}` });
      ws[`C${signRow+3}`].s = labelStyle;
      
      utils.sheet_add_aoa(ws, [["Coordinador Técnico"]], { origin: `D${signRow+3}` });
      ws[`D${signRow+3}`].s = cellStyle;

      // 11. Define cell merges
      ws["!merges"] = [
        // Header
        { s: { r: 0, c: 0 }, e: { r: 2, c: 2 } }, // A1:C3 (Logo)
        { s: { r: 0, c: 3 }, e: { r: 0, c: 9 } }, // D1:J1 (Title 1)
        { s: { r: 1, c: 3 }, e: { r: 1, c: 9 } }, // D2:J2 (Title 2)
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

      // 12. Set print options to match exactly what's shown in the image
      ws['!printOptions'] = {
        centerHorizontally: false, // Don't center horizontally to match the image
        centerVertically: false, // Don't center vertically to match the image
        gridLines: false, // Don't print grid lines
      };
      
      // Set page margins (very small margins to maximize space)
      ws['!margins'] = {
        left: 0.1,
        right: 0.1,
        top: 0.1,
        bottom: 0.1,
        header: 0,
        footer: 0
      };
      
      // Set page setup for landscape and fit to 1 page
      ws['!pageSetup'] = {
        orientation: 'landscape',
        paperSize: 9, // A4
        fitToWidth: 1, // Fit to 1 page wide
        fitToHeight: 1, // Fit to 1 page tall
        scale: 100, // No scaling - let fitToWidth/fitToHeight handle it
        horizontalDpi: 300, // Higher DPI for better quality
        verticalDpi: 300
      };
      
      // Set print area to include only columns A-M (not the entire width)
      const lastRow = 35; // Adjust based on your content
      ws['!print'] = {
        area: { s: { r: 0, c: 0 }, e: { r: lastRow, c: 12 } } // A1:M35
      };

      // 13. Add the BAC logo as an image
      // For Excel, we need to add the image as a drawing
      if (!wb.Drawings) wb.Drawings = {};
      
      // In a real implementation, you would use the actual image path
      // This is a simplified example - you'll need to adjust based on your project structure
      
      // For web implementation
      if (Platform.OS === 'web') {
        // Create a drawing for the logo
        const drawing = {
          from: { col: 0, row: 0 }, // A1 cell
          to: { col: 2, row: 2 }, // C3 cell
          editAs: 'oneCell',
          picture: {
            // In a real implementation, you would use the actual image data
            // This is a placeholder - you'll need to replace with your actual logo
            data: 'YOUR_BASE64_ENCODED_LOGO_HERE', // Replace with actual base64 encoded logo
            format: 'png',
            width: 150,
            height: 60
          }
        };
        
        // Add the drawing to the workbook
        wb.Drawings['logo'] = drawing;
        
        // Link the drawing to the worksheet
        if (!ws.drawings) ws.drawings = [];
        ws.drawings.push({ name: 'logo' });
      }

      // 14. Add the worksheet to the workbook
      utils.book_append_sheet(wb, ws, "Perfil");

      // 15. Generate and share the file based on platform
      if (Platform.OS === 'web') {
        // For web
        const wbout = writeFile(wb, "Perfil.xlsx", { bookType: "xlsx", type: "array" });
        const blob = new Blob([wbout], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement("a");
        a.href = url;
        a.download = "Perfil.xlsx";
        a.click();
        
        URL.revokeObjectURL(url);
        if (onGenerate) onGenerate(true);
      } else {
        // For mobile
        const wbout = writeFile(wb, "Perfil.xlsx", { type: "base64" });
        const uri = FileSystem.cacheDirectory + "Perfil.xlsx";
        
        await FileSystem.writeAsStringAsync(uri, wbout, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        await Sharing.shareAsync(uri);
        if (onGenerate) onGenerate(true);
      }
    } catch (error) {
      console.error("Excel generation error:", error);
      Alert.alert("Error", "No se pudo generar el Excel: " + error.message);
      if (onGenerate) onGenerate(false);
    }
  };

  return (
    <Button 
      title="Generar Informe Excel" 
      onPress={generateExcel} 
      color="#4472C4"
    />
  );
};

export default ExcelApique;
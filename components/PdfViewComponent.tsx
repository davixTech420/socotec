import { Platform } from "react-native"
import RNPrint from "react-native-print"

export const generateAndViewPDF = async (data: any[]) => {
  if (Platform.OS === "web") {
    // Para web, generamos HTML y lo abrimos en una nueva ventana
    const htmlContent = generateHTMLContent(data)
    const newWindow = window.open()
    newWindow?.document.write(htmlContent)
    newWindow?.document.close()
    newWindow?.print()
  } else {
    // Para móviles, generamos un PDF y lo mostramos
    const htmlContent = generateHTMLContent(data)
    try {
      const results = await RNPrint.print({
        html: htmlContent,
      })
      console.log("Printing result: ", results)
    } catch (err) {
      console.error("Error al imprimir:", err)
    }
  }
}

const generateHTMLContent = (data: any[]) => {
  const tableRows = data
    .map(
      (row) => `
    <tr>
      ${Object.values(row)
        .map((cell) => `<td>${cell}</td>`)
        .join("")}
    </tr>
  `,
    )
    .join("")

  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid black; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>Datos del Informe</h1>
        <table>
          <thead>
            <tr>
              ${Object.keys(data[0])
                .map((key) => `<th>${key}</th>`)
                .join("")}
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
    </html>
  `
}


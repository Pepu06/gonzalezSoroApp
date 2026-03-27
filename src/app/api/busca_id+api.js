import { google } from "googleapis";

export async function obtenerSpreadsheetId(nombreDepartamento) {
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
    scopes: [
      "https://www.googleapis.com/auth/drive",
      "https://www.googleapis.com/auth/spreadsheets"
    ]
  });

  const drive = google.drive({ version: "v3", auth });

  const res = await drive.files.list({
    q: `
      mimeType='application/vnd.google-apps.spreadsheet'
      and name='${nombreDepartamento}'
      and trashed=false
    `,
    fields: "files(id, name)",
  });

  if (res.data.files.length === 0) {
    throw new Error("No se encontró el spreadsheet del departamento");
  }

  return res.data.files[0].id;
}

import { google } from "googleapis";

const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

const auth = new google.auth.JWT({
  email: credentials.client_email,
  key: credentials.private_key,
  scopes: [
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/gmail.send",
  ],
});

export const drive = google.drive({ version: "v3", auth });
export const sheets = google.sheets({ version: "v4", auth });
export const gmail = google.gmail({ version: "v1", auth });

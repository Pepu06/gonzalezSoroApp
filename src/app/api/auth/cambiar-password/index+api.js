import { google } from "googleapis";

export async function POST(request) {
    try {
        const { departamento, passwordActual, passwordNueva } = await request.json();

        if (!departamento || !passwordActual || !passwordNueva) {
            return Response.json(
                { error: "Faltan datos requeridos" },
                { status: 400 }
            );
        }

        if (passwordNueva.length < 6) {
            return Response.json(
                { error: "La nueva contraseña debe tener al menos 6 caracteres" },
                { status: 400 }
            );
        }

        if (!process.env.GOOGLE_SHEET_ID || !process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
            return Response.json(
                { error: "Configuración del servidor incompleta" },
                { status: 500 }
            );
        }

        let privateKey = process.env.GOOGLE_PRIVATE_KEY;
        if (privateKey.startsWith('"')) {
            privateKey = JSON.parse(privateKey);
        }
        privateKey = privateKey.replace(/\\n/g, "\n");

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: privateKey,
            },
            scopes: ["https://www.googleapis.com/auth/spreadsheets"],
        });

        const sheets = google.sheets({ version: "v4", auth });
        const spreadsheetId = process.env.GOOGLE_SHEET_ID;

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: "usuarios!A2:C",
        });

        const usuarios = response.data.values || [];

        const usuarioIndex = usuarios.findIndex(
            (row) => row && row[0] === departamento && row[1] === passwordActual
        );

        if (usuarioIndex === -1) {
            return Response.json(
                { error: "Contraseña actual incorrecta" },
                { status: 401 }
            );
        }

        const rowNumber = usuarioIndex + 2;
        await sheets.spreadsheets.values.update({
            spreadsheetId: spreadsheetId,
            range: `usuarios!B${rowNumber}`,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [[passwordNueva]],
            },
        });

        return Response.json({
            success: true,
            message: "Contraseña actualizada correctamente",
        });
    } catch (error) {
        console.error("Error al cambiar contraseña:", error);
        return Response.json(
            { error: "Error al cambiar contraseña" },
            { status: 500 }
        );
    }
}
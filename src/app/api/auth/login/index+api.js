import { google } from "googleapis";

export async function POST(request) {
    try {
        const { password } = await request.json();

        if (!password) {
            return Response.json(
                { error: "Contraseña requerida" },
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

        // Leer usuarios (Departamento, Contraseña, Rol)
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: "usuarios!A2:C",
        });

        const usuarios = response.data.values || [];

        if (usuarios.length === 0) {
            return Response.json(
                { error: "No hay usuarios registrados" },
                { status: 401 }
            );
        }

        // Buscar usuario por contraseña (columna B)
        const usuario = usuarios.find((row) => row && row[1] === password);

        if (!usuario) {
            return Response.json(
                { error: "Contraseña incorrecta" },
                { status: 401 }
            );
        }

        return Response.json({
            success: true,
            departamento: usuario[0], // Columna A
            rol: usuario[2] || "user", // Columna C (default: user)
        });
    } catch (error) {
        console.error("Error en login:", error);
        return Response.json(
            { error: "Error al iniciar sesión" },
            { status: 500 }
        );
    }
}
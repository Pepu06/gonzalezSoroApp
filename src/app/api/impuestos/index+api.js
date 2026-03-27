import { obtenerSpreadsheetId } from "../busca_id+api";
import { sheets } from "../lib/google+api";
import { enviarMail } from "../lib/mailer+api";

const ROOT_FOLDER_ID = "1Sa9TRwwCzVv2bqS21AQV79yBavsyPJ-s";

const MESES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const IMPUESTOS = ["EDESUR", "AYSA", "METROGAS", "ABL", "EXPENSAS", "TELECOM", "AYSAUC", "ABLUC", "MUNICIPAL", "ARBA"];

export const maxDuration = 60;

// cada año ocupa 15 filas
const FILA_INICIAL_POR_ANIO = {
    2025: 5,
    2026: 20,
    2027: 35,
    2028: 50,
    2029: 65,
    2030: 80,
};

function obtenerAnioDelImpuesto(mesSeleccionado) {
    const ahora = new Date();
    const anioActual = ahora.getFullYear();
    const mesActual = ahora.getMonth(); // 0 = enero

    const indiceMes = MESES.indexOf(mesSeleccionado);
    if (indiceMes === -1) return null;

    return indiceMes > mesActual ? anioActual - 1 : anioActual;
}

function obtenerFila(anio, mes) {
    const filaBase = FILA_INICIAL_POR_ANIO[anio];
    if (!filaBase) return null;

    const indiceMes = MESES.indexOf(mes);
    if (indiceMes === -1) return null;

    return filaBase + indiceMes;
}

function parsearImporte(valor) {
    if (!valor) return 0;
    return parseFloat(valor.toString().replace(/[$\s.]/g, '').replace(',', '.')) || 0;
}

export async function GET(req) {
    try {
        const url = new URL(req.url);
        const departamento = url.searchParams.get("departamento");

        if (!departamento) {
            return Response.json({ error: "Departamento requerido" }, { status: 400 });
        }

        const spreadsheetId = await obtenerSpreadsheetId(departamento);
        if (!spreadsheetId) {
            return Response.json({ error: "Spreadsheet no encontrado" }, { status: 404 });
        }

        const ahora = new Date();
        const anioActual = ahora.getFullYear();
        const mesActualIndex = ahora.getMonth() + 1; // 1-12

        // Fila del mes actual en la sección 2026 (fila 30 = Enero, 31 = Febrero, etc.)
        const filaMesActual = 29 + mesActualIndex;

        // ── Leer total anual desde RESUMEN!L3 para 2026, L4 para 2027, etc. ─
        const responseTotalAnio = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `RESUMEN!L${anioActual - 2025 + 2}`,
        });
        const totalAnio = parsearImporte(responseTotalAnio.data.values?.[0]?.[0]);

        // ── Leer total del mes actual ─────────────────────────────────────────
        const responseTotalMes = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `RESUMEN!L${filaMesActual}`,
        });
        const totalMesActual = parsearImporte(responseTotalMes.data.values?.[0]?.[0]);

        // ── Leer historial de todos los meses del año (filas 29-40) ──────────
        const responseHistorial = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `RESUMEN!A29:L40`,
        });
        const filasHistorial = responseHistorial.data.values || [];

        // Mismo formato que antes: array de { impuesto, mes, importe, anio }
        const registros = [];
        filasHistorial.forEach((fila, index) => {
            const mes = MESES[index];
            IMPUESTOS.forEach((impuesto, impuestoIndex) => {
                const importe = parsearImporte(fila[impuestoIndex + 1]);
                if (importe > 0) {
                    registros.push({ impuesto, mes, importe, anio: anioActual });
                }
            });
        });

        // Mismo formato que antes: array de { nombre, total }
        const porImpuesto = IMPUESTOS.map((impuesto, index) => {
            const total = filasHistorial.reduce((sum, fila) => {
                return sum + parsearImporte(fila[index + 1]);
            }, 0);
            return { nombre: impuesto, total };
        }).filter(i => i.total > 0);

        return Response.json({
            ok: true,
            departamento,
            registros,
            stats: {
                totalMesActual,
                totalAnio,
                porImpuesto,
                cantidadRegistros: registros.length,
            },
        });

    } catch (err) {
        console.error("Error en GET /api/impuestos:", err);
        return Response.json(
            { error: "Error interno", details: err.message, stack: err.stack },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        const formData = await req.formData();

        const departamento = formData.get("departamento");
        const impuesto = formData.get("impuesto"); // nombre de la hoja
        const mes = formData.get("mes");
        const importeRaw = formData.get("importe");
        const importe = parseFloat(importeRaw.replace(',', '.'));
        const comprobante = formData.get("comprobante");

        const spreadsheetId = await obtenerSpreadsheetId(departamento);

        const anioImpuesto = obtenerAnioDelImpuesto(mes);
        const fila = obtenerFila(anioImpuesto, mes);

        if (!spreadsheetId || !impuesto || !fila) {
            return Response.json(
                { error: "Datos inválidos", debug: { spreadsheetId, impuesto, anioImpuesto, fila } },
                { status: 400 }
            );
        }

        // 👉 escribimos en la hoja del impuesto
        const rango = `'${impuesto}'C${fila}`;

        await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `'${impuesto}'!C${fila}`,
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [[importe]],
            },
        });

        let n8nResult = null;

        if (comprobante) {
            console.log("Enviando comprobante a n8n...");
            const n8nFormData = new FormData();
            n8nFormData.append("departamento", departamento);
            n8nFormData.append("impuesto", impuesto);
            n8nFormData.append("mes", mes);
            n8nFormData.append("importe", importe);
            n8nFormData.append("data0", comprobante);

            // URL DE PRODUCCIÓN (sin el -test)
            const n8nResponse = await fetch('https://primary-production-96028.up.railway.app/webhook/cargar-impuesto', {
                method: 'POST',
                body: n8nFormData,
            });

            if (!n8nResponse.ok) {
                const errorText = await n8nResponse.text();
                throw new Error(`n8n error: ${n8nResponse.status} - ${errorText}`);
            }

            n8nResult = await n8nResponse.json();
            console.log("Confirmación de n8n:", n8nResult);
        }

        await enviarMail({
            to: "mvcalvar@gmail.com",
            subject: `📎 Impuesto actualizado – ${departamento} / ${impuesto}`,
            html: `
                <h2>Impuesto actualizado en el spreadsheet</h2>
                <p><strong>Departamento:</strong> ${departamento}</p>
                <p><strong>Impuesto:</strong> ${impuesto}</p>
                <p><strong>Mes:</strong> ${mes}</p>
                <p><strong>Monto:</strong> $${importe}</p>
            `,
        });

        return Response.json({ ok: true, rango, n8n: n8nResult });
    } catch (err) {
        console.error(err);
        return Response.json(
            { error: "Error interno", details: err.message },
            { status: 500 }
        );
    }
}
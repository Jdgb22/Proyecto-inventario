import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";

const publicDir = path.join(process.cwd(), "public");
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Plantilla Inventario
const wsInv = XLSX.utils.aoa_to_sheet([
  ["Codigo", "Nombre", "Cantidad", "Precio", "Categoria"],
  ["PROD-001", "Gaseosa 500ml", 50, 1500, "Bebidas"]
]);
const wbInv = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wbInv, wsInv, "Inventario");
XLSX.writeFile(wbInv, path.join(publicDir, "plantilla_inventario.xlsx"));

// 2. Plantilla Trabajadores
const wsWork = XLSX.utils.aoa_to_sheet([
  ["Nombre", "Documento", "Cargo", "Horas Trabajadas", "Horas Extras", "Deuda"],
  ["Ejemplo Nombre", "123456", "Cajero", 80, 0, 0]
]);
const wbWork = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wbWork, wsWork, "Plantilla");
XLSX.writeFile(wbWork, path.join(publicDir, "plantilla_trabajadores.xlsx"));

console.log("Plantillas creadas exitosamente en public/");

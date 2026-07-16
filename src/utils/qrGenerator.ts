// src/utils/qrGenerator.ts

/**
 * Genera un código QR único para un lote de producción
 * Formato: PLT-YYYYMMDD-XXXX
 * Ejemplo: PLT-20240715-A3F9
 */
export function generateLotCode(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  // Generar 4 caracteres aleatorios (mayúsculas + números)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let random = '';
  for (let i = 0; i < 4; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return `PLT-${year}${month}${day}-${random}`;
}

/**
 * Genera un código QR con timestamp para mayor unicidad
 * Formato: PLT-{timestamp}-{random}
 */
export function generateLotCodeWithTimestamp(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let random = '';
  for (let i = 0; i < 4; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `PLT-${timestamp}-${random}`;
}

/**
 * Genera un código QR con prefijo personalizado
 */
export function generateLotCodeWithPrefix(prefix: string = 'PLT'): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let random = '';
  for (let i = 0; i < 6; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Valida si un código QR tiene el formato correcto
 */
export function isValidLotCode(code: string): boolean {
  if (!code) return false;
  
  // Formato: PLT-YYYYMMDD-XXXX (4 caracteres aleatorios)
  const pattern1 = /^PLT-\d{8}-[A-Z0-9]{4}$/;
  
  // Formato: PLT-{timestamp}-{random} (timestamp en base36)
  const pattern2 = /^PLT-[A-Z0-9]+-[A-Z0-9]{4,6}$/;
  
  // Formato: {prefix}-{timestamp}-{random} (con prefijo personalizado)
  const pattern3 = /^[A-Z]{3,4}-[A-Z0-9]+-[A-Z0-9]{4,6}$/;
  
  return pattern1.test(code) || pattern2.test(code) || pattern3.test(code);
}

/**
 * Extrae información del código QR
 */
export function parseLotCode(code: string): {
  prefix: string;
  timestamp: string;
  random: string;
  date?: Date;
} | null {
  if (!isValidLotCode(code)) return null;
  
  const parts = code.split('-');
  if (parts.length !== 3) return null;
  
  const [prefix, timestamp, random] = parts;
  
  // Intentar parsear fecha si es formato PLT-YYYYMMDD-XXXX
  let date: Date | undefined;
  if (timestamp.length === 8 && /^\d{8}$/.test(timestamp)) {
    const year = parseInt(timestamp.substring(0, 4));
    const month = parseInt(timestamp.substring(4, 6)) - 1;
    const day = parseInt(timestamp.substring(6, 8));
    date = new Date(year, month, day);
  }
  
  return { prefix, timestamp, random, date };
}

/**
 * Genera múltiples códigos QR (para lotes)
 */
export function generateMultipleLotCodes(count: number, prefix: string = 'PLT'): string[] {
  const codes: string[] = [];
  const used = new Set<string>();
  
  for (let i = 0; i < count; i++) {
    let code: string;
    let attempts = 0;
    do {
      code = generateLotCodeWithPrefix(prefix);
      attempts++;
    } while (used.has(code) && attempts < 10);
    used.add(code);
    codes.push(code);
  }
  
  return codes;
}
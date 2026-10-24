/**
 * Pure SVG & Canvas EAN-13 / GS1 Universal Barcode Generator
 * 
 * Standards:
 * - GS1 General Specifications (EAN-13 / GTIN-13)
 * - ISO/IEC 15420: Information technology - Automatic identification and data capture techniques - EAN/UPC bar code symbology specification
 * - Zero external binary dependencies, zero npm bloat, vector-perfect SVG & high-res PNG export.
 */

// EAN-13 L-code and G-code (Left side digits) and R-code (Right side digits)
// 1 = bar, 0 = space (each character is 7 modules wide)
const L_CODES: string[] = [
  "0001101", // 0
  "0011001", // 1
  "0010011", // 2
  "0111101", // 3
  "0100011", // 4
  "0110001", // 5
  "0101111", // 6
  "0111011", // 7
  "0110111", // 8
  "0001011", // 9
];

const G_CODES: string[] = [
  "0100111", // 0
  "0110011", // 1
  "0011011", // 2
  "0100001", // 3
  "0011101", // 4
  "0111001", // 5
  "0000101", // 6
  "0010001", // 7
  "0001001", // 8
  "0010111", // 9
];

const R_CODES: string[] = [
  "1110010", // 0
  "1100110", // 1
  "1101100", // 2
  "1000010", // 3
  "1011100", // 4
  "1001110", // 5
  "1010000", // 6
  "1000100", // 7
  "1001000", // 8
  "1110100", // 9
];

// Left-hand encoding structure based on the first digit (0-9)
// L = L-code, G = G-code
const PARITY_MAP: string[] = [
  "LLLLLL", // 0
  "LLGLGG", // 1
  "LLGGLG", // 2
  "LLGGGL", // 3
  "LGLLGG", // 4
  "LGGLLG", // 5
  "LGGGLL", // 6
  "LGLGLG", // 7
  "LGLGGL", // 8
  "LGGLGL", // 9
];

/**
 * Calculates the GS1 standard check digit for a 12-digit string
 */
export function calculateEAN13CheckDigit(twelveDigits: string): number {
  if (twelveDigits.length < 12) {
    throw new Error("Must provide at least 12 digits to compute EAN-13 check digit");
  }
  const clean = twelveDigits.replace(/\D/g, "").slice(0, 12);
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(clean[i], 10);
    // Even indices (0-based) get weight 1, odd indices get weight 3
    sum += i % 2 === 0 ? digit * 1 : digit * 3;
  }
  const remainder = sum % 10;
  return remainder === 0 ? 0 : 10 - remainder;
}

/**
 * Validates whether a 13-digit string has a mathematically valid GS1 check digit
 */
export function validateEAN13(ean: string): boolean {
  const clean = ean.replace(/\D/g, "");
  if (clean.length !== 13) return false;
  const expectedCheck = calculateEAN13CheckDigit(clean.slice(0, 12));
  return parseInt(clean[12], 10) === expectedCheck;
}

/**
 * Formats any input (12 or 13 digits) into a guaranteed valid 13-digit EAN-13
 */
export function formatToValidEAN13(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (!digits) return "0602500000018"; // Kharis default
  const base12 = digits.padEnd(12, "0").slice(0, 12);
  const check = calculateEAN13CheckDigit(base12);
  return `${base12}${check}`;
}

export interface BarcodeRenderOptions {
  barColor?: string;
  backgroundColor?: string;
  scale?: number; // width multiplier
  height?: number;
  includeText?: boolean;
  fontSize?: number;
}

export interface BarcodeModule {
  x: number;
  width: number;
  height: number;
  isGuard: boolean;
}

/**
 * Generates the raw module layout for an EAN-13 barcode
 */
export function generateEAN13Modules(ean13: string, options: BarcodeRenderOptions = {}) {
  const validEan = formatToValidEAN13(ean13);
  const {
    height = 90,
    includeText = true,
  } = options;

  const firstDigit = parseInt(validEan[0], 10);
  const leftDigits = validEan.slice(1, 7);
  const rightDigits = validEan.slice(7, 13);
  const parities = PARITY_MAP[firstDigit];

  // Modules array: 0 for white space, 1 for black bar
  // Structure:
  // Quiet zone: 9 modules
  // Normal Guard: 3 modules (101)
  // Left 6 digits: 6 * 7 = 42 modules
  // Center Guard: 5 modules (01010)
  // Right 6 digits: 6 * 7 = 42 modules
  // Normal Guard: 3 modules (101)
  // Quiet zone: 9 modules
  // Total = 9 + 3 + 42 + 5 + 42 + 3 + 9 = 113 modules

  const modules: { bit: number; isGuard: boolean }[] = [];

  // Left Quiet Zone (9 modules)
  for (let i = 0; i < 9; i++) modules.push({ bit: 0, isGuard: false });

  // Start Guard (101)
  modules.push({ bit: 1, isGuard: true });
  modules.push({ bit: 0, isGuard: true });
  modules.push({ bit: 1, isGuard: true });

  // Left 6 digits
  for (let i = 0; i < 6; i++) {
    const digit = parseInt(leftDigits[i], 10);
    const parity = parities[i];
    const pattern = parity === "L" ? L_CODES[digit] : G_CODES[digit];
    for (let c = 0; c < 7; c++) {
      modules.push({ bit: parseInt(pattern[c], 10), isGuard: false });
    }
  }

  // Center Guard (01010)
  modules.push({ bit: 0, isGuard: true });
  modules.push({ bit: 1, isGuard: true });
  modules.push({ bit: 0, isGuard: true });
  modules.push({ bit: 1, isGuard: true });
  modules.push({ bit: 0, isGuard: true });

  // Right 6 digits
  for (let i = 0; i < 6; i++) {
    const digit = parseInt(rightDigits[i], 10);
    const pattern = R_CODES[digit];
    for (let c = 0; c < 7; c++) {
      modules.push({ bit: parseInt(pattern[c], 10), isGuard: false });
    }
  }

  // Stop Guard (101)
  modules.push({ bit: 1, isGuard: true });
  modules.push({ bit: 0, isGuard: true });
  modules.push({ bit: 1, isGuard: true });

  // Right Quiet Zone (9 modules)
  for (let i = 0; i < 9; i++) modules.push({ bit: 0, isGuard: false });

  return {
    ean13: validEan,
    modules,
    totalModules: modules.length,
    nominalHeight: height,
    guardExtraHeight: includeText ? 10 : 0,
  };
}

/**
 * Builds a vector-perfect SVG string for the EAN-13 barcode
 */
export function generateEAN13Svg(ean13: string, options: BarcodeRenderOptions = {}): string {
  const {
    barColor = "#000000",
    backgroundColor = "transparent",
    scale = 2.5,
    height = 90,
    includeText = true,
    fontSize = 15,
  } = options;

  const { modules, totalModules, guardExtraHeight } = generateEAN13Modules(ean13, { height, includeText });
  const validEan = formatToValidEAN13(ean13);

  const totalWidth = totalModules * scale;
  const barBaseHeight = height;
  const totalHeight = includeText ? barBaseHeight + 28 : barBaseHeight;

  // Build rects
  let rects = "";
  for (let i = 0; i < modules.length; i++) {
    const mod = modules[i];
    if (mod.bit === 1) {
      const h = mod.isGuard ? barBaseHeight + guardExtraHeight : barBaseHeight;
      const x = i * scale;
      rects += `<rect x="${x.toFixed(2)}" y="0" width="${scale.toFixed(2)}" height="${h.toFixed(2)}" fill="${barColor}" />`;
    }
  }

  // Human-Readable Digits Text
  let textElements = "";
  if (includeText) {
    const firstDigit = validEan[0];
    const leftChunk = validEan.slice(1, 7);
    const rightChunk = validEan.slice(7, 13);

    const textY = barBaseHeight + 18;

    // First digit in the left quiet zone
    textElements += `<text x="${(4 * scale).toFixed(2)}" y="${textY}" font-family="monospace, monospace" font-size="${fontSize}" font-weight="600" fill="${barColor}" text-anchor="middle">${firstDigit}</text>`;

    // Left chunk between start guard and center guard
    // Start guard ends at module 12; Left chunk ends at module 54 (center: module 33)
    textElements += `<text x="${(33 * scale).toFixed(2)}" y="${textY}" font-family="monospace, monospace" font-size="${fontSize}" font-weight="600" fill="${barColor}" text-anchor="middle" letter-spacing="1">${leftChunk}</text>`;

    // Right chunk between center guard and end guard
    // Center guard ends at module 59; Right chunk ends at module 101 (center: module 80)
    textElements += `<text x="${(80 * scale).toFixed(2)}" y="${textY}" font-family="monospace, monospace" font-size="${fontSize}" font-weight="600" fill="${barColor}" text-anchor="middle" letter-spacing="1">${rightChunk}</text>`;

    // GS1 > terminator chevron in right quiet zone
    textElements += `<text x="${(108 * scale).toFixed(2)}" y="${textY}" font-family="monospace, monospace" font-size="${fontSize - 2}" font-weight="600" fill="${barColor}" text-anchor="middle">&gt;</text>`;
  }

  const bgRect = backgroundColor && backgroundColor !== "transparent"
    ? `<rect width="${totalWidth.toFixed(2)}" height="${totalHeight.toFixed(2)}" fill="${backgroundColor}" />`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth.toFixed(2)} ${totalHeight.toFixed(2)}" width="${totalWidth}" height="${totalHeight}">
  ${bgRect}
  ${rects}
  ${textElements}
</svg>`;
}

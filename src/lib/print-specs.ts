export type PrintMethod = "digital" | "offset" | "flexo" | "thermal" | "screen" | "inkjet";
export type Substrate = "paper" | "coated_paper" | "label_stock" | "polybag" | "woven_pp" | "foil" | "metallized" | "plastic_film" | "shrink_film" | "rubber" | "carton";

export interface BarcodePrintSpec {
  method: PrintMethod;
  substrate: Substrate;
  ean13: {
    xDimensionMm: number;
    heightMm: number;
    magnification: number;
    quietZoneMm: number;
    minContrast: number;
    recommendedDpi: number;
    notes: string[];
  };
  qr: {
    moduleSizeMm: number;
    sizeMm: number;
    quietZoneModules: number;
    errorCorrection: "L" | "M" | "Q" | "H";
    logoMaxPercent: number;
    minContrast: number;
    recommendedDpi: number;
    notes: string[];
  };
}

export const PRINT_SPECS: Record<PrintMethod, Record<Substrate, BarcodePrintSpec>> = {
  digital: {
    paper: {
      method: "digital",
      substrate: "paper",
      ean13: { xDimensionMm: 0.33, heightMm: 22.85, magnification: 100, quietZoneMm: 3.0, minContrast: 80, recommendedDpi: 300, notes: ["Standard retail quality achievable"] },
      qr: { moduleSizeMm: 0.3, sizeMm: 12, quietZoneModules: 4, errorCorrection: "Q", logoMaxPercent: 30, minContrast: 80, recommendedDpi: 300, notes: ["Good for consumer scanning"] },
    },
    coated_paper: {
      method: "digital",
      substrate: "coated_paper",
      ean13: { xDimensionMm: 0.33, heightMm: 22.85, magnification: 100, quietZoneMm: 3.0, minContrast: 85, recommendedDpi: 300, notes: ["Sharp definition with coated stock"] },
      qr: { moduleSizeMm: 0.25, sizeMm: 10, quietZoneModules: 4, errorCorrection: "Q", logoMaxPercent: 25, minContrast: 85, recommendedDpi: 300, notes: ["Excellent scannability"] },
    },
    label_stock: {
      method: "digital",
      substrate: "label_stock",
      ean13: { xDimensionMm: 0.33, heightMm: 22.85, magnification: 100, quietZoneMm: 3.0, minContrast: 85, recommendedDpi: 300, notes: ["Use matte or semi-gloss for best results"] },
      qr: { moduleSizeMm: 0.25, sizeMm: 10, quietZoneModules: 4, errorCorrection: "Q", logoMaxPercent: 25, minContrast: 85, recommendedDpi: 300, notes: ["Works well with phone cameras"] },
    },
    polybag: { method: "digital", substrate: "polybag", ean13: { xDimensionMm: 0.38, heightMm: 25.0, magnification: 115, quietZoneMm: 3.5, minContrast: 90, recommendedDpi: 400, notes: ["Increase size due to substrate texture"] }, qr: { moduleSizeMm: 0.4, sizeMm: 14, quietZoneModules: 6, errorCorrection: "H", logoMaxPercent: 20, minContrast: 90, recommendedDpi: 400, notes: ["Avoid logo if glossy"] } },
    woven_pp: { method: "digital", substrate: "woven_pp", ean13: { xDimensionMm: 0.45, heightMm: 28.0, magnification: 136, quietZoneMm: 4.0, minContrast: 90, recommendedDpi: 400, notes: ["Textured surface requires larger bars"] }, qr: { moduleSizeMm: 0.5, sizeMm: 18, quietZoneModules: 8, errorCorrection: "H", logoMaxPercent: 15, minContrast: 90, recommendedDpi: 400, notes: ["Larger size critical"] } },
    foil: { method: "digital", substrate: "foil", ean13: { xDimensionMm: 0.4, heightMm: 26.0, magnification: 121, quietZoneMm: 4.0, minContrast: 95, recommendedDpi: 400, notes: ["Use high contrast ink, avoid reflection"] }, qr: { moduleSizeMm: 0.45, sizeMm: 16, quietZoneModules: 8, errorCorrection: "H", logoMaxPercent: 15, minContrast: 95, recommendedDpi: 400, notes: ["Matte overlaminate recommended"] } },
    metallized: { method: "digital", substrate: "metallized", ean13: { xDimensionMm: 0.4, heightMm: 26.0, magnification: 121, quietZoneMm: 4.0, minContrast: 95, recommendedDpi: 400, notes: ["Consider reverse printing"] }, qr: { moduleSizeMm: 0.45, sizeMm: 16, quietZoneModules: 8, errorCorrection: "H", logoMaxPercent: 15, minContrast: 95, recommendedDpi: 400, notes: ["Test with actual scanner"] } },
    plastic_film: { method: "digital", substrate: "plastic_film", ean13: { xDimensionMm: 0.38, heightMm: 25.0, magnification: 115, quietZoneMm: 3.5, minContrast: 90, recommendedDpi: 400, notes: ["Account for stretch/distortion"] }, qr: { moduleSizeMm: 0.4, sizeMm: 14, quietZoneModules: 6, errorCorrection: "H", logoMaxPercent: 20, minContrast: 90, recommendedDpi: 400, notes: ["Use distortion compensation"] } },
    shrink_film: { method: "digital", substrate: "shrink_film", ean13: { xDimensionMm: 0.42, heightMm: 27.0, magnification: 127, quietZoneMm: 4.0, minContrast: 90, recommendedDpi: 400, notes: ["Apply pre-shrink sizing"] }, qr: { moduleSizeMm: 0.45, sizeMm: 16, quietZoneModules: 8, errorCorrection: "H", logoMaxPercent: 15, minContrast: 90, recommendedDpi: 400, notes: ["Test post-shrink"] } },
    rubber: { method: "digital", substrate: "rubber", ean13: { xDimensionMm: 0.5, heightMm: 30.0, magnification: 152, quietZoneMm: 4.5, minContrast: 95, recommendedDpi: 450, notes: ["Difficult for 1D, prefer QR if possible"] }, qr: { moduleSizeMm: 0.6, sizeMm: 22, quietZoneModules: 10, errorCorrection: "H", logoMaxPercent: 10, minContrast: 95, recommendedDpi: 450, notes: ["Use larger modules"] } },
    carton: { method: "digital", substrate: "carton", ean13: { xDimensionMm: 0.33, heightMm: 22.85, magnification: 100, quietZoneMm: 3.0, minContrast: 80, recommendedDpi: 300, notes: ["Standard case labeling"] }, qr: { moduleSizeMm: 0.3, sizeMm: 12, quietZoneModules: 4, errorCorrection: "Q", logoMaxPercent: 25, minContrast: 80, recommendedDpi: 300, notes: ["Good for logistics"] } },
  },
  flexo: {
    paper: { method: "flexo", substrate: "paper", ean13: { xDimensionMm: 0.38, heightMm: 25.0, magnification: 115, quietZoneMm: 3.5, minContrast: 85, recommendedDpi: 175, notes: ["Account for dot gain"] }, qr: { moduleSizeMm: 0.4, sizeMm: 14, quietZoneModules: 6, errorCorrection: "H", logoMaxPercent: 20, minContrast: 85, recommendedDpi: 175, notes: ["Use coarser screens"] } },
    coated_paper: { method: "flexo", substrate: "coated_paper", ean13: { xDimensionMm: 0.35, heightMm: 24.0, magnification: 106, quietZoneMm: 3.2, minContrast: 85, recommendedDpi: 200, notes: ["Better on coated"] }, qr: { moduleSizeMm: 0.35, sizeMm: 12, quietZoneModules: 6, errorCorrection: "H", logoMaxPercent: 20, minContrast: 85, recommendedDpi: 200, notes: ["Good results"] } },
    label_stock: { method: "flexo", substrate: "label_stock", ean13: { xDimensionMm: 0.38, heightMm: 25.0, magnification: 115, quietZoneMm: 3.5, minContrast: 85, recommendedDpi: 200, notes: ["Test anilox"] }, qr: { moduleSizeMm: 0.4, sizeMm: 14, quietZoneModules: 6, errorCorrection: "H", logoMaxPercent: 20, minContrast: 85, recommendedDpi: 200, notes: ["Verify on press"] } },
    polybag: { method: "flexo", substrate: "polybag", ean13: { xDimensionMm: 0.45, heightMm: 28.0, magnification: 136, quietZoneMm: 4.0, minContrast: 90, recommendedDpi: 200, notes: ["Larger bars needed"] }, qr: { moduleSizeMm: 0.5, sizeMm: 18, quietZoneModules: 8, errorCorrection: "H", logoMaxPercent: 15, minContrast: 90, recommendedDpi: 200, notes: ["Avoid fine details"] } },
    woven_pp: { method: "flexo", substrate: "woven_pp", ean13: { xDimensionMm: 0.5, heightMm: 30.0, magnification: 152, quietZoneMm: 4.5, minContrast: 95, recommendedDpi: 175, notes: ["Largest size recommended"] }, qr: { moduleSizeMm: 0.6, sizeMm: 22, quietZoneModules: 10, errorCorrection: "H", logoMaxPercent: 10, minContrast: 95, recommendedDpi: 175, notes: ["Test extensively"] } },
    foil: { method: "flexo", substrate: "foil", ean13: { xDimensionMm: 0.45, heightMm: 28.0, magnification: 136, quietZoneMm: 4.0, minContrast: 95, recommendedDpi: 200, notes: ["Reverse or opaque white"] }, qr: { moduleSizeMm: 0.5, sizeMm: 18, quietZoneModules: 8, errorCorrection: "H", logoMaxPercent: 10, minContrast: 95, recommendedDpi: 200, notes: ["Use primer"] } },
    metallized: { method: "flexo", substrate: "metallized", ean13: { xDimensionMm: 0.45, heightMm: 28.0, magnification: 136, quietZoneMm: 4.0, minContrast: 95, recommendedDpi: 200, notes: ["Special inks"] }, qr: { moduleSizeMm: 0.5, sizeMm: 18, quietZoneModules: 8, errorCorrection: "H", logoMaxPercent: 10, minContrast: 95, recommendedDpi: 200, notes: ["Test contrast"] } },
    plastic_film: { method: "flexo", substrate: "plastic_film", ean13: { xDimensionMm: 0.45, heightMm: 28.0, magnification: 136, quietZoneMm: 4.0, minContrast: 90, recommendedDpi: 200, notes: ["Use solvent/UV"] }, qr: { moduleSizeMm: 0.5, sizeMm: 18, quietZoneModules: 8, errorCorrection: "H", logoMaxPercent: 15, minContrast: 90, recommendedDpi: 200, notes: ["Account for slip"] } },
    shrink_film: { method: "flexo", substrate: "shrink_film", ean13: { xDimensionMm: 0.5, heightMm: 30.0, magnification: 152, quietZoneMm: 4.5, minContrast: 90, recommendedDpi: 175, notes: ["Pre-compensate"] }, qr: { moduleSizeMm: 0.6, sizeMm: 22, quietZoneModules: 10, errorCorrection: "H", logoMaxPercent: 10, minContrast: 90, recommendedDpi: 175, notes: ["Critical testing"] } },
    rubber: { method: "flexo", substrate: "rubber", ean13: { xDimensionMm: 0.55, heightMm: 32.0, magnification: 167, quietZoneMm: 5.0, minContrast: 95, recommendedDpi: 150, notes: ["1D challenging, QR preferred"] }, qr: { moduleSizeMm: 0.7, sizeMm: 26, quietZoneModules: 12, errorCorrection: "H", logoMaxPercent: 10, minContrast: 95, recommendedDpi: 150, notes: ["Maximize size"] } },
    carton: { method: "flexo", substrate: "carton", ean13: { xDimensionMm: 0.38, heightMm: 25.0, magnification: 115, quietZoneMm: 3.5, minContrast: 85, recommendedDpi: 175, notes: ["Case codes"] }, qr: { moduleSizeMm: 0.4, sizeMm: 14, quietZoneModules: 6, errorCorrection: "H", logoMaxPercent: 20, minContrast: 85, recommendedDpi: 175, notes: ["Logistics use"] } },
  },
  offset: {
    paper: { method: "offset", substrate: "paper", ean13: { xDimensionMm: 0.33, heightMm: 22.85, magnification: 100, quietZoneMm: 3.0, minContrast: 80, recommendedDpi: 300, notes: ["High quality"] }, qr: { moduleSizeMm: 0.25, sizeMm: 10, quietZoneModules: 4, errorCorrection: "Q", logoMaxPercent: 25, minContrast: 80, recommendedDpi: 300, notes: ["Crisp"] } },
    coated_paper: { method: "offset", substrate: "coated_paper", ean13: { xDimensionMm: 0.33, heightMm: 22.85, magnification: 100, quietZoneMm: 3.0, minContrast: 85, recommendedDpi: 300, notes: ["Excellent"] }, qr: { moduleSizeMm: 0.25, sizeMm: 10, quietZoneModules: 4, errorCorrection: "Q", logoMaxPercent: 25, minContrast: 85, recommendedDpi: 300, notes: ["Retail ready"] } },
    label_stock: { method: "offset", substrate: "label_stock", ean13: { xDimensionMm: 0.33, heightMm: 22.85, magnification: 100, quietZoneMm: 3.0, minContrast: 85, recommendedDpi: 300, notes: ["Perfect"] }, qr: { moduleSizeMm: 0.25, sizeMm: 10, quietZoneModules: 4, errorCorrection: "Q", logoMaxPercent: 25, minContrast: 85, recommendedDpi: 300, notes: ["Ideal"] } },
    polybag: { method: "offset", substrate: "polybag", ean13: { xDimensionMm: 0.38, heightMm: 25.0, magnification: 115, quietZoneMm: 3.5, minContrast: 90, recommendedDpi: 300, notes: ["With treatment"] }, qr: { moduleSizeMm: 0.35, sizeMm: 12, quietZoneModules: 6, errorCorrection: "H", logoMaxPercent: 20, minContrast: 90, recommendedDpi: 300, notes: ["Test adhesion"] } },
    woven_pp: { method: "offset", substrate: "woven_pp", ean13: { xDimensionMm: 0.45, heightMm: 28.0, magnification: 136, quietZoneMm: 4.0, minContrast: 90, recommendedDpi: 250, notes: ["Challenging"] }, qr: { moduleSizeMm: 0.45, sizeMm: 16, quietZoneModules: 8, errorCorrection: "H", logoMaxPercent: 15, minContrast: 90, recommendedDpi: 250, notes: ["Large format"] } },
    foil: { method: "offset", substrate: "foil", ean13: { xDimensionMm: 0.4, heightMm: 26.0, magnification: 121, quietZoneMm: 4.0, minContrast: 95, recommendedDpi: 300, notes: ["Use opaque"] }, qr: { moduleSizeMm: 0.4, sizeMm: 14, quietZoneModules: 8, errorCorrection: "H", logoMaxPercent: 15, minContrast: 95, recommendedDpi: 300, notes: ["Special process"] } },
    metallized: { method: "offset", substrate: "metallized", ean13: { xDimensionMm: 0.4, heightMm: 26.0, magnification: 121, quietZoneMm: 4.0, minContrast: 95, recommendedDpi: 300, notes: ["Complex"] }, qr: { moduleSizeMm: 0.4, sizeMm: 14, quietZoneModules: 8, errorCorrection: "H", logoMaxPercent: 15, minContrast: 95, recommendedDpi: 300, notes: ["Proof required"] } },
    plastic_film: { method: "offset", substrate: "plastic_film", ean13: { xDimensionMm: 0.38, heightMm: 25.0, magnification: 115, quietZoneMm: 3.5, minContrast: 90, recommendedDpi: 300, notes: ["Special"] }, qr: { moduleSizeMm: 0.35, sizeMm: 12, quietZoneModules: 6, errorCorrection: "H", logoMaxPercent: 20, minContrast: 90, recommendedDpi: 300, notes: ["Test"] } },
    shrink_film: { method: "offset", substrate: "shrink_film", ean13: { xDimensionMm: 0.42, heightMm: 27.0, magnification: 127, quietZoneMm: 4.0, minContrast: 90, recommendedDpi: 250, notes: ["Pre-compensate"] }, qr: { moduleSizeMm: 0.4, sizeMm: 14, quietZoneModules: 8, errorCorrection: "H", logoMaxPercent: 15, minContrast: 90, recommendedDpi: 250, notes: ["Complex"] } },
    rubber: { method: "offset", substrate: "rubber", ean13: { xDimensionMm: 0.5, heightMm: 30.0, magnification: 152, quietZoneMm: 4.5, minContrast: 95, recommendedDpi: 200, notes: ["Rare"] }, qr: { moduleSizeMm: 0.6, sizeMm: 22, quietZoneModules: 10, errorCorrection: "H", logoMaxPercent: 10, minContrast: 95, recommendedDpi: 200, notes: ["Usually flexo"] } },
    carton: { method: "offset", substrate: "carton", ean13: { xDimensionMm: 0.33, heightMm: 22.85, magnification: 100, quietZoneMm: 3.0, minContrast: 80, recommendedDpi: 300, notes: ["Excellent"] }, qr: { moduleSizeMm: 0.25, sizeMm: 10, quietZoneModules: 4, errorCorrection: "Q", logoMaxPercent: 25, minContrast: 80, recommendedDpi: 300, notes: ["Case labels"] } },
  },
  thermal: {
    paper: { method: "thermal", substrate: "paper", ean13: { xDimensionMm: 0.33, heightMm: 22.85, magnification: 100, quietZoneMm: 3.0, minContrast: 90, recommendedDpi: 203, notes: ["Direct thermal"] }, qr: { moduleSizeMm: 0.3, sizeMm: 12, quietZoneModules: 4, errorCorrection: "M", logoMaxPercent: 20, minContrast: 90, recommendedDpi: 203, notes: ["Lower DPI"] } },
    coated_paper: { method: "thermal", substrate: "coated_paper", ean13: { xDimensionMm: 0.33, heightMm: 22.85, magnification: 100, quietZoneMm: 3.0, minContrast: 90, recommendedDpi: 203, notes: ["Thermal transfer"] }, qr: { moduleSizeMm: 0.3, sizeMm: 12, quietZoneModules: 4, errorCorrection: "M", logoMaxPercent: 20, minContrast: 90, recommendedDpi: 203, notes: ["Better"] } },
    label_stock: { method: "thermal", substrate: "label_stock", ean13: { xDimensionMm: 0.33, heightMm: 22.85, magnification: 100, quietZoneMm: 3.0, minContrast: 90, recommendedDpi: 203, notes: ["Common"] }, qr: { moduleSizeMm: 0.3, sizeMm: 12, quietZoneModules: 4, errorCorrection: "M", logoMaxPercent: 20, minContrast: 90, recommendedDpi: 203, notes: ["Logistics"] } },
    polybag: { method: "thermal", substrate: "polybag", ean13: { xDimensionMm: 0.38, heightMm: 25.0, magnification: 115, quietZoneMm: 3.5, minContrast: 90, recommendedDpi: 203, notes: ["Thermal transfer"] }, qr: { moduleSizeMm: 0.35, sizeMm: 14, quietZoneModules: 6, errorCorrection: "Q", logoMaxPercent: 20, minContrast: 90, recommendedDpi: 203, notes: ["Need ribbon"] } },
    woven_pp: { method: "thermal", substrate: "woven_pp", ean13: { xDimensionMm: 0.4, heightMm: 26.0, magnification: 121, quietZoneMm: 4.0, minContrast: 90, recommendedDpi: 300, notes: ["Special ribbon"] }, qr: { moduleSizeMm: 0.4, sizeMm: 16, quietZoneModules: 8, errorCorrection: "Q", logoMaxPercent: 15, minContrast: 90, recommendedDpi: 300, notes: ["Test"] } },
    foil: { method: "thermal", substrate: "foil", ean13: { xDimensionMm: 0.4, heightMm: 26.0, magnification: 121, quietZoneMm: 4.0, minContrast: 95, recommendedDpi: 300, notes: ["Resin ribbon"] }, qr: { moduleSizeMm: 0.4, sizeMm: 16, quietZoneModules: 8, errorCorrection: "H", logoMaxPercent: 15, minContrast: 95, recommendedDpi: 300, notes: ["Expensive"] } },
    metallized: { method: "thermal", substrate: "metallized", ean13: { xDimensionMm: 0.4, heightMm: 26.0, magnification: 121, quietZoneMm: 4.0, minContrast: 95, recommendedDpi: 300, notes: ["Resin"] }, qr: { moduleSizeMm: 0.4, sizeMm: 16, quietZoneModules: 8, errorCorrection: "H", logoMaxPercent: 15, minContrast: 95, recommendedDpi: 300, notes: ["Test"] } },
    plastic_film: { method: "thermal", substrate: "plastic_film", ean13: { xDimensionMm: 0.38, heightMm: 25.0, magnification: 115, quietZoneMm: 3.5, minContrast: 90, recommendedDpi: 300, notes: ["Wax/resin"] }, qr: { moduleSizeMm: 0.35, sizeMm: 14, quietZoneModules: 6, errorCorrection: "Q", logoMaxPercent: 20, minContrast: 90, recommendedDpi: 300, notes: ["Ribbon choice"] } },
    shrink_film: { method: "thermal", substrate: "shrink_film", ean13: { xDimensionMm: 0.42, heightMm: 27.0, magnification: 127, quietZoneMm: 4.0, minContrast: 90, recommendedDpi: 300, notes: ["Difficult"] }, qr: { moduleSizeMm: 0.4, sizeMm: 16, quietZoneModules: 8, errorCorrection: "H", logoMaxPercent: 15, minContrast: 90, recommendedDpi: 300, notes: ["Test"] } },
    rubber: { method: "thermal", substrate: "rubber", ean13: { xDimensionMm: 0.45, heightMm: 28.0, magnification: 136, quietZoneMm: 4.0, minContrast: 95, recommendedDpi: 300, notes: ["Rare"] }, qr: { moduleSizeMm: 0.5, sizeMm: 18, quietZoneModules: 8, errorCorrection: "H", logoMaxPercent: 15, minContrast: 95, recommendedDpi: 300, notes: ["Large"] } },
    carton: { method: "thermal", substrate: "carton", ean13: { xDimensionMm: 0.33, heightMm: 22.85, magnification: 100, quietZoneMm: 3.0, minContrast: 90, recommendedDpi: 203, notes: ["Shipping"] }, qr: { moduleSizeMm: 0.3, sizeMm: 12, quietZoneModules: 4, errorCorrection: "M", logoMaxPercent: 20, minContrast: 90, recommendedDpi: 203, notes: ["Labels"] } },
  },
  screen: {
    paper: { method: "screen", substrate: "paper", ean13: { xDimensionMm: 0.4, heightMm: 26.0, magnification: 121, quietZoneMm: 4.0, minContrast: 90, recommendedDpi: 150, notes: ["Thicker inks"] }, qr: { moduleSizeMm: 0.45, sizeMm: 16, quietZoneModules: 8, errorCorrection: "H", logoMaxPercent: 15, minContrast: 90, recommendedDpi: 150, notes: ["Less fine"] } },
    coated_paper: { method: "screen", substrate: "coated_paper", ean13: { xDimensionMm: 0.38, heightMm: 25.0, magnification: 115, quietZoneMm: 3.5, minContrast: 90, recommendedDpi: 150, notes: ["Good"] }, qr: { moduleSizeMm: 0.4, sizeMm: 14, quietZoneModules: 6, errorCorrection: "H", logoMaxPercent: 20, minContrast: 90, recommendedDpi: 150, notes: ["Acceptable"] } },
    label_stock: { method: "screen", substrate: "label_stock", ean13: { xDimensionMm: 0.38, heightMm: 25.0, magnification: 115, quietZoneMm: 3.5, minContrast: 90, recommendedDpi: 150, notes: ["Possible"] }, qr: { moduleSizeMm: 0.4, sizeMm: 14, quietZoneModules: 6, errorCorrection: "H", logoMaxPercent: 20, minContrast: 90, recommendedDpi: 150, notes: ["Test"] } },
    polybag: { method: "screen", substrate: "polybag", ean13: { xDimensionMm: 0.45, heightMm: 28.0, magnification: 136, quietZoneMm: 4.0, minContrast: 90, recommendedDpi: 150, notes: ["Larger"] }, qr: { moduleSizeMm: 0.5, sizeMm: 18, quietZoneModules: 8, errorCorrection: "H", logoMaxPercent: 15, minContrast: 90, recommendedDpi: 150, notes: ["Thick ink"] } },
    woven_pp: { method: "screen", substrate: "woven_pp", ean13: { xDimensionMm: 0.5, heightMm: 30.0, magnification: 152, quietZoneMm: 4.5, minContrast: 95, recommendedDpi: 125, notes: ["Large"] }, qr: { moduleSizeMm: 0.6, sizeMm: 22, quietZoneModules: 10, errorCorrection: "H", logoMaxPercent: 10, minContrast: 95, recommendedDpi: 125, notes: ["Ink laydown"] } },
    foil: { method: "screen", substrate: "foil", ean13: { xDimensionMm: 0.45, heightMm: 28.0, magnification: 136, quietZoneMm: 4.0, minContrast: 95, recommendedDpi: 150, notes: ["Opaque"] }, qr: { moduleSizeMm: 0.5, sizeMm: 18, quietZoneModules: 8, errorCorrection: "H", logoMaxPercent: 15, minContrast: 95, recommendedDpi: 150, notes: ["Good"] } },
    metallized: { method: "screen", substrate: "metallized", ean13: { xDimensionMm: 0.45, heightMm: 28.0, magnification: 136, quietZoneMm: 4.0, minContrast: 95, recommendedDpi: 150, notes: ["Opaque"] }, qr: { moduleSizeMm: 0.5, sizeMm: 18, quietZoneModules: 8, errorCorrection: "H", logoMaxPercent: 15, minContrast: 95, recommendedDpi: 150, notes: ["Test"] } },
    plastic_film: { method: "screen", substrate: "plastic_film", ean13: { xDimensionMm: 0.45, heightMm: 28.0, magnification: 136, quietZoneMm: 4.0, minContrast: 90, recommendedDpi: 150, notes: ["Adhesion"] }, qr: { moduleSizeMm: 0.5, sizeMm: 18, quietZoneModules: 8, errorCorrection: "H", logoMaxPercent: 15, minContrast: 90, recommendedDpi: 150, notes: ["Cure"] } },
    shrink_film: { method: "screen", substrate: "shrink_film", ean13: { xDimensionMm: 0.5, heightMm: 30.0, magnification: 152, quietZoneMm: 4.5, minContrast: 90, recommendedDpi: 125, notes: ["Large"] }, qr: { moduleSizeMm: 0.6, sizeMm: 22, quietZoneModules: 10, errorCorrection: "H", logoMaxPercent: 10, minContrast: 90, recommendedDpi: 125, notes: ["Pre-test"] } },
    rubber: { method: "screen", substrate: "rubber", ean13: { xDimensionMm: 0.6, heightMm: 35.0, magnification: 182, quietZoneMm: 5.5, minContrast: 95, recommendedDpi: 100, notes: ["Very large"] }, qr: { moduleSizeMm: 0.7, sizeMm: 26, quietZoneModules: 12, errorCorrection: "H", logoMaxPercent: 10, minContrast: 95, recommendedDpi: 100, notes: ["QR preferred"] } },
    carton: { method: "screen", substrate: "carton", ean13: { xDimensionMm: 0.4, heightMm: 26.0, magnification: 121, quietZoneMm: 4.0, minContrast: 90, recommendedDpi: 150, notes: ["Rough"] }, qr: { moduleSizeMm: 0.45, sizeMm: 16, quietZoneModules: 8, errorCorrection: "H", logoMaxPercent: 15, minContrast: 90, recommendedDpi: 150, notes: ["Acceptable"] } },
  },
  inkjet: {
    paper: { method: "inkjet", substrate: "paper", ean13: { xDimensionMm: 0.33, heightMm: 22.85, magnification: 100, quietZoneMm: 3.0, minContrast: 80, recommendedDpi: 300, notes: ["Standard"] }, qr: { moduleSizeMm: 0.25, sizeMm: 10, quietZoneModules: 4, errorCorrection: "Q", logoMaxPercent: 25, minContrast: 80, recommendedDpi: 300, notes: ["Good"] } },
    coated_paper: { method: "inkjet", substrate: "coated_paper", ean13: { xDimensionMm: 0.33, heightMm: 22.85, magnification: 100, quietZoneMm: 3.0, minContrast: 85, recommendedDpi: 300, notes: ["Excellent"] }, qr: { moduleSizeMm: 0.25, sizeMm: 10, quietZoneModules: 4, errorCorrection: "Q", logoMaxPercent: 25, minContrast: 85, recommendedDpi: 300, notes: ["Crisp"] } },
    label_stock: { method: "inkjet", substrate: "label_stock", ean13: { xDimensionMm: 0.33, heightMm: 22.85, magnification: 100, quietZoneMm: 3.0, minContrast: 85, recommendedDpi: 300, notes: ["Great"] }, qr: { moduleSizeMm: 0.25, sizeMm: 10, quietZoneModules: 4, errorCorrection: "Q", logoMaxPercent: 25, minContrast: 85, recommendedDpi: 300, notes: ["On-demand"] } },
    polybag: { method: "inkjet", substrate: "polybag", ean13: { xDimensionMm: 0.38, heightMm: 25.0, magnification: 115, quietZoneMm: 3.5, minContrast: 90, recommendedDpi: 300, notes: ["Coated needed"] }, qr: { moduleSizeMm: 0.35, sizeMm: 12, quietZoneModules: 6, errorCorrection: "Q", logoMaxPercent: 20, minContrast: 90, recommendedDpi: 300, notes: ["Test"] } },
    woven_pp: { method: "inkjet", substrate: "woven_pp", ean13: { xDimensionMm: 0.45, heightMm: 28.0, magnification: 136, quietZoneMm: 4.0, minContrast: 90, recommendedDpi: 300, notes: ["Large"] }, qr: { moduleSizeMm: 0.45, sizeMm: 16, quietZoneModules: 8, errorCorrection: "H", logoMaxPercent: 15, minContrast: 90, recommendedDpi: 300, notes: ["Difficult"] } },
    foil: { method: "inkjet", substrate: "foil", ean13: { xDimensionMm: 0.4, heightMm: 26.0, magnification: 121, quietZoneMm: 4.0, minContrast: 95, recommendedDpi: 300, notes: ["Special"] }, qr: { moduleSizeMm: 0.4, sizeMm: 14, quietZoneModules: 8, errorCorrection: "H", logoMaxPercent: 15, minContrast: 95, recommendedDpi: 300, notes: ["Primer"] } },
    metallized: { method: "inkjet", substrate: "metallized", ean13: { xDimensionMm: 0.4, heightMm: 26.0, magnification: 121, quietZoneMm: 4.0, minContrast: 95, recommendedDpi: 300, notes: ["Special"] }, qr: { moduleSizeMm: 0.4, sizeMm: 14, quietZoneModules: 8, errorCorrection: "H", logoMaxPercent: 15, minContrast: 95, recommendedDpi: 300, notes: ["Test"] } },
    plastic_film: { method: "inkjet", substrate: "plastic_film", ean13: { xDimensionMm: 0.38, heightMm: 25.0, magnification: 115, quietZoneMm: 3.5, minContrast: 90, recommendedDpi: 300, notes: ["Coated"] }, qr: { moduleSizeMm: 0.35, sizeMm: 12, quietZoneModules: 6, errorCorrection: "Q", logoMaxPercent: 20, minContrast: 90, recommendedDpi: 300, notes: ["Test"] } },
    shrink_film: { method: "inkjet", substrate: "shrink_film", ean13: { xDimensionMm: 0.42, heightMm: 27.0, magnification: 127, quietZoneMm: 4.0, minContrast: 90, recommendedDpi: 300, notes: ["Pre-compensate"] }, qr: { moduleSizeMm: 0.4, sizeMm: 14, quietZoneModules: 8, errorCorrection: "H", logoMaxPercent: 15, minContrast: 90, recommendedDpi: 300, notes: ["Challenging"] } },
    rubber: { method: "inkjet", substrate: "rubber", ean13: { xDimensionMm: 0.45, heightMm: 28.0, magnification: 136, quietZoneMm: 4.0, minContrast: 95, recommendedDpi: 300, notes: ["Rare"] }, qr: { moduleSizeMm: 0.5, sizeMm: 18, quietZoneModules: 8, errorCorrection: "H", logoMaxPercent: 15, minContrast: 95, recommendedDpi: 300, notes: ["Large"] } },
    carton: { method: "inkjet", substrate: "carton", ean13: { xDimensionMm: 0.33, heightMm: 22.85, magnification: 100, quietZoneMm: 3.0, minContrast: 80, recommendedDpi: 300, notes: ["Good"] }, qr: { moduleSizeMm: 0.25, sizeMm: 10, quietZoneModules: 4, errorCorrection: "Q", logoMaxPercent: 25, minContrast: 80, recommendedDpi: 300, notes: ["On-demand"] } },
  },
};

export function getPrintSpec(method: PrintMethod, substrate: Substrate): BarcodePrintSpec {
  return PRINT_SPECS[method][substrate];
}

export function recommendSpecs(method: PrintMethod, substrate: Substrate) {
  const spec = getPrintSpec(method, substrate);
  return {
    ean13: `X-dim: ${spec.ean13.xDimensionMm}mm | H: ${spec.ean13.heightMm}mm | Mag: ${spec.ean13.magnification}% | QZ: ${spec.ean13.quietZoneMm}mm | DPI: ${spec.ean13.recommendedDpi}`,
    qr: `Module: ${spec.qr.moduleSizeMm}mm | Size: ${spec.qr.sizeMm}mm | QZ: ${spec.qr.quietZoneModules} mod | EC: ${spec.qr.errorCorrection} | Logo: ≤${spec.qr.logoMaxPercent}% | DPI: ${spec.qr.recommendedDpi}`,
    warnings: spec.ean13.notes.concat(spec.qr.notes),
  };
}

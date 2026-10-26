# Barcode Inversion Design Specification

## Overview
This specification defines high-contrast color inversion for EAN-13 barcodes to ensure maximum scannability on both light and dark backgrounds while maintaining GS1/ISO/IEC 15420 compliance.

## Color Schemes

### Scheme 1: White on Black (Dark Background)
- **Bar Color:** `#FFFFFF` (Pure White)
- **Background Color:** `#000000` (Pure Black)
- **Human Readable Text (HRI):** `#FFFFFF` (Pure White)
- **Quiet Zone:** Must remain `#000000` (no pattern, solid background)
- **Use Case:** Premium packaging, black labels, dark substrates, foil with dark printing

### Scheme 2: Black on White (Light Background)
- **Bar Color:** `#000000` (Pure Black)
- **Background Color:** `#FFFFFF` (Pure White)
- **Human Readable Text (HRI):** `#000000` (Pure Black)
- **Quiet Zone:** Must remain `#FFFFFF` (solid background)
- **Use Case:** Standard retail packaging, white labels, paper substrates

## Technical Requirements

### Contrast Ratio
- **Minimum:** 70% print contrast (ISO/IEC 15416)
- **Target:** > 90% for optimal first-pass scan rates
- White on black achieves ~100% contrast
- Black on white achieves ~100% contrast

### Bar Width (X-Dimension)
- **Minimum:** 0.330mm
- **Optimal:** 0.370mm - 0.495mm
- **Magnification:** 80% - 200% as needed per substrate
- Must follow ISO/IEC 15420 requirements regardless of color inversion

### Quiet Zone
- **Minimum:** 10x X-dimension on left and right (9 modules minimum)
- **Critical:** Quiet zone must match the background color exactly with no bars, text, or graphics
- Inverted schemes require same quiet zone dimensions as standard

### Bar Height
- **Minimum:** 5.0x X-dimension (per ISO/IEC 15420)
- **Recommended:** 22.85mm for full-size EAN-13
- Guard bars must extend to full height as specified

## Implementation Guidelines

### CSS/SVG Implementation
```css
/* White on Black */
.barcode-inverted-dark {
  background-color: #000000;
}
.barcode-inverted-dark .bars {
  fill: #FFFFFF;
}
.barcode-inverted-dark .text {
  fill: #FFFFFF;
}

/* Black on White */
.barcode-inverted-light {
  background-color: #FFFFFF;
}
.barcode-inverted-light .bars {
  fill: #000000;
}
.barcode-inverted-light .text {
  fill: #000000;
}
```

### Printing Guidelines
- **DPI:** 300-600 DPI minimum for digital, 175-300 for flexo/offset
- **Ink:** Use solid, opaque inks. Avoid gradients or tints
- **Substrates:** Test on actual material before mass production
- **Verification:** Use ISO/IEC 15416 verifier, not just camera scanning
- **Registration:** Ensure proper registration to avoid color bleed

## Scanning Compatibility
- **Hardware Scanners:** Compatible with all laser, CCD, and imager-based scanners
- **Mobile Devices:** Compatible with all modern smartphone cameras
- **POS Systems:** Fully compatible with standard retail POS
- **Angle Tolerance:** Maintained same as standard orientation

## Quality Assurance Checklist
- [ ] Contrast ratio measured >= 70%
- [ ] Quiet zones properly maintained
- [ ] X-dimension within acceptable range
- [ ] HRI legible at print size
- [ ] Verified with physical barcode verifier
- [ ] Tested on actual target substrate
- [ ] No ink bleeding into quiet zones
- [ ] Guard patterns intact and properly extended

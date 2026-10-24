# Vankharis QR & Barcode User Guide

## Overview
Kharis Foods uses two types of codes on our products for traceability and authenticity:

- **QR Codes** - Scannable with any smartphone camera. Used for product information, recipes, and authenticity verification.
- **EAN-13 Barcodes** - Standard retail barcodes used at Point of Sale (POS) systems in stores.

## For Customers (Scanning Products)

### Scanning QR Codes
1. Open your smartphone camera or a QR code scanner app
2. Point the camera at the QR code on the product packaging
3. Tap the notification/prompt that appears
4. You'll be taken to the Kharis Foods product page showing:
   - Product details and preparation instructions
   - Usage guide and recipes
   - **Authenticity verification badge** - Confirms if the product is genuine
   - Option to leave feedback

### Checking Authenticity
When you scan a QR code with a batch number:
- **"Authentic Kharis Foods Verified"** - The batch is registered in our system. Shows batch code, pack date, facility, and material.
- **"Authentic Kharis Foods Product"** - Valid production code format
- **Warning messages** - May appear if the code appears tampered with or has been scanned many times

### Scanning Barcodes at Checkout
Our EAN-13 barcodes work with standard retail scanners. Simply present the product at checkout like any other item.

## For Retailers & Distributors

### Product Verification
- Scan the QR code to instantly verify product authenticity
- Check batch information including production date and facility
- Report suspicious products to Vankharis Limited

### Stock Management
- Each batch has a unique batch code for traceability
- Track products by batch through our system
- Contact us if you need batch-specific documentation

## For Admin Users

### Generating QR Codes
1. Go to Admin Dashboard → QR Studio
2. Select the product and batch
3. Customize QR appearance (color, style, logo)
4. Generate and download for printing
5. QR codes include secure HMAC signatures for authenticity

### Generating Barcodes (EAN-13)
1. Go to Admin Dashboard → Product Barcodes
2. Select product (GTINs are pre-configured)
3. Generate and print barcode labels
4. Use for retail labeling

### Managing Batches
1. Go to Admin Dashboard → Batch Registry
2. Create batches with print quantity, production date, facility
3. Track scan counts per batch
4. Update batch status (Active/Depleted/Recalled)
5. Monitor which batches have been scanned and how many times

## Security Features

- **HMAC-Signed URLs** - QR codes contain cryptographically signed parameters that can't be easily forged
- **Batch Traceability** - Every QR links to a specific production batch
- **Scan Tracking** - All scans are recorded for security monitoring
- **Tamper Detection** - Modified QR codes are flagged as invalid

## Tips & Best Practices

- **Always scan from the original packaging** - Photocopied or printed QR codes may trigger security warnings
- **Keep packaging intact** - Damaged QR codes may be difficult to scan
- **Report concerns** - If authenticity verification fails, contact Vankharis Limited

## Support
For questions or concerns about QR codes, barcodes, or product authenticity:
- Visit: https://vankharis.com
- Email: info@vankharis.com

*Last Updated: October 2026*

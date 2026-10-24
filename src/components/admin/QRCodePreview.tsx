"use client";

import { useEffect, useRef, useState } from "react";
import QRCodeStyling from "qr-code-styling";

interface QRCodePreviewProps {
  data: string;
  color: string;
  size?: number;
  backgroundColor?: string;
  onSvgReady?: (svgString: string) => void;
}

let cachedLogoDataUrl: string | null = null;

async function getCenteredLogoDataUrl(): Promise<string> {
  if (cachedLogoDataUrl) return cachedLogoDataUrl;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const badgeSize = 160;
      const canvas = document.createElement("canvas");
      canvas.width = badgeSize;
      canvas.height = badgeSize;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve("/images/kharisfoods-removebg-preview.png");
        return;
      }

      // Draw a clean white rounded-square badge so the logo is crisp on both white and black QR backgrounds
      const r = 28;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(badgeSize - r, 0);
      ctx.quadraticCurveTo(badgeSize, 0, badgeSize, r);
      ctx.lineTo(badgeSize, badgeSize - r);
      ctx.quadraticCurveTo(badgeSize, badgeSize, badgeSize - r, badgeSize);
      ctx.lineTo(r, badgeSize);
      ctx.quadraticCurveTo(0, badgeSize, 0, badgeSize - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
      ctx.fill();

      // Draw logo preserving aspect ratio in the center of the badge
      const pad = 16;
      const maxW = badgeSize - pad * 2;
      const maxH = badgeSize - pad * 2;
      const scale = Math.min(maxW / img.width, maxH / img.height);
      const drawW = img.width * scale;
      const drawH = img.height * scale;
      const drawX = (badgeSize - drawW) / 2;
      const drawY = (badgeSize - drawH) / 2;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      cachedLogoDataUrl = canvas.toDataURL("image/png");
      resolve(cachedLogoDataUrl);
    };
    img.onerror = () => {
      resolve("/images/kharisfoods-removebg-preview.png");
    };
    img.src = "/images/kharisfoods-removebg-preview.png";
  });
}

export default function QRCodePreview({
  data,
  color,
  size = 180,
  backgroundColor = "#ffffff",
  onSvgReady,
}: QRCodePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(cachedLogoDataUrl);

  useEffect(() => {
    let active = true;
    if (!logoUrl) {
      getCenteredLogoDataUrl().then((url) => {
        if (active) setLogoUrl(url);
      });
    }
    return () => {
      active = false;
    };
  }, [logoUrl]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !data || !logoUrl) return;

    el.innerHTML = "";

    const qr = new QRCodeStyling({
      width: size,
      height: size,
      type: "svg",
      data,
      image: logoUrl,
      margin: 10,
      qrOptions: {
        typeNumber: 0,
        mode: "Byte",
        errorCorrectionLevel: "H",
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.34,
        margin: 4,
        crossOrigin: "anonymous",
      },
      dotsOptions: {
        color,
        type: "rounded",
      },
      backgroundOptions: {
        color: backgroundColor,
      },
      cornersSquareOptions: {
        color,
        type: "extra-rounded",
      },
      cornersDotOptions: {
        color,
        type: "dot",
      },
    });

    qr.append(el);

    if (onSvgReady) {
      qr.getRawData("svg")
        .then((blob) => {
          if (blob && blob instanceof Blob) {
            return blob.text();
          }
          return "";
        })
        .then((svgText) => {
          if (svgText) onSvgReady(svgText);
        })
        .catch(() => {});
    }

    return () => {
      el.innerHTML = "";
    };
  }, [data, color, size, backgroundColor, logoUrl, onSvgReady]);

  return <div ref={containerRef} className="flex items-center justify-center" />;
}

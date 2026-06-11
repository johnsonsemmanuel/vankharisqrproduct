"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import QRCodeStyling from "qr-code-styling";
import Link from "next/link";
import { LayoutDashboard, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/data/products";
import { checkAuth, logout as adminLogout } from "@/lib/admin-auth";

const BASE_URL = "https://kharisfoods.vankharis.com";

export default function AdminQRPage() {
  const router = useRouter();
  const [baseUrl, setBaseUrl] = useState(BASE_URL);

  useEffect(() => {
    if (!checkAuth()) {
      router.replace("/admin");
      return;
    }
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      setBaseUrl(`http://localhost:${window.location.port}`);
    }
  }, [router]);

  return (
    <div className="min-h-dvh bg-gray-50">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-5 h-14 max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <img
              src="/images/kharisfoods-removebg-preview.png"
              alt="Kharis Foods"
              className="h-6 w-auto"
            />
            <h1 className="font-bold text-gray-800 text-sm">QR Codes</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors"
            >
              <LayoutDashboard className="size-3.5" />
              Dashboard
            </Link>
            <button
              onClick={() => { adminLogout(); router.push("/admin"); }}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
            >
              <LogOut className="size-3.5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-5 py-6 space-y-6">
        {products.map((product) => (
          <ProductQRCard
            key={product.id}
            product={product}
            baseUrl={baseUrl}
          />
        ))}
      </div>
    </div>
  );
}

function ProductQRCard({
  product,
  baseUrl,
}: {
  product: (typeof products)[number];
  baseUrl: string;
}) {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrInstance = useRef<QRCodeStyling | null>(null);
  const [copied, setCopied] = useState(false);
  const productUrl = `${baseUrl}/product/${product.slug}`;

  useEffect(() => {
    if (!qrRef.current) return;

    qrRef.current.innerHTML = "";

    qrInstance.current = new QRCodeStyling({
      width: 180,
      height: 180,
      data: productUrl,
      type: "svg",
      image: "/images/kharisfoods-removebg-preview.png",
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 6,
        imageSize: 0.4,
      },
      dotsOptions: {
        color: "#1b5e20",
        type: "rounded",
      },
      cornersSquareOptions: {
        color: "#1b5e20",
        type: "extra-rounded",
      },
      cornersDotOptions: {
        color: "#1b5e20",
        type: "dot",
      },
      backgroundOptions: {
        color: "transparent",
      },
    });

    qrInstance.current.append(qrRef.current);
  }, [productUrl]);

  const handleDownloadSVG = () => {
    qrInstance.current?.download({
      name: `qr-${product.slug}`,
      extension: "svg",
    });
  };

  const handleDownloadPNG = () => {
    qrInstance.current?.download({
      name: `qr-${product.slug}`,
      extension: "png",
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-5 flex flex-col items-center gap-5">
        <div className="text-center">
          <h2 className="text-base font-bold text-gray-800">{product.name}</h2>
          <p className="text-xs text-gray-500 mt-0.5 break-all">{productUrl}</p>
        </div>

        <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-200 py-6 px-8 w-full">
          <div className="relative p-0.5">
            <div ref={qrRef} />
            <div className="absolute top-0 left-0 size-3 rounded-tl border-t-2 border-l-2 border-kharis-green-700" />
            <div className="absolute top-0 right-0 size-3 rotate-90 rounded-tl border-t-2 border-l-2 border-kharis-green-700" />
            <div className="absolute bottom-0 left-0 size-3 -rotate-90 rounded-tl border-t-2 border-l-2 border-kharis-green-700" />
            <div className="absolute right-0 bottom-0 size-3 rotate-180 rounded-tl border-t-2 border-l-2 border-kharis-green-700" />
          </div>
        </div>

        <div className="flex w-full items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
          <span className="text-sm font-medium text-gray-700 truncate mr-2">
            {productUrl}
          </span>
          <Button
            onClick={handleCopy}
            variant="ghost"
            size="icon"
            className="size-7"
            title="Copy URL"
          >
            {copied ? (
              <svg className="size-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="size-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15c0-2.828 0-4.243.879-5.121C10.757 9 12.172 9 15 9h1c2.828 0 4.243 0 5.121.879C22 10.757 22 12.172 22 15v1c0 2.828 0 4.243-.879 5.121C20.243 22 18.828 22 16 22h-1c-2.828 0-4.243 0-5.121-.879C9 20.243 9 18.828 9 16z" />
                <path d="M17 9c-.003-2.957-.047-4.489-.908-5.538a4 4 0 0 0-.554-.554C14.43 2 12.788 2 9.5 2c-3.287 0-4.931 0-6.038.908a4 4 0 0 0-.554.554C2 4.57 2 6.212 2 9.5c0 3.287 0 4.931.908 6.038a4 4 0 0 0 .554.554c1.05.86 2.58.906 5.538.908" />
              </svg>
            )}
          </Button>
        </div>

        <div className="flex w-full gap-3">
          <button
            onClick={handleDownloadSVG}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 hover:bg-gray-50 transition-colors"
          >
            <svg className="size-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 11l5 5 5-5M12 4v12" />
            </svg>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-800">SVG</p>
              <p className="text-xs text-gray-400">Scalable</p>
            </div>
          </button>
          <button
            onClick={handleDownloadPNG}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 hover:bg-gray-50 transition-colors"
          >
            <svg className="size-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 11l5 5 5-5M12 4v12" />
            </svg>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-800">PNG</p>
              <p className="text-xs text-gray-400">High-res</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

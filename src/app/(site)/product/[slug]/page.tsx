"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { motion, useScroll, useSpring } from "framer-motion";
import { products } from "@/data/products";
import ProductHero from "@/components/ProductHero";
import Section from "@/components/Section";
import ImageGallery from "@/components/ImageGallery";
import UsageGuide from "@/components/UsageGuide";
import SpecsTable from "@/components/SpecsTable";
import Accordion from "@/components/Accordion";
import SectionBody from "@/components/SectionBody";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight, Info } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSelector from "@/components/LanguageSelector";
import AuthenticityCard from "@/components/AuthenticityCard";
import RecipeViewer from "@/components/RecipeViewer";
import FeedbackForm from "@/components/FeedbackForm";
import AuthenticityPopup from "@/components/AuthenticityPopup";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = products.find((p) => p.slug === slug);

  if (!product) notFound();

  const [locale, setLocale] = useState("en");
  const [batch, setBatch] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState<string | null>(null);
  const [sig, setSig] = useState<string | null>(null);
  const [showAuthPopup, setShowAuthPopup] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const b = params.get("batch");
      setBatch(b);
      setTimestamp(params.get("ts"));
      setSig(params.get("sig"));
      if (b) {
        setTimeout(() => setShowAuthPopup(true), 800);
      }
    }
  }, []);

  const localizedProduct = {
    ...product,
    ...(locale !== "en" && product.translations?.[locale] ? product.translations[locale] : {}),
  };

  const currentIndex = products.findIndex((p) => p.slug === slug);
  const prev = currentIndex > 0 ? products[currentIndex - 1] : null;
  const next = currentIndex < products.length - 1 ? products[currentIndex + 1] : null;

  useEffect(() => {
    if (product) {
      try {
        const params = new URLSearchParams(window.location.search);
        const batchCode = params.get("batch") || params.get("b") || undefined;
        navigator.sendBeacon(
          "/api/track",
          JSON.stringify({
            productSlug: product.slug,
            productName: product.name,
            batchCode,
          })
        );
      } catch {}
    }
  }, [product]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      <AuthenticityPopup show={showAuthPopup && !!batch} batchCode={batch} productName={product.name} />
      <motion.div
        className="fixed top-0 left-0 right-0 z-50 h-1 origin-left bg-kharis-gold-500"
        style={{ scaleX }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Back navigation */}
        <div className="sticky top-0 z-40 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xs border-b border-neutral-200/80 dark:border-neutral-800">
          <div className="max-w-4xl mx-auto flex items-center justify-between px-4 sm:px-6 h-14">
            <Link
              href="/"
              className="flex items-center gap-1.5 py-2 text-sm font-medium text-neutral-700 hover:text-brand-700 dark:text-neutral-200 dark:hover:text-brand-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              All Products
            </Link>
            <div className="flex items-center gap-2">
              <LanguageSelector currentLocale={locale} onChange={setLocale} />
              <ThemeToggle />
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Authenticity Verification Card */}
          <AuthenticityCard slug={slug} batch={batch} timestamp={timestamp} sig={sig} />

          {/* Product Hero */}
          <ProductHero product={localizedProduct} />

        {/* Product Description */}
        <Section title={locale === "fr" ? "Description" : "Description"}>
          <p className="text-sm text-kharis-green-700 dark:text-neutral-200 leading-relaxed">
            {localizedProduct.description}
          </p>
        </Section>

        {/* Images */}
        {localizedProduct.images.length > 0 && (
          <Section title={locale === "fr" ? "Galerie" : "Gallery"} delay={0.1}>
            <ImageGallery images={localizedProduct.images} productName={localizedProduct.name} />
          </Section>
        )}

        {/* Usage Guide */}
        <Section title={locale === "fr" ? "Mode d'emploi" : "How to Use"} delay={0.2}>
          <UsageGuide steps={localizedProduct.usageGuide} />
        </Section>

        {/* Recipes (Portion Scaler & Checklist) */}
        {localizedProduct.recipes && localizedProduct.recipes.length > 0 && (
          <Section title={locale === "fr" ? "Recettes" : "Recipes"} delay={0.25}>
            <RecipeViewer recipes={localizedProduct.recipes} />
          </Section>
        )}

        {/* Specs */}
        {localizedProduct.specs && Object.keys(localizedProduct.specs).length > 0 && (
          <Section title={locale === "fr" ? "Spécifications" : "Specifications"} delay={0.3}>
            <SpecsTable specs={localizedProduct.specs} />
          </Section>
        )}

        {/* Rich Sections */}
        {localizedProduct.sections && localizedProduct.sections.length > 0 && (
          <div className="border-t border-neutral-200/80 dark:border-neutral-800">
            <div className="px-4 sm:px-6 pt-6 pb-2">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-brand-600 rounded-full inline-block shrink-0" />
                <Info className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
                {locale === "fr" ? "Informations Complémentaires" : "More Information"}
              </h2>
            </div>
            <Accordion
              items={localizedProduct.sections.map((s) => ({
                title: s.title,
                content: <SectionBody section={s} />,
              }))}
            />
          </div>
        )}

        {/* Prev / Next navigation */}
        <section className="px-4 sm:px-6 py-6 flex gap-3">
          {prev ? (
            <Link
              href={`/product/${prev.slug}`}
              className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-neutral-700 active:bg-neutral-50 dark:active:bg-neutral-900 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-neutral-500 dark:text-neutral-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  {locale === "fr" ? "Précédent" : "Previous"}
                </div>
                <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate">
                  {prev.name}
                </div>
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          {next ? (
            <Link
              href={`/product/${next.slug}`}
              className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl border border-neutral-200/80 dark:border-neutral-800 hover:border-brand-300 dark:hover:border-neutral-700 active:bg-neutral-50 dark:active:bg-neutral-900 transition-colors text-right"
            >
              <div className="min-w-0 flex-1">
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  {locale === "fr" ? "Suivant" : "Next"}
                </div>
                <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate">
                  {next.name}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500 dark:text-neutral-400 shrink-0" />
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </section>

        {/* Feedback Rating Form */}
        <section className="px-4 sm:px-6 py-6 border-t border-neutral-200/80 dark:border-neutral-800">
          <FeedbackForm productSlug={product.slug} productName={product.name} batchCode={batch || undefined} />
        </section>
        </div>

        {/* Footer */}
        <footer className="px-4 sm:px-6 py-6 border-t border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-center">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              &copy; {new Date().getFullYear()} Kharis Foods. All rights reserved.
            </p>
            <p className="mt-1 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Member of{" "}
              <a
                href="https://vankharis.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-700 dark:text-brand-400 underline underline-offset-2 hover:text-brand-800 dark:hover:text-brand-300 transition-colors"
              >
                Vankharis Limited
              </a>
            </p>
          </div>
        </footer>
      </motion.div>
    </>
  );
}

"use client";

import { useState } from "react";
import { Star, MessageSquare, Send, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface FeedbackFormProps {
  productSlug: string;
  productName: string;
}

export default function FeedbackForm({ productSlug, productName }: FeedbackFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug,
          productName,
          rating,
          comment,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      }
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-kharis-green-100 dark:border-neutral-800 p-5">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.form
            key="feedback-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="text-center">
              <h3 className="text-sm font-bold text-kharis-green-800 dark:text-neutral-100">
                Was this instruction helpful?
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Let us know your cooking experience.
              </p>
            </div>

            {/* Star Rating Selector */}
            <div className="flex items-center justify-center gap-1.5 py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 cursor-pointer transition-transform active:scale-95"
                >
                  <Star
                    className={`w-6 h-6 transition-colors ${
                      star <= (hoverRating || rating)
                        ? "fill-kharis-gold-500 text-kharis-gold-500"
                        : "text-neutral-300 dark:text-neutral-700"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Comment Field */}
            {rating > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-2 overflow-hidden"
              >
                <div className="relative">
                  <textarea
                    rows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Optional: Any cooking tips or suggestions?"
                    className="w-full px-3 py-2 rounded-lg border border-kharis-green-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-xs text-neutral-700 dark:text-neutral-200
                      placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-kharis-green-500/50 focus:border-kharis-green-500 resize-none"
                  />
                  <MessageSquare className="absolute right-2.5 bottom-2.5 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-8 cursor-pointer rounded-lg text-xs"
                >
                  {submitting ? "Submitting..." : "Submit Experience"}
                  <Send className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </motion.div>
            )}
          </motion.form>
        ) : (
          <motion.div
            key="feedback-success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4 flex flex-col items-center gap-2"
          >
            <CheckCircle className="w-8 h-8 text-emerald-500 animate-in zoom-in duration-300" />
            <h3 className="text-sm font-bold text-kharis-green-800 dark:text-neutral-100">
              Thank you for cooking with us!
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs">
              Your rating has been received. This helps us improve food preparation guides for everyone.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

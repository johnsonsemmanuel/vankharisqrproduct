"use client";

import { ReactNode, useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

type Toast = {
  id: number;
  text: string | ReactNode;
  measuredHeight?: number;
  timeout?: NodeJS.Timeout;
  remaining?: number;
  start?: number;
  pause?: () => void;
  resume?: () => void;
  preserve?: boolean;
  action?: string;
  onAction?: () => void;
  onUndoAction?: () => void;
  type: "message" | "success" | "warning" | "error";
};

let root: ReturnType<typeof createRoot> | null = null;
let toastId = 0;

const toastStore = {
  toasts: [] as Toast[],
  listeners: new Set<() => void>(),

  add(
    text: string | ReactNode,
    type: "message" | "success" | "warning" | "error",
    preserve?: boolean,
    action?: string,
    onAction?: () => void,
    onUndoAction?: () => void
  ) {
    const id = toastId++;

    const toast: Toast = {
      id,
      text,
      preserve,
      action,
      onAction,
      onUndoAction,
      type,
    };

    if (!toast.preserve) {
      toast.remaining = 3000;
      toast.start = Date.now();

      const close = () => {
        this.toasts = this.toasts.filter((t) => t.id !== id);
        this.notify();
      };

      toast.timeout = setTimeout(close, toast.remaining);

      toast.pause = () => {
        if (!toast.timeout) return;
        clearTimeout(toast.timeout);
        toast.timeout = undefined;
        toast.remaining! -= Date.now() - toast.start!;
      };

      toast.resume = () => {
        if (toast.timeout) return;
        toast.start = Date.now();
        toast.timeout = setTimeout(close, toast.remaining);
      };
    }

    this.toasts.push(toast);
    this.notify();
  },

  remove(id: number) {
    toastStore.toasts = toastStore.toasts.filter((t) => t.id !== id);
    toastStore.notify();
  },

  subscribe(listener: () => void) {
    toastStore.listeners.add(listener);
    return () => {
      toastStore.listeners.delete(listener);
    };
  },

  notify() {
    toastStore.listeners.forEach((fn) => fn());
  },
};

const ToastContainer = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [shownIds, setShownIds] = useState<number[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  const measureRef =
    (toast: Toast) =>
    (node: HTMLDivElement | null) => {
      if (node && toast.measuredHeight == null) {
        toast.measuredHeight = node.getBoundingClientRect().height;
        toastStore.notify();
      }
    };

  useEffect(() => {
    setToasts([...toastStore.toasts]);
    return toastStore.subscribe(() => {
      setToasts([...toastStore.toasts]);
    });
  }, []);

  useEffect(() => {
    const unseen = toasts
      .filter((t) => !shownIds.includes(t.id))
      .map((t) => t.id);
    if (unseen.length > 0) {
      requestAnimationFrame(() => {
        setShownIds((prev) => [...prev, ...unseen]);
      });
    }
  }, [toasts]);

  const lastVisibleCount = 3;
  const lastVisibleStart = Math.max(0, toasts.length - lastVisibleCount);

  const getFinalTransform = (index: number, length: number) => {
    if (index === length - 1) return "none";
    const last = toasts[length - 1];
    const measured = last?.measuredHeight ?? 63;
    let translateY = measured;
    for (let i = length - 1; i > index; i--) {
      translateY += isHovered
        ? (toasts[i - 1]?.measuredHeight ?? 63) + 10
        : 20;
    }
    const z = -(length - 1 - index);
    const scale = isHovered ? 1 : 1 - 0.05 * (length - 1 - index);
    return `translate3d(0, calc(100% - ${translateY}px), ${z}px) scale(${scale})`;
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    toastStore.toasts.forEach((t) => t.pause?.());
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    toastStore.toasts.forEach((t) => t.resume?.());
  };

  const visibleToasts = toasts.slice(lastVisibleStart);
  const containerHeight = visibleToasts.reduce(
    (acc, t) => acc + (t.measuredHeight ?? 63),
    0
  );

  const typeStyles: Record<string, string> = {
    message: "bg-white text-gray-800 border border-gray-200 shadow-lg",
    success: "bg-kharis-green-700 text-white shadow-lg",
    warning: "bg-amber-600 text-white shadow-lg",
    error: "bg-red-600 text-white shadow-lg",
  };

  const closeFill: Record<string, string> = {
    message: "text-gray-400",
    success: "text-white/80",
    warning: "text-white/80",
    error: "text-white/80",
  };

  return (
    <div
      className="fixed bottom-4 right-4 z-[9999] pointer-events-none w-[420px]"
      style={{ height: containerHeight }}
    >
      <div
        className="relative pointer-events-auto w-full"
        style={{ height: containerHeight }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {toasts.map((toast, index) => {
          const isVisible = index >= lastVisibleStart;

          return (
            <div
              key={toast.id}
              ref={measureRef(toast)}
              className={cn(
                "absolute right-0 bottom-0 rounded-xl p-4 leading-[21px] h-fit",
                typeStyles[toast.type],
                isVisible ? "opacity-100" : "opacity-0",
                index < lastVisibleStart && "pointer-events-none"
              )}
              style={{
                width: 420,
                transition: "all .35s cubic-bezier(.25,.75,.6,.98)",
                transform: shownIds.includes(toast.id)
                  ? getFinalTransform(index, toasts.length)
                  : "translate3d(0, 100%, 150px) scale(1)",
              }}
            >
              <div className="flex flex-col items-center justify-between text-sm">
                <div className="w-full h-full flex items-center justify-between gap-4">
                  <span>{toast.text}</span>
                  {!toast.action && (
                    <div className="flex items-center gap-1 shrink-0">
                      {toast.onUndoAction && (
                        <button
                          onClick={() => {
                            toast.onUndoAction?.();
                            toastStore.remove(toast.id);
                          }}
                          className="text-xs underline underline-offset-2 opacity-70 hover:opacity-100 transition-opacity"
                        >
                          Undo
                        </button>
                      )}
                      <button
                        onClick={() => toastStore.remove(toast.id)}
                        className={cn(
                          "p-0.5 rounded-lg transition-colors hover:bg-black/10",
                          closeFill[toast.type]
                        )}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                {toast.action && (
                  <div className="w-full flex items-center justify-end gap-2 mt-3">
                    <button
                      onClick={() => toastStore.remove(toast.id)}
                      className="text-xs underline underline-offset-2 opacity-70 hover:opacity-100 transition-opacity"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => {
                        toast.onAction?.();
                        toastStore.remove(toast.id);
                      }}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      {toast.action}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const mountContainer = () => {
  if (root) return;
  const el = document.createElement("div");
  el.className = "fixed bottom-4 right-4 z-[9999]";
  document.body.appendChild(el);
  root = createRoot(el);
  root.render(<ToastContainer />);
};

interface Message {
  text: string | ReactNode;
  preserve?: boolean;
  action?: string;
  onAction?: () => void;
  onUndoAction?: () => void;
}

export const useToasts = () => {
  return {
    message: useCallback(
      ({ text, preserve, action, onAction, onUndoAction }: Message) => {
        mountContainer();
        toastStore.add(
          text,
          "message",
          preserve,
          action,
          onAction,
          onUndoAction
        );
      },
      []
    ),
    success: useCallback((text: string) => {
      mountContainer();
      toastStore.add(text, "success");
    }, []),
    warning: useCallback((text: string) => {
      mountContainer();
      toastStore.add(text, "warning");
    }, []),
    error: useCallback((text: string) => {
      mountContainer();
      toastStore.add(text, "error");
    }, []),
  };
};

'use client';

import * as React from 'react';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  type LucideIcon,
} from 'lucide-react';
import {
  motion,
  AnimatePresence,
  type PanInfo,
} from 'motion/react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number; // ms, 0 = persistent
  action?: { label: string; onClick: () => void };
}

export interface ToastViewportProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Variant config                                                     */
/* ------------------------------------------------------------------ */

const VARIANT_CONFIG: Record<
  ToastVariant,
  { icon: LucideIcon; accent: string; bg: string; border: string; fg: string }
> = {
  success: {
    icon: CheckCircle2,
    accent: '#10B981',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-200 dark:border-emerald-800',
    fg: 'text-emerald-900 dark:text-emerald-100',
  },
  error: {
    icon: AlertCircle,
    accent: '#EF4444',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    border: 'border-rose-200 dark:border-rose-800',
    fg: 'text-rose-900 dark:text-rose-100',
  },
  warning: {
    icon: AlertTriangle,
    accent: '#F59E0B',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-200 dark:border-amber-800',
    fg: 'text-amber-900 dark:text-amber-100',
  },
  info: {
    icon: Info,
    accent: '#2563EB',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    border: 'border-blue-200 dark:border-blue-800',
    fg: 'text-blue-900 dark:text-blue-100',
  },
};

/* ------------------------------------------------------------------ */
/* Single toast                                                       */
/* ------------------------------------------------------------------ */

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  const config = VARIANT_CONFIG[toast.variant ?? 'info'];
  const Icon = config.icon;

  // Swipe-to-dismiss
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100 || Math.abs(info.offset.y) > 80) {
      onDismiss(toast.id);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 32, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 32, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.6}
      onDragEnd={onDragEnd}
      role="status"
      aria-live={toast.variant === 'error' ? 'assertive' : 'polite'}
      className={cn(
        'pointer-events-auto flex w-full items-start gap-3 rounded-xl border p-3.5 shadow-lg backdrop-blur-sm',
        config.bg,
        config.border,
        config.fg,
      )}
    >
      {/* icon */}
      <Icon className="mt-0.5 size-5 shrink-0" style={{ color: config.accent }} aria-hidden />

      {/* content */}
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold">{toast.title}</div>
        {toast.description && (
          <div className="mt-0.5 text-xs opacity-80">{toast.description}</div>
        )}
        {toast.action && (
          <button
            onClick={() => {
              toast.action!.onClick();
              onDismiss(toast.id);
            }}
            className="mt-2 inline-flex h-7 items-center rounded-md px-2.5 text-xs font-semibold transition hover:bg-black/5 dark:hover:bg-white/10"
            style={{ color: config.accent }}
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {/* dismiss */}
      <button
        onClick={() => onDismiss(toast.id)}
        className="grid size-7 shrink-0 place-items-center rounded-md opacity-50 transition hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10"
        aria-label="Dismiss notification"
      >
        <X className="size-3.5" />
      </button>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Viewport (top-right on desktop, top on mobile)                     */
/* ------------------------------------------------------------------ */

function ToastViewport({ toasts, onDismiss, className }: ToastViewportProps) {
  return (
    <div
      className={cn(
        'pointer-events-none fixed top-4 right-4 z-[200] flex w-full max-w-sm flex-col gap-2 sm:top-6 sm:right-6',
        className,
      )}
      role="region"
      aria-label="Notifications"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hook: useToasts                                                    */
/* ------------------------------------------------------------------ */

export function useToasts() {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const timeouts = React.useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const handle = timeouts.current.get(id);
    if (handle) {
      clearTimeout(handle);
      timeouts.current.delete(id);
    }
  }, []);

  const toast = React.useCallback(
    (t: Omit<Toast, 'id'> & { id?: string }) => {
      const id = t.id ?? Math.random().toString(36).slice(2);
      const duration = t.duration ?? 5000;
      setToasts((prev) => [...prev, { ...t, id }]);
      if (duration > 0) {
        const handle = setTimeout(() => dismiss(id), duration);
        timeouts.current.set(id, handle);
      }
      return id;
    },
    [dismiss],
  );

  // cleanup on unmount
  React.useEffect(() => {
    return () => {
      timeouts.current.forEach((h) => clearTimeout(h));
      timeouts.current.clear();
    };
  }, []);

  return { toasts, toast, dismiss };
}

export { ToastViewport as default, ToastViewport };

'use client';

import * as React from 'react';
import {
  Search,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface CommandItem {
  id: string;
  label: string;
  hint?: string;
  icon?: React.ElementType;
  group: string;
  keywords?: string;
  shortcut?: string[];
  disabled?: boolean;
  onSelect?: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CommandItem[];
  placeholder?: string;
  emptyText?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Fuzzy match (case-insensitive substring, weighted by position)     */
/* ------------------------------------------------------------------ */

function fuzzyMatch(query: string, text: string): number {
  if (!query) return 1;
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  const idx = t.indexOf(q);
  if (idx === -1) return 0;
  // earlier match = higher score
  return 1 - idx / (t.length + 1);
}

/* ------------------------------------------------------------------ */
/* Keyboard hint chips                                                */
/* ------------------------------------------------------------------ */

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-[20px] items-center justify-center rounded border border-neutral-300 bg-neutral-100 px-1 font-mono text-[10px] font-medium text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400">
      {children}
    </kbd>
  );
}

/* ------------------------------------------------------------------ */
/* Main component                                                     */
/* ------------------------------------------------------------------ */

function CommandPalette({
  open,
  onOpenChange,
  items,
  placeholder = 'Search commands…',
  emptyText = 'No matching commands.',
  className,
}: CommandPaletteProps) {
  const [query, setQuery] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  // Reset on open
  React.useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      // focus input next tick (after render)
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Filter + score
  const filtered = React.useMemo(() => {
    if (!query.trim()) return items;
    return items
      .map((item) => {
        const score = Math.max(
          fuzzyMatch(query, item.label),
          fuzzyMatch(query, item.keywords || ''),
          fuzzyMatch(query, item.group),
        );
        return { item, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.item);
  }, [items, query]);

  // Group filtered items (preserve order, group consecutively)
  const grouped = React.useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    filtered.forEach((item) => {
      if (!map.has(item.group)) map.set(item.group, []);
      map.get(item.group)!.push(item);
    });
    return Array.from(map.entries());
  }, [filtered]);

  // Flat index for keyboard nav
  const flat = filtered;

  // Clamp active index
  React.useEffect(() => {
    if (activeIndex >= flat.length) setActiveIndex(0);
  }, [flat.length, activeIndex]);

  // Scroll active into view
  React.useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${activeIndex}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  // Keyboard handling
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flat.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = flat[activeIndex];
      if (item && !item.disabled) {
        item.onSelect?.();
        onOpenChange(false);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onOpenChange(false);
    }
  };

  // Render
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-zinc-950/60 backdrop-blur-sm pt-[15vh] px-4"
          onClick={() => onOpenChange(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={onKeyDown}
            className={cn(
              'w-full max-w-xl overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-zinc-900',
              className,
            )}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-neutral-200 px-4 dark:border-neutral-800">
              <Search className="size-4 shrink-0 text-neutral-400" aria-hidden />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                placeholder={placeholder}
                aria-label={placeholder}
                aria-autocomplete="list"
                aria-controls="command-list"
                aria-activedescendant={flat[activeIndex]?.id}
                className="h-12 flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-white"
              />
              <Kbd>
                <X className="size-3" />
              </Kbd>
            </div>

            {/* Results */}
            <div
              ref={listRef}
              id="command-list"
              role="listbox"
              className="max-h-[320px] overflow-y-auto p-2"
            >
              {flat.length === 0 ? (
                <div className="grid place-items-center py-10 text-sm text-neutral-400">
                  {emptyText}
                </div>
              ) : (
                grouped.map(([group, groupItems]) => (
                  <div key={group} className="mb-2 last:mb-0">
                    <div className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
                      {group}
                    </div>
                    {groupItems.map((item) => {
                      const idx = flat.indexOf(item);
                      const active = idx === activeIndex;
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.id}
                          id={item.id}
                          data-idx={idx}
                          role="option"
                          aria-selected={active}
                          onMouseEnter={() => setActiveIndex(idx)}
                          onClick={() => {
                            if (!item.disabled) {
                              item.onSelect?.();
                              onOpenChange(false);
                            }
                          }}
                          className={cn(
                            'flex min-h-[44px] cursor-pointer items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors',
                            active
                              ? 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white'
                              : 'text-neutral-600 dark:text-neutral-300',
                            item.disabled && 'cursor-not-allowed opacity-40',
                          )}
                        >
                          <div className="flex min-w-0 flex-1 items-center gap-2.5">
                            {Icon && (
                              <Icon className="size-4 shrink-0 text-neutral-400" aria-hidden />
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="truncate font-medium">{item.label}</div>
                              {item.hint && (
                                <div className="truncate text-xs text-neutral-400">
                                  {item.hint}
                                </div>
                              )}
                            </div>
                          </div>
                          {item.shortcut && (
                            <div className="flex shrink-0 items-center gap-1">
                              {item.shortcut.map((key) => (
                                <Kbd key={key}>{key}</Kbd>
                              ))}
                            </div>
                          )}
                          {active && !item.disabled && (
                            <CornerDownLeft className="size-3.5 shrink-0 text-neutral-400" aria-hidden />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-neutral-200 px-4 py-2 text-[11px] text-neutral-400 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Kbd><ArrowUp className="size-3" /></Kbd>
                  <Kbd><ArrowDown className="size-3" /></Kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <Kbd><CornerDownLeft className="size-3" /></Kbd>
                  select
                </span>
                <span className="flex items-center gap-1">
                  <Kbd>esc</Kbd>
                  close
                </span>
              </div>
              <span className="font-mono">{flat.length} results</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { CommandPalette as default, CommandPalette };

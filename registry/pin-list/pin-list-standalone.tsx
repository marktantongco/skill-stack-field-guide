'use client';

import * as React from 'react';
import { Pin, Search, GripVertical } from 'lucide-react';
import {
  motion,
  LayoutGroup,
  AnimatePresence,
  Reorder,
  type HTMLMotionProps,
  type Transition,
} from 'motion/react';

// Inline cn to keep the component self-contained
function cn(...classes: Array<string | undefined | false | null>): string {
  return classes.filter(Boolean).join(' ');
}

export interface PinListItem {
  id: string | number;
  name: string;
  info?: string;
  icon?: React.ElementType;
  pinned?: boolean;
  metadata?: React.ReactNode;
}

export interface PinListProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  items: PinListItem[];
  labels?: { pinned?: string; unpinned?: string; searchPlaceholder?: string; empty?: string; noResults?: string; };
  enableDragReorder?: boolean;
  enableSearch?: boolean;
  enableQuickUnpin?: boolean;
  transition?: Transition;
  className?: string;
  itemClassName?: string;
  labelClassName?: string;
  zIndexResetDelay?: number;
  onItemsChange?: (items: PinListItem[]) => void;
  onTogglePin?: (id: string | number, pinned: boolean) => void;
}

const DEFAULT_TRANSITION: Transition = { stiffness: 320, damping: 22, mass: 0.8, type: 'spring' };

const LABEL_MOTION: HTMLMotionProps<'p'> = {
  initial: { opacity: 0, y: -4 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -4 },
  transition: { duration: 0.22, ease: 'easeInOut' },
};

export default function PinList({
  items,
  labels = { pinned: 'Pinned', unpinned: 'All items', searchPlaceholder: 'Search…', empty: 'Nothing here yet.', noResults: 'No matches.' },
  enableDragReorder = false,
  enableSearch = false,
  enableQuickUnpin = false,
  transition = DEFAULT_TRANSITION,
  className, itemClassName, labelClassName,
  zIndexResetDelay = 500,
  onItemsChange, onTogglePin, ...props
}: PinListProps) {
  const [listItems, setListItems] = React.useState(items);
  const [togglingGroup, setTogglingGroup] = React.useState<'pinned' | 'unpinned' | null>(null);
  const [query, setQuery] = React.useState('');

  React.useEffect(() => { setListItems(items); }, [items]);

  const update = React.useCallback((next: PinListItem[]) => { setListItems(next); onItemsChange?.(next); }, [onItemsChange]);

  const togglePin = React.useCallback((id: string | number) => {
    const item = listItems.find((u) => u.id === id);
    if (!item) return;
    setTogglingGroup(item.pinned ? 'pinned' : 'unpinned');
    update(
      listItems.flatMap((u) => u.id !== id ? [u] : [{ ...u, pinned: !u.pinned }]).sort((a, b) => Number(b.pinned) - Number(a.pinned)),
    );
    if (onTogglePin) onTogglePin(id, !(item.pinned ?? false));
    window.setTimeout(() => setTogglingGroup(null), zIndexResetDelay);
  }, [listItems, onTogglePin, update, zIndexResetDelay]);

  const q = query.trim().toLowerCase();
  const filtered = q ? listItems.filter((u) => u.name.toLowerCase().includes(q) || (u.info?.toLowerCase().includes(q) ?? false)) : listItems;
  const pinned = filtered.filter((u) => u.pinned);
  const unpinned = filtered.filter((u) => !u.pinned);
  const hasAny = listItems.length > 0;
  const hasResults = filtered.length > 0;

  const Row = ({ item, isPinned }: { item: PinListItem; isPinned: boolean }) => {
    const Icon = item.icon;
    const row = (
      <motion.div
        layoutId={`item-${item.id}`}
        onClick={() => togglePin(item.id)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); togglePin(item.id); } }}
        transition={transition}
        role="button" tabIndex={0}
        aria-label={`${isPinned ? 'Unpin' : 'Pin'} ${item.name}`}
        aria-pressed={isPinned}
        className={cn('group flex min-h-[56px] cursor-pointer items-center justify-between gap-3 rounded-2xl border border-transparent bg-neutral-100 p-2.5 outline-none transition-colors hover:border-neutral-200 hover:bg-neutral-200/60 dark:bg-neutral-800/60 dark:hover:border-neutral-700 dark:hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background', itemClassName)}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          {enableDragReorder && <GripVertical className="size-4 shrink-0 cursor-grab text-neutral-400 opacity-0 group-hover:opacity-100 active:cursor-grabbing" aria-hidden />}
          {Icon && <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-background text-neutral-500 dark:text-neutral-400"><Icon className="size-4.5" /></div>}
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">{item.name}</div>
            {item.info && <div className="truncate text-xs font-medium text-neutral-500 dark:text-neutral-400">{item.info}</div>}
          </div>
          {item.metadata && <div className="shrink-0 text-xs text-neutral-400">{item.metadata}</div>}
        </div>
        <div className={cn('grid size-9 shrink-0 place-items-center rounded-full transition-all duration-200', isPinned ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-500/30' : 'bg-neutral-300 text-neutral-500 opacity-0 group-hover:opacity-100 dark:bg-neutral-700 dark:text-neutral-300')}>
          <Pin className={cn('size-4', isPinned && 'fill-current')} />
        </div>
      </motion.div>
    );
    if (enableDragReorder) return <Reorder.Item value={item} as="div" className="list-none" whileDrag={{ scale: 1.03, zIndex: 50, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>{row}</Reorder.Item>;
    return row;
  };

  return (
    <motion.div className={cn('w-full space-y-6', className)} {...props}>
      {enableSearch && hasAny && (
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" aria-hidden />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={labels.searchPlaceholder} aria-label={labels.searchPlaceholder}
            className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-100 pl-10 pr-4 text-sm outline-none transition placeholder:text-neutral-400 focus:border-emerald-500 focus:bg-background focus:ring-2 focus:ring-emerald-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:focus:bg-neutral-900" />
        </div>
      )}
      {!hasAny && <div className="grid place-items-center rounded-2xl border border-dashed border-neutral-200 py-12 text-sm text-neutral-400 dark:border-neutral-800">{labels.empty}</div>}
      {hasAny && !hasResults && <div className="grid place-items-center rounded-2xl border border-dashed border-neutral-200 py-12 text-sm text-neutral-400 dark:border-neutral-800">{labels.noResults}</div>}
      <LayoutGroup>
        {hasResults && pinned.length > 0 && (
          <section aria-label={labels.pinned}>
            <AnimatePresence><motion.p layout key="pinned-label" className={cn('mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400', labelClassName)} {...LABEL_MOTION}>{labels.pinned} · {pinned.length}</motion.p></AnimatePresence>
            <div className={cn('relative space-y-2', togglingGroup === 'pinned' ? 'z-5' : 'z-10')}>
              {enableDragReorder ? (
                <Reorder.Group axis="y" values={pinned} onReorder={(r) => update([...r, ...listItems.filter((u) => !u.pinned)])} as="div" className="space-y-2">
                  {pinned.map((item) => <Row key={item.id} item={item} isPinned />)}
                </Reorder.Group>
              ) : pinned.map((item) => <Row key={item.id} item={item} isPinned />)}
            </div>
          </section>
        )}
        {hasResults && unpinned.length > 0 && (
          <section aria-label={labels.unpinned}>
            <AnimatePresence><motion.p layout key="unpinned-label" className={cn('mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400', labelClassName)} {...LABEL_MOTION}>{labels.unpinned} · {unpinned.length}</motion.p></AnimatePresence>
            <div className={cn('relative space-y-2', togglingGroup === 'unpinned' ? 'z-5' : 'z-10')}>
              {enableDragReorder ? (
                <Reorder.Group axis="y" values={unpinned} onReorder={(r) => update([...listItems.filter((u) => u.pinned), ...r])} as="div" className="space-y-2">
                  {unpinned.map((item) => <Row key={item.id} item={item} isPinned={false} />)}
                </Reorder.Group>
              ) : unpinned.map((item) => <Row key={item.id} item={item} isPinned={false} />)}
            </div>
          </section>
        )}
      </LayoutGroup>
    </motion.div>
  );
}

export { PinList };

'use client';

import * as React from 'react';
import { Star, Bell, CreditCard, Lock, User, Mail, Settings, Bookmark } from 'lucide-react';
import { PinList, type PinListItem } from './pin-list';

const SAMPLE: PinListItem[] = [
  { id: 1, name: 'Account security', info: '2FA, password, sessions', icon: Lock, pinned: true, metadata: '2FA' },
  { id: 2, name: 'Notifications', info: 'Email, push, SMS', icon: Bell, pinned: true, metadata: '3' },
  { id: 3, name: 'Payment methods', info: 'Cards, banks, wallets', icon: CreditCard },
  { id: 4, name: 'Profile', info: 'Name, photo, bio', icon: User },
  { id: 5, name: 'Email preferences', info: 'Marketing, product, security', icon: Mail },
  { id: 6, name: 'Bookmarks', info: '48 saved', icon: Bookmark },
  { id: 7, name: 'Starred items', info: 'Quick access', icon: Star },
  { id: 8, name: 'Advanced settings', info: 'Developer, experimental', icon: Settings },
];

export default function Demo() {
  const [items, setItems] = React.useState(SAMPLE);
  return (
    <div className="mx-auto max-w-md p-4">
      <h2 className="mb-4 text-lg font-semibold">Settings</h2>
      <PinList
        items={items}
        enableSearch
        enableQuickUnpin
        onItemsChange={setItems}
        labels={{
          pinned: 'Pinned',
          unpinned: 'All items',
          searchPlaceholder: 'Search settings…',
        }}
      />
    </div>
  );
}

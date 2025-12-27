'use client';

import Link from 'next/link';
import {
  Tag,
  Palette,
  Briefcase,
  Star,
  Code,
  Megaphone,
  Heart,
  Hash,
  BookOpen,
  FileText,
  HelpCircle,
  MessageCircle,
  Users,
  Mail,
  Trophy,
  Phone,
} from 'lucide-react';
import { megaMenuProducts, megaMenuMore } from '@/data/dashboard/sampleData';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  tag: Tag,
  palette: Palette,
  briefcase: Briefcase,
  star: Star,
  code: Code,
  megaphone: Megaphone,
  heart: Heart,
  hash: Hash,
  book: BookOpen,
  'file-text': FileText,
  'help-circle': HelpCircle,
  'message-circle': MessageCircle,
  users: Users,
  mail: Mail,
  trophy: Trophy,
  phone: Phone,
};

interface MegaMenuProps {
  type: 'products' | 'more';
}

export const MegaMenu = ({ type }: MegaMenuProps) => {
  const items = type === 'products' ? megaMenuProducts : megaMenuMore;

  return (
    <div className="absolute left-1/2 top-full z-50 pt-2 -translate-x-1/2">
      <div className="w-96 rounded-xl border border-secondary-200 bg-white p-4 shadow-lg dark:border-secondary-700 dark:bg-secondary-900 lg:w-[480px]">
        <div className="grid grid-cols-2 gap-2">
          {items.map((item) => {
            const Icon = iconMap[item.icon] || Tag;
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-secondary-100 dark:hover:bg-secondary-800"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary-100 dark:bg-secondary-800">
                  <Icon className="h-4 w-4 text-secondary-500 dark:text-secondary-400" />
                </div>
                <span className="text-sm font-medium text-secondary-900 dark:text-white">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

'use client';

import { Search, Plus, ArrowUpRight, Brain, Triangle, Database } from 'lucide-react';
import { partners } from '@/data/dashboard/sampleData';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  brain: Brain,
  triangle: Triangle,
  database: Database,
};

const gradientMap: Record<string, string> = {
  blue: 'from-blue-50 to-white dark:from-blue-950/20 dark:to-secondary-800/50',
  lavender: 'from-purple-50 to-white dark:from-purple-950/20 dark:to-secondary-800/50',
  green: 'from-green-50 to-white dark:from-green-950/20 dark:to-secondary-800/50',
};

export const RightSidebar = () => {
  return (
    <aside className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-400" />
        <input
          type="text"
          placeholder="Search a product"
          className="w-full rounded-xl border border-secondary-200 bg-white py-2.5 pl-10 pr-16 text-sm text-secondary-900 placeholder-secondary-400 transition-colors focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-secondary-700 dark:bg-secondary-800/50 dark:text-white dark:placeholder-secondary-500 dark:focus:border-primary-500 dark:focus:ring-primary-900/50"
        />
        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
          <kbd className="rounded border border-secondary-200 bg-secondary-100 px-1.5 py-0.5 text-xs text-secondary-500 dark:border-secondary-600 dark:bg-secondary-700 dark:text-secondary-400">
            ⌘
          </kbd>
          <kbd className="rounded border border-secondary-200 bg-secondary-100 px-1.5 py-0.5 text-xs text-secondary-500 dark:border-secondary-600 dark:bg-secondary-700 dark:text-secondary-400">
            K
          </kbd>
        </div>
      </div>

      {/* Submit Product Button */}
      <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-500 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-600">
        <Plus className="h-4 w-4" />
        Submit a product
      </button>

      {/* Partners Section */}
      <div>
        <div className="mb-3">
          <span className="text-xs font-medium uppercase tracking-wider text-secondary-500 dark:text-secondary-400">
            Our Partners
          </span>
        </div>
        <div className="space-y-3">
          {partners.map((partner) => {
            const Icon = iconMap[partner.icon] || Brain;
            return (
              <div
                key={partner.id}
                className={cn(
                  'rounded-xl border border-secondary-200 bg-gradient-to-br p-4 dark:border-secondary-700',
                  gradientMap[partner.gradient]
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-800">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-secondary-900 dark:text-white">
                        {partner.name}
                      </h4>
                      <p className="mt-0.5 text-xs text-secondary-500 dark:text-secondary-400">
                        {partner.description}
                      </p>
                    </div>
                  </div>
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex shrink-0 items-center gap-1 text-xs text-secondary-500 transition-colors hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300"
                  >
                    Visit
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
